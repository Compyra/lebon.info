// Network Scanner Script
let scanActive = false;
let activeHosts = [];
let scannedCount = 0;
let autoRepeatInterval = null;
let hostsMap = new Map(); // Store hosts by IP for persistence
let rangeScanActive = false;

// Scan IP ranges for .1 addresses
async function scanIPRange(baseIP) {
    if (rangeScanActive) {
        alert('A range scan is already in progress. Please wait.');
        return;
    }

    rangeScanActive = true;
    const resultsDiv = document.getElementById('rangeResults');
    const buttons = document.querySelectorAll('.btn-range');
    
    // Disable all buttons during scan
    buttons.forEach(btn => btn.disabled = true);
    
    resultsDiv.innerHTML = '<p class="loading">Scanning for gateway addresses...</p>';
    
    let rangeStart, rangeEnd, ipBase;
    
    // Determine the range based on the network
    if (baseIP === '192.168') {
        rangeStart = 0;
        rangeEnd = 255;
        ipBase = '192.168';
    } else if (baseIP === '172.16') {
        rangeStart = 16;
        rangeEnd = 31;
        ipBase = '172';
    } else if (baseIP === '10.0') {
        rangeStart = 0;
        rangeEnd = 255;
        ipBase = '10';
    }
    
    const foundIPs = [];
    const batchSize = 5; // Reduced batch size for more reliable scanning
    
    for (let i = rangeStart; i <= rangeEnd; i += batchSize) {
        if (!rangeScanActive) break; // Allow cancellation
        
        const batch = [];
        const batchEnd = Math.min(i + batchSize - 1, rangeEnd);
        
        for (let j = i; j <= batchEnd; j++) {
            let ip;
            if (baseIP === '192.168') {
                ip = `${ipBase}.${j}.1`;
            } else if (baseIP === '172.16') {
                ip = `${ipBase}.${j}.0.1`;
            } else if (baseIP === '10.0') {
                ip = `${ipBase}.${j}.0.1`;
            }
            batch.push(scanIP(ip, 2000)); // Increased timeout for gateway detection
        }
        
        const results = await Promise.all(batch);
        
        results.forEach(result => {
            if (result.active) {
                foundIPs.push(result.ip);
            }
        });
        
        // Update progress
        const progress = Math.round(((i - rangeStart + batchSize) / (rangeEnd - rangeStart + 1)) * 100);
        resultsDiv.innerHTML = `<p class="loading">Scanning... ${Math.min(progress, 100)}% (Found: ${foundIPs.length})</p>`;
    }
    
    // Display results
    if (foundIPs.length > 0) {
        resultsDiv.innerHTML = `
            <p class="success">Found ${foundIPs.length} active gateway(s):</p>
            <div class="found-ips">
                ${foundIPs.map(ip => {
                    const networkBase = ip.substring(0, ip.lastIndexOf('.'));
                    return `
                        <div class="found-ip-item">
                            <span class="ip-address">${ip}</span>
                            <button class="btn-use" onclick="useNetwork('${networkBase}')">Use ${networkBase}</button>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    } else {
        resultsDiv.innerHTML = '<p class="warning">No active gateways found in this range.</p>';
    }
    
    // Re-enable buttons
    buttons.forEach(btn => btn.disabled = false);
    rangeScanActive = false;
}

function useNetwork(networkBase) {
    document.getElementById('networkBase').value = networkBase;
    // Optionally scroll to the scan section
    document.querySelector('.section:nth-child(2)').scrollIntoView({ behavior: 'smooth' });
}

// Scan a single IP address
async function scanIP(ip, timeout) {
    const startTime = Date.now();
    
    // Try HTTPS first, then HTTP
    const protocols = ['https', 'http'];
    
    for (const protocol of protocols) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), timeout);
            
            // Start the fetch request
            const fetchPromise = fetch(`${protocol}://${ip}/`, {
                method: 'HEAD',
                mode: 'no-cors',
                cache: 'no-cache',
                signal: controller.signal
            });
            
            // Add minimum wait time to ensure we don't return too quickly
            const minWaitPromise = new Promise(resolve => setTimeout(resolve, 50));
            
            // Wait for both the fetch and minimum wait time
            const [response] = await Promise.all([fetchPromise, minWaitPromise]);
            
            clearTimeout(timeoutId);
            const responseTime = Date.now() - startTime;
            
            // If we got any response (even opaque), the host is active
            return { ip, active: true, responseTime, protocol };
        } catch (error) {
            // Wait minimum time even on error to avoid false negatives
            const elapsed = Date.now() - startTime;
            if (elapsed < 50) {
                await new Promise(resolve => setTimeout(resolve, 50 - elapsed));
            }
            
            // Continue to next protocol or return inactive
            if (error.name === 'AbortError') {
                // Timeout - try next protocol
                continue;
            }
            // Network errors - try next protocol
            continue;
        }
    }
    
    // If both protocols failed, host is inactive
    return { ip, active: false };
}

// Try to get HTTP status and headers
async function getHostInfo(ip) {
    const info = {
        httpStatus: null,
        httpsStatus: null,
        headers: {},
        ports: {
            http: false,
            https: false
        }
    };

    // Check HTTP port (80) with status and headers
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);
        
        const httpResponse = await fetch(`http://${ip}/`, {
            method: 'HEAD',
            mode: 'cors',
            cache: 'no-cache',
            signal: controller.signal
        }).catch(async () => {
            // Try no-cors mode if CORS fails
            return await fetch(`http://${ip}/`, {
                method: 'GET',
                mode: 'no-cors',
                cache: 'no-cache',
                signal: controller.signal
            }).catch(() => null);
        });
        
        clearTimeout(timeoutId);
        
        if (httpResponse) {
            info.ports.http = true;
            if (httpResponse.type !== 'opaque') {
                info.httpStatus = httpResponse.status;
                // Get useful headers
                const headerKeys = ['server', 'content-type', 'x-powered-by', 'location'];
                headerKeys.forEach(key => {
                    const value = httpResponse.headers.get(key);
                    if (value) {
                        info.headers[key] = value;
                    }
                });
            } else {
                info.httpStatus = 'Accessible (CORS blocked)';
            }
        }
    } catch (e) {
        // HTTP port not accessible
        info.ports.http = false;
    }

    // Check HTTPS port (443) with status and headers
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);
        
        const httpsResponse = await fetch(`https://${ip}/`, {
            method: 'HEAD',
            mode: 'cors',
            cache: 'no-cache',
            signal: controller.signal
        }).catch(async () => {
            // Try no-cors mode if CORS fails
            return await fetch(`https://${ip}/`, {
                method: 'GET',
                mode: 'no-cors',
                cache: 'no-cache',
                signal: controller.signal
            }).catch(() => null);
        });
        
        clearTimeout(timeoutId);
        
        if (httpsResponse) {
            info.ports.https = true;
            if (httpsResponse.type !== 'opaque') {
                info.httpsStatus = httpsResponse.status;
            } else {
                info.httpsStatus = 'Accessible (CORS blocked)';
            }
        }
    } catch (e) {
        // HTTPS port not accessible
        info.ports.https = false;
    }

    return info;
}

// Perform network scan
async function performScan() {
    const networkBase = document.getElementById('networkBase').value.trim();
    const startRange = parseInt(document.getElementById('startRange').value);
    const endRange = parseInt(document.getElementById('endRange').value);
    const timeout = parseInt(document.getElementById('timeout').value);

    if (!networkBase || !networkBase.match(/^(\d{1,3}\.){2}\d{1,3}$/)) {
        alert('Please enter a valid network base (e.g., 192.168.1)');
        return;
    }

    if (startRange < 1 || endRange > 254 || startRange > endRange) {
        alert('Please enter a valid IP range (1-254)');
        return;
    }

    // Reset scan count but preserve hosts if they exist
    scanActive = true;
    scannedCount = 0;
    
    const resultsDiv = document.getElementById('results');
    const progressContainer = document.getElementById('progressContainer');
    const scanBtn = document.getElementById('scanBtn');
    const stopBtn = document.getElementById('stopBtn');
    const exportBtn = document.getElementById('exportBtn');
    const clearBtn = document.getElementById('clearBtn');

    scanBtn.disabled = true;
    stopBtn.disabled = false;
    clearBtn.disabled = true;
    progressContainer.style.display = 'block';
    
    if (hostsMap.size === 0) {
        resultsDiv.innerHTML = '<p class="loading">Scanning network...</p>';
    }

    const totalIPs = endRange - startRange + 1;
    const batchSize = 5; // Reduced batch size for more reliable scanning

    for (let i = startRange; i <= endRange && scanActive; i += batchSize) {
        const batch = [];
        const batchEnd = Math.min(i + batchSize - 1, endRange);

        for (let j = i; j <= batchEnd; j++) {
            const ip = `${networkBase}.${j}`;
            batch.push(scanIP(ip, timeout));
        }

        const results = await Promise.all(batch);
        
        // Process results and get additional info for active hosts
        for (const result of results) {
            scannedCount++;
            if (result.active) {
                const now = new Date().toISOString();
                
                // Check if host already exists
                if (hostsMap.has(result.ip)) {
                    // Update existing host
                    const existingHost = hostsMap.get(result.ip);
                    existingHost.lastSeen = now;
                    existingHost.responseTime = result.responseTime;
                } else {
                    // Get additional host information for new hosts
                    const hostInfo = await getHostInfo(result.ip);
                    hostsMap.set(result.ip, {
                        ...result,
                        ...hostInfo,
                        firstSeen: now,
                        lastSeen: now
                    });
                }
                updateResults(); // Update after each active host is found
            }
        }

        updateProgress(scannedCount, totalIPs);
    }

    // Scan complete
    scanActive = false;
    scanBtn.disabled = false;
    stopBtn.disabled = true;
    clearBtn.disabled = false;
    if (hostsMap.size > 0) {
        exportBtn.style.display = 'inline-block';
    }
    
    if (hostsMap.size === 0) {
        resultsDiv.innerHTML = '<p class="info">No active hosts found. Note: This scan method has limitations due to browser security. Not all devices may be detected.</p>';
    }
    
    // Check if auto-repeat is enabled
    const autoRepeat = document.getElementById('autoRepeat').checked;
    if (autoRepeat && !autoRepeatInterval) {
        const repeatDelay = 10000; // 10 seconds between scans
        autoRepeatInterval = setTimeout(() => {
            autoRepeatInterval = null;
            performScan();
        }, repeatDelay);
    }
}

function updateProgress(current, total) {
    const percentage = (current / total) * 100;
    document.getElementById('progressFill').style.width = percentage + '%';
    document.getElementById('progressText').textContent = `Scanning: ${current}/${total} (${Math.round(percentage)}%)`;
}

function updateResults() {
    // Convert map to array for display
    activeHosts = Array.from(hostsMap.values());
    
    document.getElementById('activeCount').textContent = activeHosts.length;
    document.getElementById('scannedCount').textContent = scannedCount;

    if (activeHosts.length > 0) {
        const resultsDiv = document.getElementById('results');
        resultsDiv.innerHTML = activeHosts.map(host => {
            const firstSeen = host.firstSeen ? new Date(host.firstSeen).toLocaleString() : 'N/A';
            const lastSeen = host.lastSeen ? new Date(host.lastSeen).toLocaleString() : 'N/A';
            
            // Format headers for display
            let headersHTML = '';
            if (host.headers && Object.keys(host.headers).length > 0) {
                headersHTML = '<div class="detail-item"><span class="detail-label">Headers:</span><div class="headers-list">';
                for (const [key, value] of Object.entries(host.headers)) {
                    headersHTML += `<div class="header-entry"><strong>${key}:</strong> ${value}</div>`;
                }
                headersHTML += '</div></div>';
            }
            
            return `
            <div class="result-item">
                <div class="host-main-info">
                    <span class="ip-address">${host.ip}</span>
                    <span class="status active">Active</span>
                    ${host.responseTime ? `<span class="response-time">${host.responseTime}ms</span>` : ''}
                </div>
                <div class="host-details">
                    ${host.httpStatus ? `<div class="detail-item"><span class="detail-label">HTTP Status:</span> <span class="detail-value status-code">${host.httpStatus}</span></div>` : ''}
                    ${host.httpsStatus ? `<div class="detail-item"><span class="detail-label">HTTPS Status:</span> <span class="detail-value status-code">${host.httpsStatus}</span></div>` : ''}
                    ${headersHTML}
                    <div class="detail-item">
                        <span class="detail-label">First Seen:</span> 
                        <span class="detail-value">${firstSeen}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Last Seen:</span> 
                        <span class="detail-value">${lastSeen}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Quick Access:</span>
                        <div class="port-buttons">
                            <button class="port-btn ${host.ports?.http ? 'port-open' : 'port-unknown'}" 
                                    onclick="window.open('http://${host.ip}', '_blank')" 
                                    title="Open HTTP (port 80)">
                                <span class="port-icon">🌐</span> HTTP:80
                            </button>
                            <button class="port-btn ${host.ports?.https ? 'port-open' : 'port-unknown'}" 
                                    onclick="window.open('https://${host.ip}', '_blank')" 
                                    title="Open HTTPS (port 443)">
                                <span class="port-icon">🔒</span> HTTPS:443
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        }).join('');
    }
}

function stopScan() {
    scanActive = false;
    if (autoRepeatInterval) {
        clearTimeout(autoRepeatInterval);
        autoRepeatInterval = null;
    }
    document.getElementById('scanBtn').disabled = false;
    document.getElementById('stopBtn').disabled = true;
    document.getElementById('clearBtn').disabled = false;
}

function clearResults() {
    hostsMap.clear();
    activeHosts = [];
    scannedCount = 0;
    
    document.getElementById('activeCount').textContent = '0';
    document.getElementById('scannedCount').textContent = '0';
    document.getElementById('results').innerHTML = '<p class="placeholder">No scan results yet. Start a scan to discover devices on your network.</p>';
    document.getElementById('exportBtn').style.display = 'none';
    document.getElementById('clearBtn').disabled = true;
}

function toggleAutoRepeat() {
    const autoRepeat = document.getElementById('autoRepeat').checked;
    
    if (!autoRepeat && autoRepeatInterval) {
        clearTimeout(autoRepeatInterval);
        autoRepeatInterval = null;
    }
}

function exportResults() {
    const data = {
        timestamp: new Date().toISOString(),
        totalScanned: scannedCount,
        activeHosts: activeHosts.map(h => ({
            ip: h.ip,
            hostname: h.hostname,
            responseTime: h.responseTime,
            ports: h.ports,
            firstSeen: h.firstSeen,
            lastSeen: h.lastSeen
        }))
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `network-scan-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('scanBtn').addEventListener('click', performScan);
    document.getElementById('stopBtn').addEventListener('click', stopScan);
    document.getElementById('clearBtn').addEventListener('click', clearResults);
    document.getElementById('autoRepeat').addEventListener('change', toggleAutoRepeat);
    document.getElementById('exportBtn').addEventListener('click', exportResults);
});

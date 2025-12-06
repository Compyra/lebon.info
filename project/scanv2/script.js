// Network Scanner Script
let scanActive = false;
let activeHosts = [];
let scannedCount = 0;
let autoRepeatInterval = null;
let hostsMap = new Map(); // Store hosts by IP for persistence
let rangeScanActive = false;

const RANGE_SCAN_BATCH_SIZE = 5;
const SCAN_BATCH_SIZE = 5;
const RANGE_SCAN_TIMEOUT = 2000;

const RANGE_SCAN_CONFIG = {
    '192.168': {
        label: '192.168.0.0/16',
        start: 0,
        end: 255,
        buildAddress: segment => `192.168.${segment}.1`
    },
    '172.16': {
        label: '172.16.0.0/12',
        start: 16,
        end: 31,
        buildAddress: segment => `172.${segment}.0.1`
    },
    '10.0': {
        label: '10.0.0.0/8',
        start: 0,
        end: 255,
        buildAddress: segment => `10.${segment}.0.1`
    }
};

const RANGE_SCAN_ORDER = ['192.168', '172.16', '10.0'];

// Scan IP ranges for .1 addresses
async function scanIPRange(baseIP) {
    if (rangeScanActive) {
        alert('A range scan is already in progress. Please wait.');
        return;
    }

    const config = RANGE_SCAN_CONFIG[baseIP];
    if (!config) {
        alert('Unsupported range selection.');
        return;
    }

    rangeScanActive = true;
    const resultsDiv = document.getElementById('rangeResults');
    const buttons = document.querySelectorAll('.btn-range');

    // Disable all buttons during scan
    buttons.forEach(btn => btn.disabled = true);

    resultsDiv.innerHTML = '<p class="loading">Scanning for gateway addresses...</p>';
    renderRangeTimeEstimates(baseIP);

    const { start: rangeStart, end: rangeEnd, buildAddress } = config;
    const foundIPs = [];
    const batchSize = RANGE_SCAN_BATCH_SIZE; // Reduced batch size for more reliable scanning
    
    for (let i = rangeStart; i <= rangeEnd; i += batchSize) {
        if (!rangeScanActive) break; // Allow cancellation
        
        const batch = [];
        const batchEnd = Math.min(i + batchSize - 1, rangeEnd);
        
        for (let j = i; j <= batchEnd; j++) {
            const ip = buildAddress(j);
            batch.push(scanIP(ip, RANGE_SCAN_TIMEOUT)); // Increased timeout for gateway detection
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
    renderRangeTimeEstimates(baseIP);
}

function useNetwork(networkBase) {
    document.getElementById('networkBase').value = networkBase;
    // Optionally scroll to the scan section
    document.querySelector('.section:nth-child(2)').scrollIntoView({ behavior: 'smooth' });
    updateTimeEstimate();
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
        },
        httpError: null,
        httpsError: null
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
        }).catch(async (err) => {
            info.httpError = err?.name || err?.message || 'ERR_FAILED';
            // Try no-cors mode if CORS fails
            return await fetch(`http://${ip}/`, {
                method: 'GET',
                mode: 'no-cors',
                cache: 'no-cache',
                signal: controller.signal
            }).catch((fallbackErr) => {
                info.httpError = fallbackErr?.name || fallbackErr?.message || info.httpError;
                return null;
            });
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
        info.httpError = e?.name || e?.message || 'ERR_FAILED';
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
        }).catch(async (err) => {
            info.httpsError = err?.name || err?.message || 'ERR_FAILED';
            // Try no-cors mode if CORS fails
            return await fetch(`https://${ip}/`, {
                method: 'GET',
                mode: 'no-cors',
                cache: 'no-cache',
                signal: controller.signal
            }).catch((fallbackErr) => {
                info.httpsError = fallbackErr?.name || fallbackErr?.message || info.httpsError;
                return null;
            });
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
        info.httpsError = e?.name || e?.message || 'ERR_FAILED';
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

    updateTimeEstimate();

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
    const batchSize = SCAN_BATCH_SIZE; // Reduced batch size for more reliable scanning

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

function formatDuration(totalMs) {
    if (!Number.isFinite(totalMs) || totalMs <= 0) {
        return '0s';
    }

    if (totalMs < 1000) {
        return `${Math.ceil(totalMs)}ms`;
    }

    const totalSeconds = Math.ceil(totalMs / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const parts = [];
    if (hours > 0) {
        parts.push(`${hours}h`);
    }
    if (minutes > 0) {
        parts.push(`${minutes}m`);
    }
    if (seconds > 0 || parts.length === 0) {
        parts.push(`${seconds}s`);
    }

    return parts.join(' ');
}

function renderRangeTimeEstimates(activeBase) {
    const container = document.getElementById('rangeTimeEstimate');
    if (!container) {
        return;
    }

    const lines = RANGE_SCAN_ORDER.map(rangeKey => {
        const config = RANGE_SCAN_CONFIG[rangeKey];
        if (!config) {
            return '';
        }

        const ipCount = config.end - config.start + 1;
        const batchCount = Math.ceil(ipCount / RANGE_SCAN_BATCH_SIZE);
        const totalMs = batchCount * RANGE_SCAN_TIMEOUT;
        const approxSeconds = Math.ceil(totalMs / 1000);
        const humanReadable = formatDuration(totalMs);
        const activeClass = rangeKey === activeBase ? ' estimate-line-active' : '';

        return `<div class="estimate-line${activeClass}">${config.label}: ~${approxSeconds}s (${humanReadable}), ~${RANGE_SCAN_TIMEOUT}ms/IP x ${ipCount} IPs</div>`;
    }).filter(Boolean).join('');

    if (lines) {
        container.innerHTML = `<div class="estimate-heading">Estimated duration per range</div>${lines}`;
    } else {
        container.innerHTML = '';
    }
}

function updateTimeEstimate() {
    const estimateEl = document.getElementById('timeEstimate');
    if (!estimateEl) {
        return;
    }

    const start = parseInt(document.getElementById('startRange').value, 10);
    const end = parseInt(document.getElementById('endRange').value, 10);
    const timeout = parseInt(document.getElementById('timeout').value, 10);

    if (Number.isNaN(start) || Number.isNaN(end) || Number.isNaN(timeout) || timeout <= 0 || start > end) {
        estimateEl.textContent = 'Estimated duration: —';
        return;
    }

    const ipCount = end - start + 1;
    if (ipCount <= 0) {
        estimateEl.textContent = 'Estimated duration: 0s';
        return;
    }

    const batchCount = Math.ceil(ipCount / SCAN_BATCH_SIZE);
    const totalMs = batchCount * timeout;
    const ipLabel = ipCount === 1 ? 'IP' : 'IPs';
    estimateEl.textContent = `Estimated duration: ${formatDuration(totalMs)} (~${timeout}ms/IP x ${ipCount} ${ipLabel})`;
}

function updateResults() {
    // Convert map to array for display
    activeHosts = Array.from(hostsMap.values());
    
    document.getElementById('activeCount').textContent = activeHosts.length;
    document.getElementById('scannedCount').textContent = scannedCount;

    const resultsDiv = document.getElementById('results');

    if (activeHosts.length > 0) {
        const rowsHTML = activeHosts.map(host => {
            const firstSeen = host.firstSeen ? new Date(host.firstSeen).toLocaleString() : 'N/A';
            const lastSeen = host.lastSeen ? new Date(host.lastSeen).toLocaleString() : 'N/A';

            const httpLine = host.ports?.http
                ? `<div class="status-line">HTTP: <span>${host.httpStatus ?? 'Reachable'}</span></div>`
                : '<div class="status-line muted">HTTP: Unavailable</div>';

            const httpsLine = host.ports?.https
                ? `<div class="status-line">HTTPS: <span>${host.httpsStatus ?? 'Reachable'}</span></div>`
                : '<div class="status-line muted">HTTPS: Unavailable</div>';

            // Build response codes column
            const responseCodes = [];
            
            if (host.ports?.http) {
                const httpCode = typeof host.httpStatus === 'number' 
                    ? host.httpStatus 
                    : (host.httpStatus || 'N/A');
                responseCodes.push(`<div class="status-line">HTTP: <span>${httpCode}</span></div>`);
            } else if (host.httpError) {
                responseCodes.push(`<div class="status-line muted">HTTP: ${host.httpError}</div>`);
            } else {
                responseCodes.push(`<div class="status-line muted">HTTP: Not checked</div>`);
            }
            
            if (host.ports?.https) {
                const httpsCode = typeof host.httpsStatus === 'number' 
                    ? host.httpsStatus 
                    : (host.httpsStatus || 'N/A');
                responseCodes.push(`<div class="status-line">HTTPS: <span>${httpsCode}</span></div>`);
            } else if (host.httpsError) {
                responseCodes.push(`<div class="status-line muted">HTTPS: ${host.httpsError}</div>`);
            } else {
                responseCodes.push(`<div class="status-line muted">HTTPS: Not checked</div>`);
            }
            
            const responseHTML = responseCodes.join('');

            return `
                <tr>
                    <td>
                        <div class="ip-cell">
                            <span class="ip-address">${host.ip}</span>
                            <span class="status-badge status-active">Active</span>
                            ${host.responseTime ? `<span class="response-time">${host.responseTime} ms</span>` : ''}
                        </div>
                    </td>
                    <td>
                        ${httpLine}
                        ${httpsLine}
                    </td>
                    <td>
                        <div class="meta-info">First: ${firstSeen}</div>
                        <div class="meta-info">Last: ${lastSeen}</div>
                    </td>
                    <td>${responseHTML}</td>
                    <td>
                        <div class="port-buttons compact">
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
                    </td>
                </tr>
            `;
        }).join('');

        resultsDiv.innerHTML = `
            <table class="results-table">
                <thead>
                    <tr>
                        <th>Host</th>
                        <th>Services</th>
                        <th>Seen</th>
                        <th>Response Codes</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>${rowsHTML}</tbody>
            </table>
        `;
    } else {
        resultsDiv.innerHTML = '<p class="placeholder">No scan results yet. Start a scan to discover devices on your network.</p>';
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
    updateTimeEstimate();
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

    ['startRange', 'endRange', 'timeout'].forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('input', updateTimeEstimate);
            input.addEventListener('change', updateTimeEstimate);
        }
    });

    renderRangeTimeEstimates();
    updateTimeEstimate();
});

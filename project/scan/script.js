// Network Scanner Script
let scanActive = false;
let activeHosts = [];
let scannedCount = 0;

// Get local IP addresses
async function getLocalIPAddresses() {
    const localIpsDiv = document.getElementById('localIps');
    const ips = [];

    try {
        // Use WebRTC to get local IP addresses
        const pc = new RTCPeerConnection({
            iceServers: []
        });

        pc.createDataChannel('');
        
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);

        return new Promise((resolve) => {
            pc.onicecandidate = (ice) => {
                if (!ice || !ice.candidate || !ice.candidate.candidate) {
                    if (ips.length === 0) {
                        localIpsDiv.innerHTML = '<p class="warning">Unable to detect local IP addresses. You may need to enable WebRTC or check browser permissions.</p>';
                    }
                    pc.close();
                    resolve(ips);
                    return;
                }

                const candidateParts = ice.candidate.candidate.split(' ');
                const ip = candidateParts[4];

                if (ip && ip.match(/^(\d{1,3}\.){3}\d{1,3}$/) && !ips.includes(ip)) {
                    // Filter out non-private IPs
                    if (ip.startsWith('192.168.') || 
                        ip.startsWith('10.') || 
                        ip.match(/^172\.(1[6-9]|2[0-9]|3[0-1])\./)) {
                        ips.push(ip);
                        displayLocalIPs(ips);
                        prefillNetworkBase(ip);
                    }
                }
            };
        });
    } catch (error) {
        console.error('Error getting local IPs:', error);
        localIpsDiv.innerHTML = '<p class="error">Error detecting IP addresses. Please enter network details manually.</p>';
        return [];
    }
}

function displayLocalIPs(ips) {
    const localIpsDiv = document.getElementById('localIps');
    if (ips.length > 0) {
        localIpsDiv.innerHTML = ips.map(ip => 
            `<div class="ip-item"><span class="ip-label">IPv4:</span> <strong>${ip}</strong></div>`
        ).join('');
    }
}

function prefillNetworkBase(ip) {
    const networkBase = ip.substring(0, ip.lastIndexOf('.'));
    document.getElementById('networkBase').value = networkBase;
}

// Scan a single IP address
async function scanIP(ip, timeout) {
    return new Promise((resolve) => {
        const startTime = Date.now();
        const img = new Image();
        let responded = false;

        const timeoutId = setTimeout(() => {
            if (!responded) {
                responded = true;
                img.src = '';
                resolve({ ip, active: false });
            }
        }, timeout);

        img.onload = img.onerror = () => {
            if (!responded) {
                responded = true;
                clearTimeout(timeoutId);
                const responseTime = Date.now() - startTime;
                // If we got a response quickly, the host is likely active
                resolve({ ip, active: responseTime < timeout, responseTime });
            }
        };

        // Try to load a common resource
        img.src = `http://${ip}/favicon.ico?t=${Date.now()}`;
    });
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

    // Reset
    scanActive = true;
    activeHosts = [];
    scannedCount = 0;
    
    const resultsDiv = document.getElementById('results');
    const progressContainer = document.getElementById('progressContainer');
    const scanBtn = document.getElementById('scanBtn');
    const stopBtn = document.getElementById('stopBtn');
    const exportBtn = document.getElementById('exportBtn');

    scanBtn.disabled = true;
    stopBtn.disabled = false;
    exportBtn.style.display = 'none';
    progressContainer.style.display = 'block';
    resultsDiv.innerHTML = '<p class="loading">Scanning network...</p>';

    const totalIPs = endRange - startRange + 1;
    const batchSize = 10; // Scan 10 IPs at a time

    for (let i = startRange; i <= endRange && scanActive; i += batchSize) {
        const batch = [];
        const batchEnd = Math.min(i + batchSize - 1, endRange);

        for (let j = i; j <= batchEnd; j++) {
            const ip = `${networkBase}.${j}`;
            batch.push(scanIP(ip, timeout));
        }

        const results = await Promise.all(batch);
        
        results.forEach(result => {
            scannedCount++;
            if (result.active) {
                activeHosts.push(result);
            }
        });

        updateProgress(scannedCount, totalIPs);
        updateResults();
    }

    // Scan complete
    scanActive = false;
    scanBtn.disabled = false;
    stopBtn.disabled = true;
    if (activeHosts.length > 0) {
        exportBtn.style.display = 'inline-block';
    }
    
    if (activeHosts.length === 0) {
        resultsDiv.innerHTML = '<p class="info">No active hosts found. Note: This scan method has limitations due to browser security. Not all devices may be detected.</p>';
    }
}

function updateProgress(current, total) {
    const percentage = (current / total) * 100;
    document.getElementById('progressFill').style.width = percentage + '%';
    document.getElementById('progressText').textContent = `Scanning: ${current}/${total} (${Math.round(percentage)}%)`;
}

function updateResults() {
    document.getElementById('activeCount').textContent = activeHosts.length;
    document.getElementById('scannedCount').textContent = scannedCount;

    if (activeHosts.length > 0) {
        const resultsDiv = document.getElementById('results');
        resultsDiv.innerHTML = activeHosts.map(host => `
            <div class="result-item">
                <span class="ip-address">${host.ip}</span>
                <span class="status active">Active</span>
                ${host.responseTime ? `<span class="response-time">${host.responseTime}ms</span>` : ''}
            </div>
        `).join('');
    }
}

function stopScan() {
    scanActive = false;
    document.getElementById('scanBtn').disabled = false;
    document.getElementById('stopBtn').disabled = true;
}

function exportResults() {
    const data = {
        timestamp: new Date().toISOString(),
        totalScanned: scannedCount,
        activeHosts: activeHosts.map(h => ({
            ip: h.ip,
            responseTime: h.responseTime
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
    getLocalIPAddresses();

    document.getElementById('scanBtn').addEventListener('click', performScan);
    document.getElementById('stopBtn').addEventListener('click', stopScan);
    document.getElementById('exportBtn').addEventListener('click', exportResults);
});

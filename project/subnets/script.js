// Minimalist subnet calculator for lebon.info
function ipToInt(ip) {
    return ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0) >>> 0;
}
function intToIp(int) {
    return [24, 16, 8, 0].map(shift => (int >>> shift) & 255).join('.');
}
function prefixToMask(prefix) {
    return intToIp(prefix === 0 ? 0 : (~0 << (32 - prefix)) >>> 0);
}
function maskToPrefix(mask) {
    return mask.split('.').map(Number).map(n => n.toString(2)).join('').replace(/0/g, '').length;
}
document.getElementById('subnet-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const ip = document.getElementById('ip').value.trim();
    const prefix = parseInt(document.getElementById('prefix').value, 10);
    const resultDiv = document.getElementById('result');
    if (!/^\d{1,3}(\.\d{1,3}){3}$/.test(ip) || prefix < 1 || prefix > 32) {
        resultDiv.textContent = 'Ongeldige invoer.';
        return;
    }
    const ipInt = ipToInt(ip);
    const mask = prefixToMask(prefix);
    const maskInt = ipToInt(mask);
    const networkInt = ipInt & maskInt;
    const broadcastInt = ipInt | (~maskInt >>> 0);
    const network = intToIp(networkInt);
    const broadcast = intToIp(broadcastInt);
    const hosts = prefix === 32 ? 1 : Math.max(0, Math.pow(2, 32 - prefix) - 2);
    // Eerste bruikbare IP (network + 1), laatste bruikbare IP (broadcast - 1)
    let firstUsable = '';
    let lastUsable = '';
    if (prefix === 32) {
        firstUsable = lastUsable = network;
    } else if (prefix === 31) {
        // /31: alleen 2 adressen, beide bruikbaar (RFC 3021)
        firstUsable = network;
        lastUsable = broadcast;
    } else {
        firstUsable = intToIp(networkInt + 1);
        lastUsable = intToIp(broadcastInt - 1);
    }
    resultDiv.innerHTML =
        `<strong>Netwerkadres:</strong> <span style="color:#005">${network}</span>/${prefix}<br>` +
        `<strong>Eerste IP-adres:</strong> <span style="color:#005">${network}</span><br>` +
        `<strong>Eerste bruikbare IP:</strong> <span style="color:#080">${firstUsable}</span><br>` +
        `<strong>Laatste bruikbare IP:</strong> <span style="color:#080">${lastUsable}</span><br>` +
        `<strong>Laatste IP-adres:</strong> <span style="color:#005">${broadcast}</span><br>` +
        `<strong>Subnetmasker:</strong> ${mask}<br>` +
        `<strong>Broadcastadres:</strong> ${broadcast}<br>` +
        `<strong>Aantal bruikbare hosts:</strong> ${hosts}`;
});

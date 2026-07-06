/* ============================================================
   BT Scanner — Bluetooth Surveillance & Tracker Detector
   Uses Web Bluetooth requestLEScan (experimental) and
   requestDevice + watchAdvertisements (standard fallback)

   Detection technique inspired by:
   https://github.com/yjeanrenaud/yj_nearbyglasses
   Manufacturer IDs from Bluetooth SIG Assigned Numbers:
   https://www.bluetooth.com/specifications/assigned-numbers/
   ============================================================ */

'use strict';

// ================================================================
// Known Manufacturer Company IDs (Bluetooth SIG Assigned Numbers)
// ================================================================

/**
 * Company IDs associated with covert surveillance hardware:
 * smart glasses, spy cameras, and wearable recording devices.
 */
const SURVEILLANCE_COMPANIES = {
    0x01AB: 'Meta Platforms, Inc. (Ray-Ban Meta / formerly Facebook)',
    0x058E: 'Meta Platforms Technologies, LLC',
    0x0D53: 'Luxottica Group S.p.A (manufactures Meta Ray-Ban glasses)',
    0x03C2: 'Snap Inc. (Snap Spectacles)',
    0x0171: 'Amazon.com Services, LLC (Echo Frames)',
    0x0057: 'Vuzix Corporation (smart glasses)',
    0x02A6: 'Epson (Moverio smart glasses)',
};

/**
 * Company IDs associated with location tracking devices.
 * Note: These manufacturers also produce other non-tracker products.
 * Cross-reference with name patterns and service UUIDs for better accuracy.
 */
const TRACKER_COMPANIES = {
    0x004C: 'Apple, Inc. (possible AirTag / Find My device)',
    0x00D7: 'Tile, Inc.',
    0x0075: 'Samsung Electronics Co., Ltd. (possible SmartTag)',
    0x0250: 'Chipolo (tracking tag)',
    0x0397: 'AIRTAG Solutions Ltd.',
};

// ================================================================
// Device Name Patterns
// ================================================================

/** Regex patterns that match known surveillance device names. */
const SURVEILLANCE_NAME_PATTERNS = [
    /ray.?ban/i,
    /\bmeta\b.*glass/i,
    /spectacles/i,
    /echo.?frame/i,
    /\baria\b/i,              // Amazon Echo Frames "Aria"
    /\bvuzix\b/i,
    /moverio/i,
    /\bnreal\b/i,
    /\bxreal\b/i,
    /\brokid\b/i,
    /tcl.?nxt/i,
    /oppo.?air.?glass/i,
    /envision.?glass/i,
    /\bora\b.*glass/i,        // Ora-2 smart glasses
    /\bplaud\b/i,             // Plaud Note / NotePin AI voice recorders
];

/** Regex patterns that match known tracker device names. */
const TRACKER_NAME_PATTERNS = [
    /air.?tag/i,
    /\btile\b/i,
    /smart.?tag/i,
    /\bchipolo\b/i,
    /orbit.?key/i,
    /nut.?find/i,
    /pebblebee/i,
    /find.?my/i,
    /\btrackr\b/i,
    /\blost.?found\b/i,
];

// ================================================================
// Service UUIDs
// ================================================================

/**
 * 128-bit service UUIDs associated with tracking protocols.
 * These appear in BLE advertisement service data.
 */
const TRACKER_SERVICE_UUIDS = new Set([
    '0000fd44-0000-1000-8000-00805f9b34fb', // Apple Find My (Offline Finding)
    '0000feed-0000-1000-8000-00805f9b34fb', // Tile
    '0000feaa-0000-1000-8000-00805f9b34fb', // Eddystone / Google beacon
]);

// ================================================================
// Application State
// ================================================================

/** Map of deviceId -> device data object. */
const devices = new Map();

/** Map of deviceId -> rendered card element (avoids brittle string-id DOM lookups). */
const deviceCards = new Map();

/** Device ids with a pending (throttled) card re-render. */
const dirtyDevices = new Set();

/** Timer handle for the throttled render flush, or null. */
let flushTimer = null;

/** Minimum interval between card re-renders for existing devices (ms). */
const RENDER_INTERVAL_MS = 300;

/** Timer handle for auto-hiding the alert banner, or null. */
let alertTimer = null;

/** Number of advertisement packets received during the current scan. */
let packetsReceived = 0;

/** Watchdog timer: warns the user if a scan produces no packets. */
let scanWatchdog = null;

/** How long to wait for the first packet before showing troubleshooting help (ms). */
const WATCHDOG_DELAY_MS = 10000;

/** Currently active BluetoothLEScan (from requestLEScan), or null. */
let activeScan = null;

/** Local scanner bridge (bt-bridge.py) — native BLE scan exposed on localhost. */
const BRIDGE_URL = 'http://127.0.0.1:8437';

/** Poll interval for the local bridge (ms). */
const BRIDGE_POLL_MS = 2000;

/** Timer handle for bridge polling, or null when bridge mode is inactive. */
let bridgeTimer = null;

/** Set of device objects being watched via watchAdvertisements(). */
const watchedDevices = new Set();

/** Current filter: 'all' | 'surveillance' | 'tracker' | 'normal' */
let currentFilter = 'all';

// ================================================================
// Classification
// ================================================================

/**
 * Classify a BLE advertisement event into 'surveillance', 'tracker', or 'normal'.
 * @param {BluetoothAdvertisingEvent | object} event
 * @returns {{ type: string, reason: string|null, companyId: string|null }}
 */
function classifyAdvertisement(event) {
    const name = (event.device?.name || '').trim();

    // 1. Check Manufacturer Data company IDs (most reliable signal)
    if (event.manufacturerData && event.manufacturerData.size > 0) {
        for (const [companyId] of event.manufacturerData) {
            if (Object.prototype.hasOwnProperty.call(SURVEILLANCE_COMPANIES, companyId)) {
                return {
                    type: 'surveillance',
                    reason: `Manufacturer ID ${formatCompanyId(companyId)}: ${SURVEILLANCE_COMPANIES[companyId]}`,
                    companyId: formatCompanyId(companyId),
                };
            }
            if (Object.prototype.hasOwnProperty.call(TRACKER_COMPANIES, companyId)) {
                return {
                    type: 'tracker',
                    reason: `Manufacturer ID ${formatCompanyId(companyId)}: ${TRACKER_COMPANIES[companyId]}`,
                    companyId: formatCompanyId(companyId),
                };
            }
        }
    }

    // 2. Check device name patterns
    if (name) {
        for (const pattern of SURVEILLANCE_NAME_PATTERNS) {
            if (pattern.test(name)) {
                return {
                    type: 'surveillance',
                    reason: `Device name matches surveillance pattern: "${name}"`,
                    companyId: null,
                };
            }
        }
        for (const pattern of TRACKER_NAME_PATTERNS) {
            if (pattern.test(name)) {
                return {
                    type: 'tracker',
                    reason: `Device name matches tracker pattern: "${name}"`,
                    companyId: null,
                };
            }
        }
    }

    // 3. Check service UUIDs
    const uuids = event.uuids || [];
    for (const uuid of uuids) {
        if (TRACKER_SERVICE_UUIDS.has(uuid.toLowerCase())) {
            return {
                type: 'tracker',
                reason: `Known tracker service UUID: ${uuid}`,
                companyId: null,
            };
        }
    }

    return { type: 'normal', reason: null, companyId: null };
}

/** Format a numeric company ID as a 0x-prefixed hex string. */
function formatCompanyId(id) {
    return `0x${id.toString(16).toUpperCase().padStart(4, '0')}`;
}

// ================================================================
// Advertisement Event Handler
// ================================================================

/**
 * Handle a BluetoothAdvertisingEvent (from requestLEScan or watchAdvertisements).
 * Updates the device map and refreshes the UI.
 */
function handleAdvertisement(event) {
    packetsReceived++;
    const deviceId = event.device.id;
    const classification = classifyAdvertisement(event);

    // Collect manufacturer data
    const manufacturers = [];
    if (event.manufacturerData && event.manufacturerData.size > 0) {
        for (const [companyId] of event.manufacturerData) {
            const hexId = formatCompanyId(companyId);
            const knownName =
                SURVEILLANCE_COMPANIES[companyId] ||
                TRACKER_COMPANIES[companyId] ||
                'Unknown';
            manufacturers.push({ id: hexId, name: knownName });
        }
    }

    // Merge with existing data (prefer upgraded classification for surveillance/tracker)
    const existing = devices.get(deviceId);
    const previousType = existing?.classification?.type;
    const finalClassification =
        shouldUpgrade(previousType, classification.type)
            ? classification
            : (existing?.classification ?? classification);

    const deviceData = {
        id: deviceId,
        name: event.device.name || existing?.name || null,
        rssi: event.rssi ?? existing?.rssi,
        txPower: event.txPower ?? existing?.txPower,
        classification: finalClassification,
        manufacturers: manufacturers.length > 0 ? manufacturers : (existing?.manufacturers ?? []),
        uuids: event.uuids?.length ? [...event.uuids] : (existing?.uuids ?? []),
        lastSeen: Date.now(),
        firstSeen: existing?.firstSeen ?? Date.now(),
    };

    const isNew = !devices.has(deviceId);
    devices.set(deviceId, deviceData);

    if (isNew) {
        addDeviceCard(deviceData);
        updateCounts();

        // Show alert banner for newly found surveillance devices
        if (finalClassification.type === 'surveillance') {
            showAlertBanner(deviceData.name || 'Unknown Device');
        }
    } else {
        // Throttle re-renders: BLE advertisements can arrive many times per second
        scheduleCardUpdate(deviceId);
    }
}

/** Queue a throttled card re-render for an existing device. */
function scheduleCardUpdate(deviceId) {
    dirtyDevices.add(deviceId);
    if (flushTimer === null) {
        flushTimer = setTimeout(flushCardUpdates, RENDER_INTERVAL_MS);
    }
}

/** Re-render all dirty device cards and refresh counters. */
function flushCardUpdates() {
    flushTimer = null;
    for (const id of dirtyDevices) {
        const data = devices.get(id);
        if (data) updateDeviceCard(data);
    }
    dirtyDevices.clear();
    updateCounts();
}

/**
 * Returns true if moving to newType is an upgrade over oldType.
 * Priority: surveillance > tracker > normal
 */
function shouldUpgrade(oldType, newType) {
    const rank = { surveillance: 2, tracker: 1, normal: 0 };
    return (rank[newType] ?? 0) > (rank[oldType] ?? 0);
}

// ================================================================
// DOM — Device Cards
// ================================================================

function addDeviceCard(data) {
    const list = document.getElementById('device-list');
    const empty = list.querySelector('.device-list-empty');
    if (empty) empty.remove();

    const card = buildCard(data);
    deviceCards.set(data.id, card);
    list.prepend(card);
    applyFilterToCard(card);
}

function updateDeviceCard(data) {
    const existing = deviceCards.get(data.id);
    if (!existing || !existing.isConnected) {
        addDeviceCard(data);
        return;
    }
    const newCard = buildCard(data);
    deviceCards.set(data.id, newCard);
    existing.replaceWith(newCard);
    applyFilterToCard(newCard);
}

function buildCard(data) {
    const card = document.createElement('div');
    card.className = `device-card device-${data.classification.type}`;
    card.innerHTML = renderCardHTML(data);
    return card;
}

function renderCardHTML(data) {
    const name = data.name
        ? escapeHTML(data.name)
        : '<span class="dim">Unknown Device</span>';

    const rssiText = data.rssi != null ? `${data.rssi} dBm` : 'N/A';
    const rssiBar  = data.rssi != null ? buildRssiBar(data.rssi) : '';

    const badgeClass = `badge-${data.classification.type}`;
    const badgeText  = data.classification.type.toUpperCase();

    const timeStr = new Date(data.lastSeen).toLocaleTimeString();

    let manufacturerRows = '';
    if (data.manufacturers.length > 0) {
        manufacturerRows = data.manufacturers.map(m =>
            `<div class="device-detail">
               <span class="detail-label">MFR ID</span>
               <span class="detail-value manufacturer">${escapeHTML(m.id)}</span>
               <span class="dim small">(${escapeHTML(m.name)})</span>
             </div>`
        ).join('');
    }

    const reasonRow = data.classification.reason
        ? `<div class="device-detail alert-reason">
             <span class="detail-label">REASON</span>
             <span class="detail-value">${escapeHTML(data.classification.reason)}</span>
           </div>`
        : '';

    const uuidsRow = data.uuids.length > 0
        ? `<div class="device-detail">
             <span class="detail-label">SVC UUID</span>
             <span class="detail-value dim small">${data.uuids.map(escapeHTML).join(', ')}</span>
           </div>`
        : '';

    const txRow = data.txPower != null
        ? `<div class="device-detail">
             <span class="detail-label">TX PWR</span>
             <span class="detail-value dim">${data.txPower} dBm</span>
           </div>`
        : '';

    return `
        <div class="device-card-header">
            <div class="device-name">${name}</div>
            <span class="badge ${badgeClass}">${badgeText}</span>
        </div>
        <div class="device-details">
            <div class="device-detail">
                <span class="detail-label">RSSI</span>
                <span class="detail-value">${rssiText} ${rssiBar}</span>
            </div>
            ${txRow}
            ${manufacturerRows}
            ${reasonRow}
            ${uuidsRow}
            <div class="device-detail">
                <span class="detail-label">SEEN</span>
                <span class="detail-value dim">${timeStr}</span>
            </div>
            <div class="device-detail">
                <span class="detail-label">ID</span>
                <span class="detail-value dim small">${escapeHTML(data.id)}</span>
            </div>
        </div>
    `;
}

function buildRssiBar(rssi) {
    const bars = rssi >= -60 ? 5 : rssi >= -70 ? 4 : rssi >= -80 ? 3 : rssi >= -90 ? 2 : 1;
    let html = '<span class="rssi-bars" title="Signal strength">';
    for (let i = 1; i <= 5; i++) {
        html += `<span class="rssi-bar${i <= bars ? ' active' : ''}"></span>`;
    }
    html += '</span>';
    return html;
}

// ================================================================
// UI Updates
// ================================================================

function updateCounts() {
    const all          = devices.size;
    const surveillance = countByType('surveillance');
    const tracker      = countByType('tracker');

    document.getElementById('device-count').textContent      = all;
    document.getElementById('surveillance-count').textContent = surveillance;
    document.getElementById('tracker-count').textContent      = tracker;

    const survEl = document.getElementById('surveillance-count');
    survEl.classList.toggle('threat', surveillance > 0);
    survEl.classList.toggle('active', surveillance > 0);
}

function countByType(type) {
    let count = 0;
    for (const d of devices.values()) {
        if (d.classification.type === type) count++;
    }
    return count;
}

function setStatus(text, cls = '') {
    const el = document.getElementById('status');
    el.textContent = text;
    el.className = `status-value${cls ? ' ' + cls : ''}`;
}

function showAlertBanner(deviceName) {
    const banner = document.getElementById('alert-banner');
    document.getElementById('alert-text').textContent =
        `SURVEILLANCE DEVICE DETECTED NEARBY: ${deviceName}`;
    banner.classList.remove('hidden');
    clearTimeout(alertTimer);
    alertTimer = setTimeout(() => banner.classList.add('hidden'), 10000);
}

function showNotice(type, message) {
    const box = document.getElementById('notice-box');
    box.className = `notice-box info-${type}`;
    box.textContent = message;
    box.classList.remove('hidden');
}

function clearNotice() {
    document.getElementById('notice-box').classList.add('hidden');
}

// ================================================================
// Filtering
// ================================================================

function setFilter(filter) {
    currentFilter = filter;
    document.querySelectorAll('.filter-btn').forEach(btn => {
        const active = btn.dataset.filter === filter;
        btn.classList.toggle('active', active);
        btn.setAttribute('aria-pressed', String(active));
    });
    applyCurrentFilter();
}

/** Show/hide a single card according to the current filter. */
function applyFilterToCard(card) {
    const visible = currentFilter === 'all' || card.classList.contains(`device-${currentFilter}`);
    card.style.display = visible ? '' : 'none';
}

function applyCurrentFilter() {
    document.querySelectorAll('.device-card').forEach(applyFilterToCard);
}

// ================================================================
// Scan Controls — Public API (called from HTML)
// ================================================================

/**
 * Start scanning. Prefers the local scanner bridge (bt-bridge.py), which
 * performs a native BLE scan — required on Windows, where Chromium's
 * requestLEScan never starts radio discovery. Falls back to Web Bluetooth
 * passive scanning (works on Android / ChromeOS with the experimental flag).
 */
async function startScan() {
    clearNotice();
    setStatus('REQUESTING...', 'scanning');
    document.getElementById('btn-scan').disabled = true;

    // 1) Local scanner bridge — full native scan, no browser limitations
    if (await startBridgeScan()) return;

    // 2) Web Bluetooth passive scanning
    if (!navigator.bluetooth) {
        setStatus('UNSUPPORTED', 'error');
        showNotice('error',
            'Web Bluetooth API is not available and no local scanner bridge was found. ' +
            'Run "python bt-bridge.py" on this machine, then click [ START SCAN ] again.');
        document.getElementById('btn-scan').disabled = false;
        return;
    }

    try {
        if (typeof navigator.bluetooth.requestLEScan !== 'function') {
            // API not available — tell user and offer fallback
            setStatus('UNSUPPORTED', 'error');
            showNotice(
                'warn',
                'BLE passive scanning is not available in this browser and no local scanner bridge was found. ' +
                'Recommended: run "python bt-bridge.py" on this machine, then scan again. ' +
                'Alternatively enable chrome://flags/#enable-experimental-web-platform-features ' +
                'or use [ + ADD DEVICE ] to add devices one at a time.'
            );
            document.getElementById('btn-scan').disabled = false;
            return;
        }

        // Attach the listener BEFORE starting the scan so the initial
        // burst of advertisement packets is not missed.
        navigator.bluetooth.addEventListener('advertisementreceived', handleAdvertisement);

        activeScan = await navigator.bluetooth.requestLEScan({
            acceptAllAdvertisements: true,
            keepRepeatedDevices: true,
        });

        setStatus('SCANNING', 'scanning');
        showNotice('info', 'Passive BLE scan active — all nearby advertisement packets will appear below. Click [ STOP SCAN ] when done.');

        document.getElementById('btn-stop').disabled = false;

        // Watchdog: if no packets arrive, surface troubleshooting help
        packetsReceived = 0;
        clearTimeout(scanWatchdog);
        scanWatchdog = setTimeout(() => {
            if (activeScan && packetsReceived === 0) {
                showNotice(
                    'warn',
                    'Scan is running but no advertisement packets have been received. ' +
                    'On Windows, Chromium\u2019s Web Bluetooth scanning is known to be non-functional — ' +
                    'run the local scanner bridge instead: "python bt-bridge.py", then click [ STOP SCAN ] and [ START SCAN ] again. ' +
                    'Also note that only BLE devices actively ADVERTISING are visible.'
                );
            }
        }, WATCHDOG_DELAY_MS);

    } catch (err) {
        navigator.bluetooth.removeEventListener('advertisementreceived', handleAdvertisement);
        document.getElementById('btn-scan').disabled = false;

        if (err.name === 'NotAllowedError') {
            setStatus('DENIED', 'error');
            showNotice('error', 'Bluetooth permission was denied. Allow access and try again.');
        } else if (err.name === 'InvalidStateError') {
            setStatus('BT OFF', 'error');
            showNotice('error', 'Bluetooth is turned off. Enable Bluetooth and try again.');
        } else if (err.name === 'NotSupportedError') {
            setStatus('UNSUPPORTED', 'error');
            showNotice(
                'warn',
                'Your browser does not support BLE scanning. ' +
                'Enable chrome://flags/#enable-experimental-web-platform-features or use [ + ADD DEVICE ].'
            );
        } else {
            setStatus('ERROR', 'error');
            showNotice('error', `Scan error: ${err.message}`);
        }
    }
}

/** Stop the active passive scan. */
function stopScan() {
    const wasActive = activeScan !== null || watchedDevices.size > 0 || bridgeTimer !== null;

    clearTimeout(scanWatchdog);
    scanWatchdog = null;

    if (bridgeTimer !== null) {
        clearInterval(bridgeTimer);
        bridgeTimer = null;
    }

    if (activeScan) {
        activeScan.stop();
        activeScan = null;
        navigator.bluetooth.removeEventListener('advertisementreceived', handleAdvertisement);
    }

    // Also stop all watched devices
    stopWatchingDevices();

    setStatus('STOPPED', '');
    document.getElementById('btn-scan').disabled  = false;
    document.getElementById('btn-stop').disabled  = true;
    if (wasActive) showNotice('info', 'Scan stopped.');
}

/** Unwatch all manually added devices and detach their event listeners. */
function stopWatchingDevices() {
    for (const device of watchedDevices) {
        try { device.unwatchAdvertisements?.(); } catch (_) { /* ignore */ }
        device.removeEventListener('advertisementreceived', handleAdvertisement);
    }
    watchedDevices.clear();
}

// ================================================================
// Local Scanner Bridge (bt-bridge.py)
// ================================================================

/** Fetch the device list from the local bridge. Throws on failure. */
async function fetchBridgeDevices() {
    const res = await fetch(`${BRIDGE_URL}/api/devices`, { signal: AbortSignal.timeout(1500) });
    if (!res.ok) throw new Error(`Bridge HTTP ${res.status}`);
    const data = await res.json();
    return Array.isArray(data.devices) ? data.devices : [];
}

/**
 * Try to connect to the local scanner bridge and start polling.
 * @returns {Promise<boolean>} true if bridge mode started.
 */
async function startBridgeScan() {
    let list;
    try {
        list = await fetchBridgeDevices();
    } catch (_) {
        return false; // bridge not running — caller falls back to Web Bluetooth
    }

    processBridgeDevices(list);
    setStatus('SCANNING (BRIDGE)', 'scanning');
    showNotice('info',
        'Connected to the local scanner bridge — live native BLE scan active. ' +
        'All nearby advertising devices will appear below. Click [ STOP SCAN ] when done.');
    document.getElementById('btn-stop').disabled = false;

    bridgeTimer = setInterval(pollBridge, BRIDGE_POLL_MS);
    return true;
}

/** Periodic bridge poll; stops with an error notice if the bridge goes away. */
async function pollBridge() {
    try {
        processBridgeDevices(await fetchBridgeDevices());
    } catch (_) {
        stopScan();
        setStatus('BRIDGE LOST', 'error');
        showNotice('error', 'Lost connection to the local scanner bridge. Restart "python bt-bridge.py" and scan again.');
    }
}

/** Feed bridge JSON entries through the normal advertisement pipeline. */
function processBridgeDevices(list) {
    for (const d of list) {
        handleAdvertisement({
            device: { id: d.address, name: d.name || null },
            rssi: d.rssi,
            txPower: d.tx_power,
            manufacturerData: new Map((d.manufacturer_ids || []).map(id => [id, null])),
            uuids: d.uuids || [],
        });
    }
}

/**
 * Add a single device using the standard requestDevice picker.
 * Works in any Chromium browser without the experimental flag.
 * The user must select the device from the browser's picker.
 */
async function addDevice() {
    if (!navigator.bluetooth) {
        showNotice('error', 'Web Bluetooth is not available in this browser.');
        return;
    }

    clearNotice();

    try {
        const device = await navigator.bluetooth.requestDevice({
            acceptAllDevices: true,
        });

        // Create a device data entry from the basic device info (no ad data yet)
        const basicEvent = {
            device,
            rssi: undefined,
            txPower: undefined,
            manufacturerData: new Map(),
            uuids: [],
        };

        const classification = classifyAdvertisement(basicEvent);

        const deviceData = {
            id: device.id,
            name: device.name || null,
            rssi: undefined,
            txPower: undefined,
            classification,
            manufacturers: [],
            uuids: [],
            lastSeen: Date.now(),
            firstSeen: Date.now(),
        };

        if (!devices.has(device.id)) {
            devices.set(device.id, deviceData);
            addDeviceCard(deviceData);
            updateCounts();
        }

        // Try to start advertisement watching for live RSSI + manufacturer data
        if (typeof device.watchAdvertisements === 'function' && !watchedDevices.has(device)) {
            device.addEventListener('advertisementreceived', handleAdvertisement);
            await device.watchAdvertisements();
            watchedDevices.add(device);
            showNotice('info', `Added "${device.name || 'device'}" — watching for advertisement updates.`);
        } else {
            showNotice('info', `Added "${device.name || 'Unknown Device'}" (live advertisement data not available in this browser).`);
        }

    } catch (err) {
        if (err.name === 'NotFoundError') {
            // User cancelled the picker — not an error
            return;
        }
        showNotice('error', `Could not add device: ${err.message}`);
    }
}

/** Clear all detected devices from the list. */
function clearDevices() {
    // Stop watching manually added devices so cleared entries don't reappear
    stopWatchingDevices();

    devices.clear();
    deviceCards.clear();
    dirtyDevices.clear();
    clearTimeout(flushTimer);
    flushTimer = null;

    document.getElementById('device-list').replaceChildren(renderEmptyState());

    updateCounts();
    clearTimeout(alertTimer);
    document.getElementById('alert-banner').classList.add('hidden');
}

/** Build the empty-state placeholder from the HTML template. */
function renderEmptyState() {
    return document.getElementById('tpl-empty').content.cloneNode(true);
}

// ================================================================
// Utilities
// ================================================================

/** Escape HTML special characters to prevent XSS from device names/data. */
function escapeHTML(str) {
    if (str == null) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// ================================================================
// Init
// ================================================================

(function init() {
    // Wire up controls (script is loaded at end of <body>, DOM is ready)
    document.getElementById('btn-scan').addEventListener('click', startScan);
    document.getElementById('btn-stop').addEventListener('click', stopScan);
    document.getElementById('btn-add').addEventListener('click', addDevice);
    document.getElementById('btn-clear').addEventListener('click', clearDevices);
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => setFilter(btn.dataset.filter));
    });

    // Render the initial empty state from the template
    document.getElementById('device-list').appendChild(renderEmptyState());

    // Warn if page is not served over HTTPS (required for Web Bluetooth)
    if (location.protocol !== 'https:' && location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') {
        showNotice(
            'warn',
            'Web Bluetooth requires HTTPS. This page is served over HTTP — Bluetooth features will not work.'
        );
    }
})();

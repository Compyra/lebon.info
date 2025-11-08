// Wake Lock functionality
let wakeLock = null;
const statusElement = document.getElementById('wakeLockStatus');

// Helper function to get current timestamp
function getTimestamp() {
    return new Date().toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
}

async function requestWakeLock() {
    try {
        wakeLock = await navigator.wakeLock.request('screen');
        statusElement.textContent = 'WAKE_LOCK: ACTIVE';
        statusElement.style.color = '#00ff00';
        
        console.log(`[${getTimestamp()}] [SYSTEM] Wake Lock activated`);
        
        // Re-request wake lock when visibility changes
        wakeLock.addEventListener('release', () => {
            console.log(`[${getTimestamp()}] [SYSTEM] Wake Lock released`);
            statusElement.textContent = 'WAKE_LOCK: RELEASED';
            statusElement.style.color = '#ff9900';
        });
        
    } catch (err) {
        console.error(`[${getTimestamp()}] [ERROR] ${err.name}, ${err.message}`);
        statusElement.textContent = 'WAKE_LOCK: UNSUPPORTED';
        statusElement.style.color = '#ff0000';
    }
}

// Request wake lock on page load
requestWakeLock();

// Re-request wake lock when page becomes visible again
document.addEventListener('visibilitychange', async () => {
    if (wakeLock !== null && document.visibilityState === 'visible') {
        await requestWakeLock();
    }
});

// Optional: Add keyboard shortcut easter egg
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);
    
    if (konamiCode.join(',') === konamiSequence.join(',')) {
        document.body.style.animation = 'matrix 2s ease-in-out';
        setTimeout(() => {
            document.body.style.animation = '';
        }, 2000);
    }
});

// Matrix effect keyframes (added dynamically)
const style = document.createElement('style');
style.textContent = `
    @keyframes matrix {
        0%, 100% { filter: hue-rotate(0deg); }
        50% { filter: hue-rotate(120deg); }
    }
`;
document.head.appendChild(style);

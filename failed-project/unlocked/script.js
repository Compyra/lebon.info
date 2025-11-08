// Military Alphabet Data
const militaryAlphabet = [
    { letter: 'A', word: 'Alpha', pronunciation: 'AL-fuh' },
    { letter: 'B', word: 'Bravo', pronunciation: 'BRAH-voh' },
    { letter: 'C', word: 'Charlie', pronunciation: 'CHAR-lee' },
    { letter: 'D', word: 'Delta', pronunciation: 'DEL-tuh' },
    { letter: 'E', word: 'Echo', pronunciation: 'EK-oh' },
    { letter: 'F', word: 'Foxtrot', pronunciation: 'FOKS-trot' },
    { letter: 'G', word: 'Golf', pronunciation: 'GOLF' },
    { letter: 'H', word: 'Hotel', pronunciation: 'hoh-TEL' },
    { letter: 'I', word: 'India', pronunciation: 'IN-dee-uh' },
    { letter: 'J', word: 'Juliett', pronunciation: 'JOO-lee-ett' },
    { letter: 'K', word: 'Kilo', pronunciation: 'KEY-loh' },
    { letter: 'L', word: 'Lima', pronunciation: 'LEE-muh' },
    { letter: 'M', word: 'Mike', pronunciation: 'MYK' },
    { letter: 'N', word: 'November', pronunciation: 'noh-VEM-ber' },
    { letter: 'O', word: 'Oscar', pronunciation: 'AHS-kur' },
    { letter: 'P', word: 'Papa', pronunciation: 'puh-PAH' },
    { letter: 'Q', word: 'Quebec', pronunciation: 'kwe-BEK' },
    { letter: 'R', word: 'Romeo', pronunciation: 'ROH-mee-oh' },
    { letter: 'S', word: 'Sierra', pronunciation: 'see-AIR-uh' },
    { letter: 'T', word: 'Tango', pronunciation: 'TANG-go' },
    { letter: 'U', word: 'Uniform', pronunciation: 'YOU-nuh-form' },
    { letter: 'V', word: 'Victor', pronunciation: 'VIK-tur' },
    { letter: 'W', word: 'Whiskey', pronunciation: 'WIS-kee' },
    { letter: 'X', word: 'X-ray', pronunciation: 'ECKS-ray' },
    { letter: 'Y', word: 'Yankee', pronunciation: 'YANG-kee' },
    { letter: 'Z', word: 'Zulu', pronunciation: 'ZOO-loo' }
];

// State variables
let currentMode = 'grid';
let currentSlideIndex = 0;
let isAutoPlaying = false;
let slideshowInterval = null;
let autoPlayInterval = null;
let lastActivityTime = Date.now();

// Keep-unlock variables
let unlockInterval = null;
let videoElement = null;
const INACTIVITY_THRESHOLD = 30000; // 30 seconds

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    initializeGrid();
    createFakeVideoElement();
    startKeepUnlocked();
    setupActivityListeners();
    
    // Set language to English
    setLanguage('en');
});

// ==================== KEEP UNLOCK FUNCTIONALITY ====================

function createFakeVideoElement() {
    // Create a hidden video element that plays a minimal looping video
    // This tricks the browser and OS into thinking a video is being watched
    
    const canvas = document.createElement('canvas');
    canvas.width = 320;
    canvas.height = 240;
    canvas.style.display = 'none';
    document.body.appendChild(canvas);
    
    // Create a simple animated video stream using canvas
    const ctx = canvas.getContext('2d');
    let frameCount = 0;
    
    function animateCanvas() {
        frameCount++;
        
        // Draw a simple animated pattern
        ctx.fillStyle = `hsl(${frameCount % 360}, 100%, 50%)`;
        ctx.fillRect(0, 0, 320, 240);
        
        // Draw some moving elements
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.fillRect((frameCount * 2) % 320, (frameCount * 3) % 240, 50, 50);
        
        requestAnimationFrame(animateCanvas);
    }
    
    // Start the animation
    animateCanvas();
    
    // Create a hidden video element that plays from the canvas stream
    videoElement = document.createElement('video');
    videoElement.style.display = 'none';
    videoElement.muted = true;
    videoElement.autoplay = true;
    videoElement.loop = true;
    videoElement.playsInline = true;
    
    // Convert canvas to video stream
    const stream = canvas.captureStream(30); // 30 FPS
    videoElement.srcObject = stream;
    
    // Add to body but keep hidden
    document.body.appendChild(videoElement);
    
    // Start playing
    videoElement.play().catch(err => {
        console.log('Auto-play prevented, will try again:', err);
        // Retry on user interaction
        document.addEventListener('click', () => {
            videoElement.play().catch(e => console.log('Video play failed:', e));
        }, { once: true });
    });
    
    console.log('Fake video element created and playing');
}

function startKeepUnlocked() {
    // Request fullscreen to help prevent screensaver on some systems
    try {
        const elem = document.documentElement;
        if (elem.requestFullscreen) {
            // Don't force fullscreen, but prepare the capability
        }
    } catch (e) {
        // Silently fail if fullscreen not available
    }
    
    // Create a hidden audio element that plays periodically to keep system active
    createKeepAliveAudio();
    
    // Prevent idle by constantly triggering browser activity every 15 seconds
    unlockInterval = setInterval(() => {
        // Method 1: Request animation frame to keep GPU active
        requestAnimationFrame(() => {
            // Trigger a layout recalculation
            const _ = document.body.offsetHeight;
        });
        
        // Method 2: Create and dispatch multiple keyboard events
        const keyEvent = new KeyboardEvent('keydown', {
            bubbles: true,
            cancelable: true,
            view: window,
            key: 'Shift',
            code: 'ShiftLeft',
            shiftKey: true
        });
        document.dispatchEvent(keyEvent);
        
        const keyUpEvent = new KeyboardEvent('keyup', {
            bubbles: true,
            cancelable: true,
            view: window,
            key: 'Shift',
            code: 'ShiftLeft',
            shiftKey: false
        });
        document.dispatchEvent(keyUpEvent);
        
        // Method 3: Dispatch multiple mouse move events
        for (let i = 0; i < 3; i++) {
            const event = new MouseEvent('mousemove', {
                bubbles: true,
                cancelable: true,
                view: window,
                clientX: Math.random() * window.innerWidth,
                clientY: Math.random() * window.innerHeight
            });
            document.dispatchEvent(event);
        }
        
        // Method 4: Wiggle the page content
        const body = document.body;
        const original = body.style.transform;
        body.style.transform = 'translateX(1px)';
        setTimeout(() => {
            body.style.transform = original;
        }, 50);
        
        lastActivityTime = Date.now();
        console.log('Full activity pulse sent at', new Date().toLocaleTimeString());
    }, 15000); // Every 15 seconds for more frequent pulses
    
    // Additional: Every 8 seconds, keep the tab active by triggering focus
    setInterval(() => {
        window.focus();
    }, 8000);
    
    // Keep the page visible and prevent visibility changes
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            // Try to bring the window back
            window.focus();
        }
    });
}

function createKeepAliveAudio() {
    // Create an audio context that plays silent but active audio
    // This keeps the audio subsystem awake and prevents some power management
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const audioContext = new AudioContext();
        
        // Create a silent oscillator
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // Set volume to 0 (inaudible)
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        
        // Start the oscillator at a very low frequency
        oscillator.frequency.setValueAtTime(0.1, audioContext.currentTime);
        oscillator.start();
        
        // Resume audio context on user interaction if needed
        if (audioContext.state === 'suspended') {
            document.addEventListener('click', () => {
                audioContext.resume();
            }, { once: true });
        }
        
        console.log('Keep-alive audio context created');
    } catch (e) {
        console.log('Audio context not available:', e);
    }
}

function setupActivityListeners() {
    // Listen for real user activity
    document.addEventListener('mousemove', updateActivityTime);
    document.addEventListener('keydown', updateActivityTime);
    document.addEventListener('click', updateActivityTime);
    document.addEventListener('touchstart', updateActivityTime);
}

function updateActivityTime() {
    lastActivityTime = Date.now();
}

function stopKeepUnlocked() {
    if (unlockInterval) {
        clearInterval(unlockInterval);
        unlockInterval = null;
    }
}

// ==================== MILITARY ALPHABET GRID ====================

function initializeGrid() {
    const gridContainer = document.getElementById('gridContainer');
    gridContainer.innerHTML = '';
    
    militaryAlphabet.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'alphabet-card';
        card.onclick = () => selectCard(card, index);
        card.innerHTML = `
            <div class="letter">${item.letter}</div>
            <div class="word">${item.word}</div>
            <div class="pronunciation">${item.pronunciation}</div>
        `;
        gridContainer.appendChild(card);
    });
}

function selectCard(cardElement, index) {
    // Remove active class from all cards
    document.querySelectorAll('.alphabet-card').forEach(card => {
        card.classList.remove('active');
    });
    
    // Add active class to clicked card
    cardElement.classList.add('active');
    
    // If in slideshow mode, switch to that slide
    if (currentMode === 'slideshow') {
        currentSlideIndex = index;
        updateSlideshow();
    }
}

// ==================== SLIDESHOW FUNCTIONALITY ====================

function setMode(mode) {
    currentMode = mode;
    
    // Update button states
    document.querySelectorAll('.control-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Stop any ongoing slideshows
    if (slideshowInterval) {
        clearInterval(slideshowInterval);
        slideshowInterval = null;
    }
    
    const gridContainer = document.getElementById('gridContainer');
    const slideshowContainer = document.getElementById('slideshowContainer');
    
    if (mode === 'grid') {
        gridContainer.style.display = 'grid';
        slideshowContainer.style.display = 'none';
    } else if (mode === 'slideshow' || mode === 'speed') {
        gridContainer.style.display = 'none';
        slideshowContainer.style.display = 'block';
        currentSlideIndex = 0;
        updateSlideshow();
    }
}

function updateSlideshow() {
    const item = militaryAlphabet[currentSlideIndex];
    document.getElementById('slideshowLetter').textContent = item.letter;
    document.getElementById('slideshowWord').textContent = item.word;
    document.getElementById('slideshowPronounciation').textContent = item.pronunciation;
}

function nextSlide() {
    currentSlideIndex = (currentSlideIndex + 1) % militaryAlphabet.length;
    updateSlideshow();
}

function prevSlide() {
    currentSlideIndex = (currentSlideIndex - 1 + militaryAlphabet.length) % militaryAlphabet.length;
    updateSlideshow();
}

function toggleSlideshowPlay() {
    const playBtnText = document.getElementById('playbtnText');
    
    if (slideshowInterval) {
        clearInterval(slideshowInterval);
        slideshowInterval = null;
        playBtnText.textContent = 'Play';
    } else {
        const speed = currentMode === 'speed' ? 2000 : 4000; // 2 seconds for speed mode, 4 for normal
        slideshowInterval = setInterval(() => {
            nextSlide();
        }, speed);
        playBtnText.textContent = 'Stop';
    }
}

function toggleAutoPlay() {
    if (isAutoPlaying) {
        // Stop auto play
        if (slideshowInterval) {
            clearInterval(slideshowInterval);
            slideshowInterval = null;
        }
        isAutoPlaying = false;
        document.getElementById('autoPlayStatus').textContent = 'OFF';
    } else {
        // Start auto play
        isAutoPlaying = true;
        document.getElementById('autoPlayStatus').textContent = 'ON';
        
        // Switch to slideshow mode if not already
        if (currentMode === 'grid') {
            setMode('slideshow');
        }
        
        // Start the slideshow
        const speed = currentMode === 'speed' ? 2000 : 4000;
        slideshowInterval = setInterval(() => {
            nextSlide();
        }, speed);
        
        document.querySelector('.control-btn').textContent = 'Grid View';
    }
}

// ==================== LANGUAGE SUPPORT ====================

function setLanguage(lang) {
    // For now, just set to English as the page is primarily in English
    document.body.setAttribute('data-lang', lang);
}

// ==================== CLEANUP ====================

window.addEventListener('beforeunload', function() {
    stopKeepUnlocked();
    if (slideshowInterval) {
        clearInterval(slideshowInterval);
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    if (currentMode === 'slideshow' || currentMode === 'speed') {
        if (e.key === 'ArrowRight') {
            nextSlide();
            e.preventDefault();
        } else if (e.key === 'ArrowLeft') {
            prevSlide();
            e.preventDefault();
        } else if (e.key === ' ') {
            toggleSlideshowPlay();
            e.preventDefault();
        }
    }
    
    // Esc to go back
    if (e.key === 'Escape' || e.key === 'Esc') {
        window.location.href = '../../';
    }
});

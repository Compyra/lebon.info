// Default settings
const DEFAULT_SETTINGS = {
    blackAndWhite: false,
    colorblindMode: false,
    twoTeams: false,
    threeTeams: false,
    manualMode: false,
    waitTime: 3,
    selectionTime: 3,
    effectDuration: 5
};

// Game state
let settings = { ...DEFAULT_SETTINGS };
let activeTouches = new Map();
let gamePhase = 'waiting'; // 'waiting', 'countdown', 'selecting', 'winner', 'cooldown'
let countdownTimer = null;
let countdownInterval = null;
let countdownStartTime = null;
let selectedWinner = null;
let colorPool = [];
let testFingerIds = [];
let testFingerCounter = 0;
let participants = [];
let mouseDown = false;
let mouseTouchId = 'mouse-touch';
let lastTapTime = 0;
let tapTimeout = null;
let teamAssignments = new Map(); // Maps touch ID to team number (1 or 2)
let teamColors = { team1: null, team2: null, team3: null };

// DOM Elements
const burgerMenu = document.getElementById('burger-menu');
const settingsPanel = document.getElementById('settings-panel');
const gameArea = document.getElementById('game-area');
const touchContainer = document.getElementById('touch-container');
const instructionText = document.getElementById('instruction-text');
const doubleTapPrompt = document.getElementById('double-tap-prompt');
const countdownDisplay = document.getElementById('countdown-display');
const manualModeInterface = document.getElementById('manual-mode-interface');
const participantInput = document.getElementById('participant-input');
const addParticipantBtn = document.getElementById('add-participant-btn');
const participantsList = document.getElementById('participants-list');
const randomizeBtn = document.getElementById('randomize-btn');
const clearAllBtn = document.getElementById('clear-all-btn');
const resultDisplay = document.getElementById('result-display');
let manualSubtitle; // Will be initialized after DOM loads

// Settings inputs
const blackAndWhiteCheckbox = document.getElementById('black-and-white-mode');
const colorblindCheckbox = document.getElementById('colorblind-mode');
const twoTeamsCheckbox = document.getElementById('two-teams-mode');
const threeTeamsCheckbox = document.getElementById('three-teams-mode');
const manualModeCheckbox = document.getElementById('manual-mode');
const testModeBtn = document.getElementById('test-mode-btn');
const waitTimeInput = document.getElementById('wait-time');
const selectionTimeInput = document.getElementById('selection-time');
const effectDurationInput = document.getElementById('effect-duration');
const resetSettingsBtn = document.getElementById('reset-settings');

// Initialize
loadSettings();
setupEventListeners();

function loadSettings() {
    const saved = localStorage.getItem('randomFirstPlayerSettings');
    if (saved) {
        try {
            settings = { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
        } catch (e) {
            settings = { ...DEFAULT_SETTINGS };
        }
    }
    updateSettingsUI();
}

function saveSettings() {
    localStorage.setItem('randomFirstPlayerSettings', JSON.stringify(settings));
}

function updateSettingsUI() {
    blackAndWhiteCheckbox.checked = settings.blackAndWhite;
    colorblindCheckbox.checked = settings.colorblindMode;
    twoTeamsCheckbox.checked = settings.twoTeams;
    threeTeamsCheckbox.checked = settings.threeTeams;
    manualModeCheckbox.checked = settings.manualMode;
    
    // Get manual subtitle reference
    manualSubtitle = document.querySelector('.manual-subtitle');
    waitTimeInput.value = settings.waitTime;
    selectionTimeInput.value = settings.selectionTime;
    effectDurationInput.value = settings.effectDuration;
    updateModeDisplay();
    updateTestModeButton();
    applyBlackAndWhiteMode();
}

function setupEventListeners() {
    // Menu - burger button toggles settings panel
    let lastMenuToggleTime = 0;
    
    const toggleMenuTouch = () => {
        lastMenuToggleTime = Date.now();
        settingsPanel.classList.toggle('active');
        burgerMenu.classList.toggle('active');
    };
    
    const toggleMenuClick = () => {
        // Ignore click if it happened within 300ms of a touch (prevents double-firing)
        if (Date.now() - lastMenuToggleTime < 300) return;
        settingsPanel.classList.toggle('active');
        burgerMenu.classList.toggle('active');
    };
    
    burgerMenu.addEventListener('touchstart', toggleMenuTouch, { passive: true });
    burgerMenu.addEventListener('click', toggleMenuClick);

    // Settings changes
    blackAndWhiteCheckbox.addEventListener('change', (e) => {
        settings.blackAndWhite = e.target.checked;
        saveSettings();
        applyBlackAndWhiteMode();
    });

    colorblindCheckbox.addEventListener('change', (e) => {
        settings.colorblindMode = e.target.checked;
        saveSettings();
        
        // Update all existing touch indicators
        activeTouches.forEach((touchData) => {
            updateTouchIndicatorText(touchData);
        });
    });

    twoTeamsCheckbox.addEventListener('change', (e) => {
        settings.twoTeams = e.target.checked;
        // Disable three teams if two teams is enabled
        if (e.target.checked && settings.threeTeams) {
            settings.threeTeams = false;
            threeTeamsCheckbox.checked = false;
        }
        saveSettings();
        // Reset teams and colors when mode changes
        teamAssignments.clear();
        if (e.target.checked) {
            // Update all existing touches to gray
            activeTouches.forEach((touchData) => {
                const grayColor = 'hsl(0, 0%, 70%)';
                touchData.color = grayColor;
                touchData.element.style.backgroundColor = grayColor;
                touchData.element.style.color = getContrastColor(grayColor);
                updateTouchIndicatorText(touchData);
            });
        } else {
            // Restore individual colors
            let index = 0;
            activeTouches.forEach((touchData) => {
                const newColor = getColorForTouch(index++);
                touchData.color = newColor;
                touchData.element.style.backgroundColor = newColor;
                touchData.element.style.color = getContrastColor(newColor);
                updateTouchIndicatorText(touchData);
            });
        }
        updateInstructionText();
        updateManualModeText();
    });

    threeTeamsCheckbox.addEventListener('change', (e) => {
        settings.threeTeams = e.target.checked;
        // Disable two teams if three teams is enabled
        if (e.target.checked && settings.twoTeams) {
            settings.twoTeams = false;
            twoTeamsCheckbox.checked = false;
        }
        saveSettings();
        // Reset teams and colors when mode changes
        teamAssignments.clear();
        if (e.target.checked) {
            // Update all existing touches to gray
            activeTouches.forEach((touchData) => {
                const grayColor = 'hsl(0, 0%, 70%)';
                touchData.color = grayColor;
                touchData.element.style.backgroundColor = grayColor;
                touchData.element.style.color = getContrastColor(grayColor);
                updateTouchIndicatorText(touchData);
            });
        } else {
            // Restore individual colors
            let index = 0;
            activeTouches.forEach((touchData) => {
                const newColor = getColorForTouch(index++);
                touchData.color = newColor;
                touchData.element.style.backgroundColor = newColor;
                touchData.element.style.color = getContrastColor(newColor);
                updateTouchIndicatorText(touchData);
            });
        }
        updateInstructionText();
        updateManualModeText();
    });

    waitTimeInput.addEventListener('change', (e) => {
        settings.waitTime = parseFloat(e.target.value);
        saveSettings();
    });

    selectionTimeInput.addEventListener('change', (e) => {
        settings.selectionTime = parseFloat(e.target.value);
        saveSettings();
    });

    effectDurationInput.addEventListener('change', (e) => {
        settings.effectDuration = parseFloat(e.target.value);
        saveSettings();
    });

    resetSettingsBtn.addEventListener('click', () => {
        settings = { ...DEFAULT_SETTINGS };
        saveSettings();
        updateSettingsUI();
    });

    manualModeCheckbox.addEventListener('change', (e) => {
        settings.manualMode = e.target.checked;
        saveSettings();
        updateModeDisplay();
        if (!e.target.checked) {
            resetGame();
        }
    });

    testModeBtn.addEventListener('click', (e) => {
        if (!settings.manualMode) {
            addTestFinger();
        }
    });

    // Touch events
    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd, { passive: false });
    document.addEventListener('touchcancel', handleTouchEnd, { passive: false });
    
    // Mouse events for desktop
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseUp);
    document.addEventListener('dblclick', handleDoubleClick);
    
    // Manual mode events
    addParticipantBtn.addEventListener('click', addParticipant);
    participantInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addParticipant();
        }
    });
    randomizeBtn.addEventListener('click', randomizeParticipants);
    clearAllBtn.addEventListener('click', clearAllParticipants);
    
    // Double tap prompt click
    doubleTapPrompt.addEventListener('click', (e) => {
        e.stopPropagation();
        if (gamePhase === 'winner' || gamePhase === 'cooldown') {
            resetGame();
        }
    });
}

function handleTouchStart(e) {
    // Allow touches on settings panel to work normally
    if (e.target.closest('.settings-panel') || e.target.closest('.burger-menu')) {
        return; // Don't prevent default - let normal interaction happen
    }
    
    e.preventDefault();
    
    // Handle double tap during winner/cooldown phase
    if (gamePhase === 'winner' || gamePhase === 'cooldown') {
        handleDoubleTap();
        return;
    }
    
    // Block new touches during selection and winner phases
    if (gamePhase === 'selecting' || gamePhase === 'winner' || gamePhase === 'cooldown') {
        return;
    }

    const touches = e.changedTouches;
    
    for (let i = 0; i < touches.length; i++) {
        const touch = touches[i];
        const touchId = touch.identifier;
        
        if (!activeTouches.has(touchId)) {
            // Don't assign teams yet - will happen during selection
            const color = getColorForTouch(activeTouches.size, touchId);
            const number = activeTouches.size + 1;
            const touchData = {
                id: touchId,
                x: touch.clientX,
                y: touch.clientY,
                color: color,
                number: number,
                element: createTouchIndicator(touch.clientX, touch.clientY, color, number)
            };
            
            activeTouches.set(touchId, touchData);
        }
    }

    updateInstructionText();
    startCountdownIfNeeded();
}

function handleTouchMove(e) {
    // Allow touches on settings panel to work normally
    if (e.target.closest('.settings-panel') || e.target.closest('.burger-menu')) {
        return; // Don't prevent default - let normal interaction happen
    }
    
    e.preventDefault();
    
    const touches = e.changedTouches;
    
    for (let i = 0; i < touches.length; i++) {
        const touch = touches[i];
        const touchData = activeTouches.get(touch.identifier);
        
        if (touchData) {
            touchData.x = touch.clientX;
            touchData.y = touch.clientY;
            touchData.element.style.left = touch.clientX + 'px';
            touchData.element.style.top = touch.clientY + 'px';
        }
    }
}

function handleTouchEnd(e) {
    // Allow touches on settings panel to work normally
    if (e.target.closest('.settings-panel') || e.target.closest('.burger-menu')) {
        return; // Don't prevent default - let normal interaction happen
    }
    
    e.preventDefault();
    
    // Don't remove fingers during winner/cooldown - they stay imprinted
    if (gamePhase === 'winner' || gamePhase === 'cooldown') {
        return;
    }
    
    // Don't remove fingers after countdown starts in two teams mode or any mode
    if (gamePhase === 'countdown' || gamePhase === 'selecting') {
        return;
    }
    
    const touches = e.changedTouches;
    
    for (let i = 0; i < touches.length; i++) {
        const touch = touches[i];
        const touchData = activeTouches.get(touch.identifier);
        
        if (touchData) {
            touchData.element.remove();
            activeTouches.delete(touch.identifier);
            // Clean up team assignment
            if (settings.twoTeams || settings.threeTeams) {
                teamAssignments.delete(touch.identifier);
            }
        }
    }
    
    // Check if we need to cancel countdown due to insufficient players
    if (gamePhase === 'countdown' && activeTouches.size < 2) {
        clearTimeout(countdownTimer);
        if (countdownInterval) {
            clearInterval(countdownInterval);
            countdownInterval = null;
        }
        countdownDisplay.classList.remove('visible');
        gamePhase = 'waiting';
        updateInstructionText();
    }

    // Only allow reset if all fingers removed during waiting phase
    if (activeTouches.size === 0 && gamePhase === 'waiting') {
        resetGame();
    } else {
        updateInstructionText();
    }
}

function createTouchIndicator(x, y, color, number) {
    const indicator = document.createElement('div');
    indicator.className = 'touch-indicator';
    indicator.style.left = x + 'px';
    indicator.style.top = y + 'px';
    indicator.style.backgroundColor = color;
    indicator.style.color = getContrastColor(color);
    
    if (settings.colorblindMode) {
        indicator.textContent = number;
    }
    
    touchContainer.appendChild(indicator);
    return indicator;
}

function updateTouchIndicatorText(touchData) {
    if (!settings.colorblindMode) return;
    
    const isTeamMode = settings.twoTeams || settings.threeTeams;
    
    if (isTeamMode && teamAssignments.has(touchData.id)) {
        const team = teamAssignments.get(touchData.id);
        // Show user number on top, team number below
        touchData.element.innerHTML = `<div style="display: flex; flex-direction: column; align-items: center; line-height: 1.2;"><div style="font-size: 1.3em; font-weight: bold;">${touchData.number}</div><div style="font-size: 0.7em; margin-top: 4px; opacity: 0.9;">Team ${team}</div></div>`;
    } else {
        touchData.element.textContent = touchData.number;
    }
}

function getColorForTouch(index, touchId = null) {
    if (settings.twoTeams) {
        // During waiting/countdown phase, show gray colors
        if (gamePhase === 'waiting' || gamePhase === 'countdown') {
            return 'hsl(0, 0%, 70%)'; // Gray color
        }
        // After selection starts, return team color if assigned
        if (touchId !== null && teamAssignments.has(touchId)) {
            const team = teamAssignments.get(touchId);
            if (team === 1) {
                return teamColors.team1;
            } else if (team === 2) {
                return teamColors.team2;
            }
        }
    }
    
    if (settings.blackAndWhite) {
        // Return grayscale colors in black and white mode
        return generateGrayscaleColor();
    }
    
    // Ensure we have enough unique colors
    while (colorPool.length <= index) {
        colorPool.push(generateRandomColor());
    }
    
    return colorPool[index];
}

function generateRandomColor() {
    // Generate vibrant, saturated colors
    const hue = Math.floor(Math.random() * 360);
    const saturation = 70 + Math.random() * 30; // 70-100%
    const lightness = 50 + Math.random() * 20; // 50-70%
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

function generateGrayscaleColor() {
    // Generate various shades of gray (white to light gray)
    const lightness = 70 + Math.random() * 30; // 70-100% for light grays to white
    return `hsl(0, 0%, ${lightness}%)`;
}

function getContrastColor(hslColor) {
    // Extract lightness from HSL
    const match = hslColor.match(/hsl\(\d+,\s*\d+%,\s*(\d+)%\)/);
    if (match) {
        const lightness = parseInt(match[1]);
        return lightness > 60 ? '#000' : '#fff';
    }
    return '#fff';
}

function updateInstructionText() {
    if (activeTouches.size === 0) {
        instructionText.textContent = 'Place your fingers on the screen';
        instructionText.classList.remove('hidden');
    } else if (gamePhase === 'waiting') {
        if (settings.twoTeams) {
            instructionText.textContent = `${activeTouches.size} player${activeTouches.size > 1 ? 's' : ''} ready (teams will be assigned)`;
        } else if (settings.threeTeams) {
            instructionText.textContent = `${activeTouches.size} player${activeTouches.size > 1 ? 's' : ''} ready (3 teams will be assigned)`;
        } else {
            instructionText.textContent = `${activeTouches.size} player${activeTouches.size > 1 ? 's' : ''} ready...`;
        }
    } else if (gamePhase === 'countdown') {
        if (settings.twoTeams || settings.threeTeams) {
            instructionText.textContent = 'Get ready...';
            instructionText.classList.remove('hidden');
        } else {
            instructionText.classList.add('hidden');
        }
    } else if (gamePhase === 'selecting') {
        if (settings.twoTeams || settings.threeTeams) {
            instructionText.textContent = 'Assigning teams...';
            instructionText.classList.remove('hidden');
        } else {
            instructionText.classList.add('hidden');
        }
    } else if (gamePhase === 'winner') {
        if ((settings.twoTeams || settings.threeTeams) && selectedWinner) {
            const winningTeam = teamAssignments.get(selectedWinner.id);
            instructionText.textContent = `Team ${winningTeam} wins!`;
        } else {
            instructionText.textContent = 'Winner selected!';
        }
        instructionText.classList.remove('hidden');
    }
}

function startCountdownIfNeeded() {
    if (gamePhase === 'waiting' && activeTouches.size >= 2) {
        gamePhase = 'countdown';
        updateInstructionText();
        
        // Start countdown display
        countdownStartTime = Date.now();
        updateCountdownDisplay();
        
        countdownTimer = setTimeout(() => {
            startSelection();
        }, settings.waitTime * 1000);
    }
}

function updateCountdownDisplay() {
    if (gamePhase !== 'countdown') {
        countdownDisplay.classList.remove('visible');
        if (countdownInterval) {
            clearInterval(countdownInterval);
            countdownInterval = null;
        }
        return;
    }
    
    const elapsed = Date.now() - countdownStartTime;
    const remaining = Math.max(0, settings.waitTime * 1000 - elapsed);
    const secondsLeft = Math.ceil(remaining / 1000);
    
    countdownDisplay.textContent = secondsLeft;
    countdownDisplay.classList.add('visible');
    
    if (remaining > 0 && !countdownInterval) {
        countdownInterval = setInterval(() => {
            updateCountdownDisplay();
        }, 100);
    }
    
    if (remaining <= 0) {
        countdownDisplay.classList.remove('visible');
        if (countdownInterval) {
            clearInterval(countdownInterval);
            countdownInterval = null;
        }
    }
}

function startSelection() {
    // Clear countdown display
    updateCountdownDisplay();
    
    // Check if we still have enough players
    if (activeTouches.size < 2) {
        gamePhase = 'waiting';
        updateInstructionText();
        return;
    }
    
    gamePhase = 'selecting';
    updateInstructionText();
    
    // Assign teams now if in two teams or three teams mode
    if (settings.twoTeams || settings.threeTeams) {
        const numTeams = settings.threeTeams ? 3 : 2;
        assignTeamsRandomly(numTeams);
    }
    
    // Animate colors during selection
    const startTime = Date.now();
    const duration = settings.selectionTime * 1000;
    
    const animateColors = () => {
        if (gamePhase !== 'selecting') return;
        
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        if (settings.twoTeams || settings.threeTeams) {
            // In team modes, show team colors immediately (no animation needed)
            activeTouches.forEach((touchData) => {
                const team = teamAssignments.get(touchData.id);
                let newColor;
                if (team === 1) {
                    newColor = teamColors.team1;
                } else if (team === 2) {
                    newColor = teamColors.team2;
                } else if (team === 3) {
                    newColor = teamColors.team3;
                }
                touchData.color = newColor;
                touchData.element.style.backgroundColor = newColor;
                touchData.element.style.color = getContrastColor(newColor);
                
                // Don't show team numbers yet - wait until showTeamAssignments()
            });
            
            if (progress >= 1) {
                // In team modes, just show the teams - no winner selection
                showTeamAssignments();
            } else {
                requestAnimationFrame(animateColors);
            }
        } else {
            // Normal mode: Change colors randomly during selection
            activeTouches.forEach((touchData) => {
                const newColor = generateRandomColor();
                touchData.color = newColor;
                touchData.element.style.backgroundColor = newColor;
                touchData.element.style.color = getContrastColor(newColor);
            });
            
            if (progress < 1) {
                requestAnimationFrame(animateColors);
            } else {
                selectWinner();
            }
        }
    };
    
    animateColors();
}

function selectWinner() {
    if (activeTouches.size === 0) {
        resetGame();
        return;
    }

    gamePhase = 'winner';
    
    // Cryptographically secure random selection
    const touchArray = Array.from(activeTouches.values());
    const randomIndex = Math.floor(secureRandom() * touchArray.length);
    selectedWinner = touchArray[randomIndex];
    
    // Keep all fingers but dim non-winners
    activeTouches.forEach((touchData) => {
        if (touchData !== selectedWinner) {
            touchData.element.style.opacity = '0.3';
            touchData.element.style.transform = 'translate(-50%, -50%) scale(0.9)';
        } else {
            // Highlight winner
            touchData.element.classList.add('winner');
            touchData.element.style.opacity = '1';
        }
    });
    
    updateInstructionText();
    updateTestModeButton();
    
    // Show double tap prompt
    doubleTapPrompt.classList.add('visible');
    
    gamePhase = 'cooldown';
}

function showTeamAssignments() {
    gamePhase = 'cooldown';
    
    // Count team members
    const teamCounts = {};
    const numTeams = settings.threeTeams ? 3 : 2;
    
    for (let i = 1; i <= numTeams; i++) {
        teamCounts[i] = 0;
    }
    
    activeTouches.forEach((touchData) => {
        const team = teamAssignments.get(touchData.id);
        if (team && teamCounts[team] !== undefined) {
            teamCounts[team]++;
        }
    });
    
    // Build instruction text
    const teamStrings = [];
    for (let i = 1; i <= numTeams; i++) {
        teamStrings.push(`Team ${i}: ${teamCounts[i]}`);
    }
    
    instructionText.textContent = teamStrings.join(' | ');
    instructionText.classList.remove('hidden');
    
    // Now update all touch indicators to show team numbers (if colorblind mode)
    activeTouches.forEach((touchData) => {
        updateTouchIndicatorText(touchData);
    });
    
    // Show double tap prompt
    doubleTapPrompt.classList.add('visible');
}

function resetGame() {
    clearTimeout(countdownTimer);
    clearTimeout(tapTimeout);
    if (countdownInterval) {
        clearInterval(countdownInterval);
        countdownInterval = null;
    }
    
    // Clear all fingers and reset state
    activeTouches.clear();
    touchContainer.innerHTML = '';
    testFingerIds = [];
    selectedWinner = null;
    gamePhase = 'waiting';
    colorPool = [];
    teamAssignments.clear();
    
    // Hide double tap prompt
    doubleTapPrompt.classList.remove('visible');
    
    // Hide countdown display
    countdownDisplay.classList.remove('visible');
    
    updateInstructionText();
    updateTestModeButton();
}

function handleDoubleTap() {
    const currentTime = Date.now();
    const tapDelay = 500; // Maximum time between taps (in ms)
    
    if (currentTime - lastTapTime < tapDelay) {
        // Double tap detected
        resetGame();
        lastTapTime = 0;
    } else {
        // First tap
        lastTapTime = currentTime;
        
        // Clear the timer if it exists
        if (tapTimeout) {
            clearTimeout(tapTimeout);
        }
        
        // Reset after delay if no second tap
        tapTimeout = setTimeout(() => {
            lastTapTime = 0;
        }, tapDelay);
    }
}

function handleDoubleClick(e) {
    if (settings.manualMode) return;
    if (e.target.closest('.settings-panel') || e.target.closest('.burger-menu')) return;
    
    // Handle double click during winner/cooldown phase
    if (gamePhase === 'winner' || gamePhase === 'cooldown') {
        resetGame();
    }
}

function applyBlackAndWhiteMode() {
    if (settings.blackAndWhite) {
        document.body.style.filter = 'grayscale(100%)';
    } else {
        document.body.style.filter = 'none';
    }
}

// Two teams mode functions
function assignTeamsRandomly(numTeams = 2) {
    if (!settings.twoTeams && !settings.threeTeams) return;
    
    // Initialize team colors
    initializeTeamColors(numTeams);
    
    // Get all touch IDs and shuffle them randomly
    const touchIds = Array.from(activeTouches.keys());
    shuffleArray(touchIds);
    
    // Split into teams as equally as possible
    const playersPerTeam = Math.floor(touchIds.length / numTeams);
    const extraPlayers = touchIds.length % numTeams;
    
    let currentIndex = 0;
    for (let team = 1; team <= numTeams; team++) {
        const teamSize = playersPerTeam + (team <= extraPlayers ? 1 : 0);
        
        for (let i = 0; i < teamSize; i++) {
            teamAssignments.set(touchIds[currentIndex], team);
            currentIndex++;
        }
    }
}

function shuffleArray(array) {
    // Fisher-Yates shuffle using secure random
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(secureRandom() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function initializeTeamColors(numTeams = 2) {
    // Generate distinct colors for teams
    const colors = [];
    
    // Generate first color
    colors.push(generateRandomColor());
    
    // Generate remaining colors, ensuring they're distinct
    for (let i = 1; i < numTeams; i++) {
        let newColor;
        let attempts = 0;
        do {
            newColor = generateRandomColor();
            attempts++;
        } while (attempts < 50 && colors.some(c => colorsAreSimilar(c, newColor)));
        
        colors.push(newColor);
    }
    
    // Assign to team colors object
    teamColors.team1 = colors[0];
    teamColors.team2 = colors[1] || null;
    teamColors.team3 = colors[2] || null;
}

function colorsAreSimilar(color1, color2) {
    // Extract hue from HSL colors
    const hue1 = parseInt(color1.match(/hsl\((\d+)/)[1]);
    const hue2 = parseInt(color2.match(/hsl\((\d+)/)[1]);
    
    // Check if hues are too similar (within 60 degrees)
    const hueDiff = Math.abs(hue1 - hue2);
    return hueDiff < 60 || hueDiff > 300;
}

// Secure random number generator
function secureRandom() {
    if (window.crypto && window.crypto.getRandomValues) {
        const array = new Uint32Array(1);
        window.crypto.getRandomValues(array);
        return array[0] / (0xffffffff + 1);
    }
    // Fallback to Math.random (less secure but still random)
    return Math.random();
}

// Test mode functions
function addTestFinger() {
    if (settings.manualMode) return;
    
    // Block test fingers during selection and winner phases
    if (gamePhase === 'selecting' || gamePhase === 'winner' || gamePhase === 'cooldown') {
        return;
    }
    
    // Generate random position that doesn't overlap with existing touches
    const position = findNonOverlappingPosition();
    
    const testId = `test-finger-${testFingerCounter++}`;
    
    // Don't assign team yet - will happen during selection
    const color = getColorForTouch(activeTouches.size, testId);
    const number = activeTouches.size + 1;
    
    const touchData = {
        id: testId,
        x: position.x,
        y: position.y,
        color: color,
        number: number,
        element: createTouchIndicator(position.x, position.y, color, number)
    };
    
    touchData.element.classList.add('test-finger');
    touchData.element.title = 'Test finger';
    activeTouches.set(testId, touchData);
    testFingerIds.push(testId);
    
    updateInstructionText();
    startCountdownIfNeeded();
    updateTestModeButton();
}

function findNonOverlappingPosition() {
    const minDistance = 150; // Minimum distance between touches
    const margin = 100; // Margin from screen edges
    let attempts = 0;
    const maxAttempts = 50;
    
    while (attempts < maxAttempts) {
        const x = margin + Math.random() * (window.innerWidth - 2 * margin);
        const y = margin + Math.random() * (window.innerHeight - 2 * margin);
        
        // Check distance from all existing touches
        let tooClose = false;
        for (const [id, touchData] of activeTouches) {
            const dx = x - touchData.x;
            const dy = y - touchData.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < minDistance) {
                tooClose = true;
                break;
            }
        }
        
        if (!tooClose) {
            return { x, y };
        }
        
        attempts++;
    }
    
    // Fallback: just use a random position if we can't find a good spot
    return {
        x: margin + Math.random() * (window.innerWidth - 2 * margin),
        y: margin + Math.random() * (window.innerHeight - 2 * margin)
    };
}

function removeAllTestFingers() {
    // Remove all test fingers
    testFingerIds.forEach(testId => {
        const touchData = activeTouches.get(testId);
        if (touchData && touchData.element) {
            touchData.element.remove();
            activeTouches.delete(testId);
            // Clean up team assignment
            if (settings.twoTeams || settings.threeTeams) {
                teamAssignments.delete(testId);
            }
        }
    });
    testFingerIds = [];
}

// Mouse event handlers
function handleMouseDown(e) {
    if (settings.manualMode) return;
    if (e.target.closest('.settings-panel') || e.target.closest('.burger-menu')) return;
    
    // Handle double click during winner/cooldown phase
    if (gamePhase === 'winner' || gamePhase === 'cooldown') {
        handleDoubleTap();
        return;
    }
    
    // Block new touches during selection and winner phases
    if (gamePhase === 'selecting' || gamePhase === 'winner' || gamePhase === 'cooldown') {
        return;
    }
    
    e.preventDefault();
    mouseDown = true;
    
    if (!activeTouches.has(mouseTouchId)) {
        // Don't assign team yet - will happen during selection
        const color = getColorForTouch(activeTouches.size, mouseTouchId);
        const number = activeTouches.size + 1;
        const touchData = {
            id: mouseTouchId,
            x: e.clientX,
            y: e.clientY,
            color: color,
            number: number,
            element: createTouchIndicator(e.clientX, e.clientY, color, number)
        };
        
        activeTouches.set(mouseTouchId, touchData);
        updateInstructionText();
        startCountdownIfNeeded();
    }
}

function handleMouseMove(e) {
    if (!mouseDown || settings.manualMode) return;
    
    const touchData = activeTouches.get(mouseTouchId);
    if (touchData) {
        touchData.x = e.clientX;
        touchData.y = e.clientY;
        touchData.element.style.left = e.clientX + 'px';
        touchData.element.style.top = e.clientY + 'px';
    }
}

function handleMouseUp(e) {
    if (!mouseDown || settings.manualMode) return;
    
    mouseDown = false;
    
    // Don't remove fingers during winner/cooldown - they stay imprinted
    if (gamePhase === 'winner' || gamePhase === 'cooldown') {
        return;
    }
    
    // Don't remove fingers after countdown starts
    if (gamePhase === 'countdown' || gamePhase === 'selecting') {
        return;
    }
    
    const touchData = activeTouches.get(mouseTouchId);
    
    if (touchData) {
        touchData.element.remove();
        activeTouches.delete(mouseTouchId);
        // Clean up team assignment
        if (settings.twoTeams || settings.threeTeams) {
            teamAssignments.delete(mouseTouchId);
        }
    }
    
    // Check if we need to cancel countdown due to insufficient players
    if (gamePhase === 'countdown' && activeTouches.size < 2) {
        clearTimeout(countdownTimer);
        if (countdownInterval) {
            clearInterval(countdownInterval);
            countdownInterval = null;
        }
        countdownDisplay.classList.remove('visible');
        gamePhase = 'waiting';
        updateInstructionText();
    }
    
    // Only allow reset if all fingers removed during waiting phase
    if (activeTouches.size === 0 && gamePhase === 'waiting') {
        resetGame();
    } else if ((activeTouches.size === 1 && testFingerIds.length === 1) && gamePhase === 'waiting') {
        resetGame();
    } else {
        updateInstructionText();
    }
}

// Manual mode functions
function updateModeDisplay() {
    if (settings.manualMode) {
        manualModeInterface.classList.add('active');
        gameArea.style.display = 'none';
        removeAllTestFingers();
        updateManualModeText();
    } else {
        manualModeInterface.classList.remove('active');
        gameArea.style.display = 'flex';
        resultDisplay.classList.remove('active');
    }
    updateTestModeButton();
}

function updateManualModeText() {
    if (!manualSubtitle) return;
    
    const isTeamMode = settings.twoTeams || settings.threeTeams;
    const numTeams = settings.threeTeams ? 3 : 2;
    
    if (isTeamMode) {
        manualSubtitle.textContent = `Enter participant names (will be split into ${numTeams} teams)`;
        randomizeBtn.textContent = `Assign ${numTeams} Teams`;
    } else {
        manualSubtitle.textContent = 'Enter participant names or colors';
        randomizeBtn.textContent = 'Randomize Order';
    }
}

function updateTestModeButton() {
    if (settings.manualMode) {
        testModeBtn.disabled = true;
        testModeBtn.textContent = 'Add Test Finger';
    } else {
        testModeBtn.disabled = false;
        testModeBtn.textContent = 'Add Test Finger';
    }
}

function addParticipant() {
    const name = participantInput.value.trim();
    if (!name) return;
    
    const color = generateRandomColor();
    participants.push({ name, color, id: Date.now() + Math.random() });
    
    participantInput.value = '';
    updateParticipantsList();
    participantInput.focus();
}

function removeParticipant(id) {
    participants = participants.filter(p => p.id !== id);
    updateParticipantsList();
}

function updateParticipantsList() {
    if (participants.length === 0) {
        participantsList.innerHTML = '<p style="text-align: center; color: rgba(255,255,255,0.4); padding: 20px;">No participants added yet</p>';
        randomizeBtn.disabled = true;
        resultDisplay.classList.remove('active');
    } else {
        participantsList.innerHTML = participants.map(p => `
            <div class="participant-item">
                <div class="participant-info">
                    <div class="participant-color" style="background-color: ${p.color};"></div>
                    <span class="participant-name">${escapeHtml(p.name)}</span>
                </div>
                <button class="remove-participant-btn" onclick="removeParticipant(${p.id})">Remove</button>
            </div>
        `).join('');
        randomizeBtn.disabled = participants.length < 2;
    }
}

function randomizeParticipants() {
    if (participants.length < 2) return;
    
    // Check if team mode is active
    const isTeamMode = settings.twoTeams || settings.threeTeams;
    const numTeams = settings.threeTeams ? 3 : 2;
    
    if (isTeamMode) {
        // Team mode: distribute participants into teams
        
        // Generate team colors
        initializeTeamColors(numTeams);
        
        // Shuffle array using Fisher-Yates algorithm with secure random
        const shuffled = [...participants];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(secureRandom() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        
        // Distribute into teams
        const teams = {};
        for (let i = 1; i <= numTeams; i++) {
            teams[i] = [];
        }
        
        shuffled.forEach((participant, index) => {
            const teamNum = (index % numTeams) + 1;
            teams[teamNum].push(participant);
        });
        
        // Display team assignments
        let teamsHtml = '<h3 class="result-title">Team Assignments</h3>';
        
        for (let i = 1; i <= numTeams; i++) {
            const teamColor = i === 1 ? teamColors.team1 : (i === 2 ? teamColors.team2 : teamColors.team3);
            const teamMembers = teams[i];
            
            teamsHtml += `
                <div class="team-group" style="border-left: 4px solid ${teamColor}; margin-bottom: 20px; padding-left: 15px;">
                    <h4 style="color: ${teamColor}; margin: 10px 0;">Team ${i} (${teamMembers.length})</h4>
                    <ul class="result-order">
                        ${teamMembers.map(p => `
                            <li class="result-item">
                                <div class="result-color" style="background-color: ${teamColor};"></div>
                                <span class="result-name">${escapeHtml(p.name)}</span>
                                <span class="result-badge" style="background-color: ${teamColor};">Team ${i}</span>
                            </li>
                        `).join('')}
                    </ul>
                </div>
            `;
        }
        
        resultDisplay.innerHTML = teamsHtml;
        
    } else {
        // Regular mode: shuffle and show order
        
        // Shuffle array using Fisher-Yates algorithm with secure random
        const shuffled = [...participants];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(secureRandom() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        
        // Display results
        resultDisplay.innerHTML = `
            <h3 class="result-title">Random Order</h3>
            <ul class="result-order">
                ${shuffled.map((p, index) => `
                    <li class="result-item ${index === 0 ? 'winner' : ''}">
                        <span class="result-position">${index + 1}</span>
                        <div class="result-color" style="background-color: ${p.color};"></div>
                        <span class="result-name">${escapeHtml(p.name)}</span>
                        ${index === 0 ? '<span class="result-badge">STARTS</span>' : ''}
                    </li>
                `).join('')}
            </ul>
        `;
    }
    
    resultDisplay.classList.add('active');
}

function clearAllParticipants() {
    if (participants.length === 0) return;
    
    if (confirm('Are you sure you want to clear all participants?')) {
        participants = [];
        updateParticipantsList();
        resultDisplay.classList.remove('active');
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Make removeParticipant available globally
window.removeParticipant = removeParticipant;

// Prevent default touch behaviors
document.body.addEventListener('touchstart', (e) => {
    if (e.target.closest('.settings-panel') || e.target.closest('.burger-menu') || e.target.closest('.manual-mode-interface')) {
        return;
    }
    e.preventDefault();
}, { passive: false });

// Configuration and State
let config = {
    wallClock: {
        enabled: false,
        position: 'top-right'
    },
    digitalClock: {
        enabled: false,
        position: 'top'
    },
    location: {
        enabled: false,
        latitude: 50.85,
        longitude: 4.35
    },
    appearance: {
        hideWindowDivider: false,
        enableThermometer: false,
        thermometerCity: 'Brussels',
        fullscreenWindow: false,
        brickWallMode: false,
        brickColor: '#8B4513',
        massiveBookcaseMode: false,
        backgroundColor: '#2C1810',
        natureMode: false
    },
    customItems: []
};

// Load configuration from localStorage
function loadConfig() {
    const saved = localStorage.getItem('windowViewConfig');
    if (saved) {
        const loadedConfig = JSON.parse(saved);
        
        // Merge with defaults to handle missing properties (migration)
        config = {
            wallClock: loadedConfig.wallClock || config.wallClock,
            digitalClock: loadedConfig.digitalClock || config.digitalClock,
            location: loadedConfig.location || config.location,
            appearance: loadedConfig.appearance || config.appearance,
            customItems: loadedConfig.customItems || config.customItems
        };
    }
    applyConfig();
}

// Save configuration to localStorage
function saveConfig() {
    localStorage.setItem('windowViewConfig', JSON.stringify(config));
}

// Apply configuration to the page
function applyConfig() {
    // Wall Clock
    const wallClock = document.getElementById('wallClock');
    if (config.wallClock.enabled) {
        wallClock.style.display = 'block';
        wallClock.className = `wall-clock ${config.wallClock.position}`;
        updateClock();
    } else {
        wallClock.style.display = 'none';
    }

    // Digital Clock
    updateDigitalClock();

    // Sun Time
    if (config.location.enabled) {
        updateSunTime();
    }

    // Appearance Settings
    applyAppearanceSettings();

    // Custom Items
    renderCustomItems();

    // Update settings UI
    updateSettingsUI();
}

// Update settings UI from config
function updateSettingsUI() {
    document.getElementById('enableWallClock').checked = config.wallClock.enabled;
    document.getElementById('wallClockPos').value = config.wallClock.position;
    document.getElementById('enableDigitalClock').checked = config.digitalClock.enabled;
    document.getElementById('digitalClockPos').value = config.digitalClock.position;
    document.getElementById('enableSunTime').checked = config.location.enabled;
    document.getElementById('latitude').value = config.location.latitude;
    document.getElementById('longitude').value = config.location.longitude;
    
    // Appearance settings
    document.getElementById('hideWindowDivider').checked = config.appearance.hideWindowDivider;
    document.getElementById('enableThermometer').checked = config.appearance.enableThermometer;
    document.getElementById('thermometerCity').value = config.appearance.thermometerCity;
    document.getElementById('fullscreenWindow').checked = config.appearance.fullscreenWindow;
    document.getElementById('brickWallMode').checked = config.appearance.brickWallMode;
    document.getElementById('brickColor').value = config.appearance.brickColor;
    document.getElementById('massiveBookcaseMode').checked = config.appearance.massiveBookcaseMode;
    document.getElementById('backgroundColor').value = config.appearance.backgroundColor;
    document.getElementById('natureMode').checked = config.appearance.natureMode;
    
    renderCustomItemsSettings();
}

// Wall Clock Update
function updateClock() {
    const now = new Date();
    const hours = now.getHours() % 12;
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    const hourDeg = (hours * 30) + (minutes * 0.5);
    const minuteDeg = minutes * 6;
    const secondDeg = seconds * 6;

    document.querySelector('.hour-hand').style.transform = `rotate(${hourDeg}deg)`;
    document.querySelector('.minute-hand').style.transform = `rotate(${minuteDeg}deg)`;
    document.querySelector('.second-hand').style.transform = `rotate(${secondDeg}deg)`;
}

// Digital Clock
function updateDigitalClock() {
    // Remove existing digital clock
    document.querySelectorAll('.shelf-item.clock').forEach(el => el.remove());

    if (!config.digitalClock.enabled) return;

    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
    });

    const clockElement = document.createElement('div');
    clockElement.className = 'shelf-item clock';
    clockElement.innerHTML = `<i data-lucide="clock" style="width: 16px; height: 16px; margin-right: 5px;"></i>${timeString}`;

    const position = config.digitalClock.position;
    const container = document.getElementById(`${position}ShelfItems`);
    if (container) {
        container.appendChild(clockElement);
        lucide.createIcons();
    }
}

// Sun Time Calculation
function updateSunTime() {
    const now = new Date();
    const lat = config.location.latitude;
    const lon = config.location.longitude;
    
    // Simple sun position calculation
    const dayOfYear = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
    const hour = now.getHours() + now.getMinutes() / 60;
    
    // Approximate solar noon (simplified)
    const solarNoon = 12 - (lon / 15);
    const hourAngle = (hour - solarNoon) * 15;
    
    // Declination (simplified)
    const declination = 23.45 * Math.sin((360 / 365) * (dayOfYear - 81) * Math.PI / 180);
    
    // Solar elevation angle (simplified)
    const elevation = Math.asin(
        Math.sin(lat * Math.PI / 180) * Math.sin(declination * Math.PI / 180) +
        Math.cos(lat * Math.PI / 180) * Math.cos(declination * Math.PI / 180) * Math.cos(hourAngle * Math.PI / 180)
    ) * 180 / Math.PI;

    // Update sky based on elevation
    const sky = document.getElementById('skyGradient');
    const sun = document.getElementById('sun');
    const moon = document.getElementById('moon');
    const stars = document.getElementById('stars');

    // Remove all sky classes
    sky.classList.remove('night', 'dawn', 'dusk');
    sun.classList.remove('hidden');
    moon.classList.remove('visible');
    stars.classList.remove('visible');

    if (elevation < -6) {
        // Night
        sky.classList.add('night');
        sun.classList.add('hidden');
        moon.classList.add('visible');
        stars.classList.add('visible');
    } else if (elevation < 0) {
        // Dawn/Dusk
        if (hour < 12) {
            sky.classList.add('dawn');
        } else {
            sky.classList.add('dusk');
        }
    } else {
        // Day - position sun based on elevation
        const sunTop = 80 - (elevation * 0.8);
        const sunRight = 20 + (hourAngle * 0.5);
        sun.style.top = `${Math.max(10, Math.min(sunTop, 80))}%`;
        sun.style.right = `${Math.max(10, Math.min(sunRight, 90))}%`;
    }
}

// Apply Appearance Settings
function applyAppearanceSettings() {
    const roomContainer = document.querySelector('.room-container');
    const bookcase = document.querySelector('.bookcase');
    const windowDividers = document.querySelectorAll('.window-divider');
    const thermometer = document.getElementById('thermometer');
    const scene = document.querySelector('.scene');
    const town = document.querySelector('.town');

    // 1. Hide/Show Window Dividers
    windowDividers.forEach(divider => {
        divider.style.display = config.appearance.hideWindowDivider ? 'none' : 'absolute';
    });

    // 2. Thermometer
    if (config.appearance.enableThermometer) {
        thermometer.style.display = 'block';
        fetchTemperature(config.appearance.thermometerCity);
    } else {
        thermometer.style.display = 'none';
    }

    // 3. Fullscreen Window Mode
    if (config.appearance.fullscreenWindow) {
        roomContainer.style.width = '100vw';
        roomContainer.style.height = '100vh';
        roomContainer.style.maxWidth = '100vw';
        roomContainer.style.maxHeight = '100vh';
    } else {
        roomContainer.style.width = '90vw';
        roomContainer.style.height = '90vh';
        roomContainer.style.maxWidth = '1200px';
        roomContainer.style.maxHeight = '800px';
    }

    // 4. Brick Wall Mode
    if (config.appearance.brickWallMode) {
        bookcase.classList.add('brick-wall-mode');
        bookcase.style.setProperty('--brick-color', config.appearance.brickColor);
    } else {
        bookcase.classList.remove('brick-wall-mode');
    }

    // 5. Massive Bookcase Mode
    if (config.appearance.massiveBookcaseMode) {
        roomContainer.style.width = '100vw';
        roomContainer.style.height = '100vh';
        roomContainer.style.maxWidth = '100vw';
        roomContainer.style.maxHeight = '100vh';
    }

    // 6. Background Color
    document.body.style.backgroundColor = config.appearance.backgroundColor;

    // 7. Nature Mode
    if (config.appearance.natureMode) {
        town.style.display = 'none';
        scene.classList.add('nature-mode');
    } else {
        town.style.display = 'block';
        scene.classList.remove('nature-mode');
    }
}

// Fetch Temperature from API
async function fetchTemperature(city) {
    try {
        // Using Open-Meteo API (free, no key required)
        // First get coordinates for the city using geocoding
        const geoResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`);
        const geoData = await geoResponse.json();
        
        if (geoData.results && geoData.results.length > 0) {
            const { latitude, longitude } = geoData.results[0];
            
            // Get weather data
            const weatherResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
            const weatherData = await weatherResponse.json();
            
            if (weatherData.current_weather) {
                const temp = Math.round(weatherData.current_weather.temperature);
                document.getElementById('thermometerReading').textContent = `${temp}°C`;
                
                // Update mercury height (0°C = 50%, each degree = 2%)
                const mercuryHeight = Math.min(100, Math.max(0, 50 + (temp * 2)));
                document.getElementById('thermometerMercury').style.height = `${mercuryHeight}%`;
            }
        }
    } catch (error) {
        console.error('Error fetching temperature:', error);
        document.getElementById('thermometerReading').textContent = '--°C';
    }
}

// Render Custom Items
function renderCustomItems() {
    const positions = ['top', 'bottom', 'leftTop', 'leftMiddle', 'leftBottom', 'rightTop', 'rightMiddle', 'rightBottom'];
    
    positions.forEach(pos => {
        const container = document.getElementById(`${pos}ShelfItems`);
        if (!container) return;
        
        // Remove existing custom items
        container.querySelectorAll('.shelf-item:not(.clock):not(.toolbox-shelf-icon)').forEach(el => el.remove());
    });

    config.customItems.forEach((item, index) => {
        if (!item.position || !item.icon) return;
        
        const container = document.getElementById(`${item.position}ShelfItems`);
        if (!container) return;

        const element = document.createElement('a');
        element.className = 'shelf-item';
        element.href = item.url || '#';
        element.target = item.url ? '_blank' : '_self';
        element.title = item.label || 'Custom Item';
        element.innerHTML = `<i data-lucide="${item.icon}"></i>`;
        
        container.appendChild(element);
    });

    lucide.createIcons();
    
    // Re-add toolbox icon to ensure it's always at the end
    addToolboxIcon();
}

// Render Custom Items in Settings
function renderCustomItemsSettings() {
    const container = document.getElementById('customItemsList');
    container.innerHTML = '';

    config.customItems.forEach((item, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'custom-item';
        itemDiv.innerHTML = `
            <div class="custom-item-header">
                <strong>Item ${index + 1}</strong>
                <div class="item-actions">
                    <button class="move-item-btn" onclick="moveCustomItem(${index}, 'up')" ${index === 0 ? 'disabled' : ''} title="Move Up">
                        <i data-lucide="arrow-up"></i>
                    </button>
                    <button class="move-item-btn" onclick="moveCustomItem(${index}, 'down')" ${index === config.customItems.length - 1 ? 'disabled' : ''} title="Move Down">
                        <i data-lucide="arrow-down"></i>
                    </button>
                    <button class="delete-item-btn" onclick="deleteCustomItem(${index})">
                        <i data-lucide="trash-2"></i>
                        Delete
                    </button>
                </div>
            </div>
            <div class="setting-item">
                <label>Label:</label>
                <input type="text" value="${item.label || ''}" onchange="updateCustomItem(${index}, 'label', this.value)">
            </div>
            <div class="setting-item">
                <label>Icon:</label>
                <div class="icon-selector">
                    <input 
                        type="text" 
                        id="icon-input-${index}"
                        value="${item.icon || ''}" 
                        onchange="updateCustomItem(${index}, 'icon', this.value)"
                        oninput="filterIcons(${index}, this.value)"
                        placeholder="Type to search icons..."
                        autocomplete="off">
                    <div class="icon-preview" id="icon-preview-${index}">
                        ${item.icon ? `<i data-lucide="${item.icon}"></i>` : ''}
                    </div>
                    <div class="icon-dropdown" id="icon-dropdown-${index}"></div>
                </div>
            </div>
            <div class="setting-item">
                <label>URL:</label>
                <input type="text" value="${item.url || ''}" onchange="updateCustomItem(${index}, 'url', this.value)" placeholder="https://example.com">
            </div>
            <div class="setting-item">
                <label>Position:</label>
                <select onchange="updateCustomItem(${index}, 'position', this.value)">
                    <option value="top" ${item.position === 'top' ? 'selected' : ''}>Top Shelf</option>
                    <option value="bottom" ${item.position === 'bottom' ? 'selected' : ''}>Bottom Shelf</option>
                    <option value="leftTop" ${item.position === 'leftTop' ? 'selected' : ''}>Left Top</option>
                    <option value="leftMiddle" ${item.position === 'leftMiddle' ? 'selected' : ''}>Left Middle</option>
                    <option value="leftBottom" ${item.position === 'leftBottom' ? 'selected' : ''}>Left Bottom</option>
                    <option value="rightTop" ${item.position === 'rightTop' ? 'selected' : ''}>Right Top</option>
                    <option value="rightMiddle" ${item.position === 'rightMiddle' ? 'selected' : ''}>Right Middle</option>
                    <option value="rightBottom" ${item.position === 'rightBottom' ? 'selected' : ''}>Right Bottom</option>
                </select>
            </div>
        `;
        container.appendChild(itemDiv);
    });

    lucide.createIcons();
    
    // Initialize icon dropdowns
    config.customItems.forEach((item, index) => {
        if (item.icon) {
            updateIconPreview(index, item.icon);
        }
    });
}

// Filter and display matching icons
function filterIcons(index, searchTerm) {
    const dropdown = document.getElementById(`icon-dropdown-${index}`);
    
    if (!searchTerm) {
        dropdown.style.display = 'none';
        updateIconPreview(index, '');
        return;
    }

    const matches = lucideIcons.filter(icon => 
        icon.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 50); // Limit to 50 results

    if (matches.length === 0) {
        dropdown.innerHTML = '<div class="icon-option no-results">No matching icons</div>';
        dropdown.style.display = 'block';
        updateIconPreview(index, '');
        return;
    }

    dropdown.innerHTML = matches.map(icon => `
        <div class="icon-option" onclick="selectIcon(${index}, '${icon}')">
            <i data-lucide="${icon}"></i>
            <span>${icon}</span>
        </div>
    `).join('');
    
    dropdown.style.display = 'block';
    lucide.createIcons();
    
    // Update preview with first match
    updateIconPreview(index, matches[0]);
}

// Select an icon from dropdown
function selectIcon(index, icon) {
    const input = document.getElementById(`icon-input-${index}`);
    input.value = icon;
    updateCustomItem(index, 'icon', icon);
    updateIconPreview(index, icon);
    
    const dropdown = document.getElementById(`icon-dropdown-${index}`);
    dropdown.style.display = 'none';
}

// Update icon preview
function updateIconPreview(index, icon) {
    const preview = document.getElementById(`icon-preview-${index}`);
    if (!preview) return;
    
    if (icon) {
        preview.innerHTML = `<i data-lucide="${icon}"></i>`;
        lucide.createIcons();
    } else {
        preview.innerHTML = '';
    }
}

// Add toolbox icon to top shelf
function addToolboxIcon() {
    const topShelf = document.getElementById('topShelfItems');
    if (!topShelf) return;

    // Remove existing toolbox if any
    const existingToolbox = document.querySelector('.toolbox-shelf-icon');
    if (existingToolbox) {
        existingToolbox.remove();
    }

    // Create toolbox icon
    const toolboxIcon = document.createElement('div');
    toolboxIcon.className = 'shelf-item toolbox-shelf-icon';
    toolboxIcon.title = 'Settings';
    toolboxIcon.innerHTML = `<i data-lucide="wrench"></i>`;
    toolboxIcon.style.cssText = 'margin-left: auto;';
    
    toolboxIcon.addEventListener('click', () => {
        document.getElementById('settingsPanel').classList.add('open');
    });

    topShelf.appendChild(toolboxIcon);
    lucide.createIcons();
}

// Update Custom Item
function updateCustomItem(index, field, value) {
    if (config.customItems[index]) {
        config.customItems[index][field] = value;
    }
}

// Delete Custom Item
function deleteCustomItem(index) {
    config.customItems.splice(index, 1);
    renderCustomItemsSettings();
    renderCustomItems();
}

// Move Custom Item Up or Down
function moveCustomItem(index, direction) {
    if (direction === 'up' && index > 0) {
        // Swap with previous item
        [config.customItems[index - 1], config.customItems[index]] = 
        [config.customItems[index], config.customItems[index - 1]];
    } else if (direction === 'down' && index < config.customItems.length - 1) {
        // Swap with next item
        [config.customItems[index], config.customItems[index + 1]] = 
        [config.customItems[index + 1], config.customItems[index]];
    }
    
    renderCustomItemsSettings();
    renderCustomItems();
    saveConfig();
}

// Add New Custom Item
function addCustomItem() {
    config.customItems.push({
        label: 'New Item',
        icon: 'link',
        url: '',
        position: 'top'
    });

    // Close icon dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.icon-selector')) {
            document.querySelectorAll('.icon-dropdown').forEach(dropdown => {
                dropdown.style.display = 'none';
            });
        }
    });
    renderCustomItemsSettings();
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide icons
    lucide.createIcons();

    // Load saved configuration
    loadConfig();

    // Add toolbox icon to top shelf
    addToolboxIcon();

    // Close settings button (without saving)
    document.getElementById('closeSettingsBtn').addEventListener('click', () => {
        // Just close without saving - reload from saved config
        loadConfig();
        document.getElementById('settingsPanel').classList.remove('open');
    });

    // Save and close button (header)
    document.getElementById('saveCloseBtn').addEventListener('click', () => {
        // Collect all settings
        config.wallClock.enabled = document.getElementById('enableWallClock').checked;
        config.wallClock.position = document.getElementById('wallClockPos').value;
        config.digitalClock.enabled = document.getElementById('enableDigitalClock').checked;
        config.digitalClock.position = document.getElementById('digitalClockPos').value;
        config.location.enabled = document.getElementById('enableSunTime').checked;
        config.location.latitude = parseFloat(document.getElementById('latitude').value) || 50.85;
        config.location.longitude = parseFloat(document.getElementById('longitude').value) || 4.35;

        // Appearance settings
        config.appearance.hideWindowDivider = document.getElementById('hideWindowDivider').checked;
        config.appearance.enableThermometer = document.getElementById('enableThermometer').checked;
        config.appearance.thermometerCity = document.getElementById('thermometerCity').value || 'Brussels';
        config.appearance.fullscreenWindow = document.getElementById('fullscreenWindow').checked;
        config.appearance.brickWallMode = document.getElementById('brickWallMode').checked;
        config.appearance.brickColor = document.getElementById('brickColor').value;
        config.appearance.massiveBookcaseMode = document.getElementById('massiveBookcaseMode').checked;
        config.appearance.backgroundColor = document.getElementById('backgroundColor').value;
        config.appearance.natureMode = document.getElementById('natureMode').checked;

        // Save and apply
        saveConfig();
        applyConfig();

        // Close panel
        document.getElementById('settingsPanel').classList.remove('open');
    });

    // Cancel button (footer - close without saving)
    document.getElementById('cancelSettingsBtn').addEventListener('click', () => {
        // Just close without saving - reload from saved config
        loadConfig();
        document.getElementById('settingsPanel').classList.remove('open');
    });

    // Add item button
    document.getElementById('addItemBtn').addEventListener('click', addCustomItem);

    // Save settings button
    document.getElementById('saveSettingsBtn').addEventListener('click', () => {
        // Collect all settings
        config.wallClock.enabled = document.getElementById('enableWallClock').checked;
        config.wallClock.position = document.getElementById('wallClockPos').value;
        config.digitalClock.enabled = document.getElementById('enableDigitalClock').checked;
        config.digitalClock.position = document.getElementById('digitalClockPos').value;
        config.location.enabled = document.getElementById('enableSunTime').checked;
        config.location.latitude = parseFloat(document.getElementById('latitude').value) || 50.85;
        config.location.longitude = parseFloat(document.getElementById('longitude').value) || 4.35;

        // Appearance settings
        config.appearance.hideWindowDivider = document.getElementById('hideWindowDivider').checked;
        config.appearance.enableThermometer = document.getElementById('enableThermometer').checked;
        config.appearance.thermometerCity = document.getElementById('thermometerCity').value || 'Brussels';
        config.appearance.fullscreenWindow = document.getElementById('fullscreenWindow').checked;
        config.appearance.brickWallMode = document.getElementById('brickWallMode').checked;
        config.appearance.brickColor = document.getElementById('brickColor').value;
        config.appearance.massiveBookcaseMode = document.getElementById('massiveBookcaseMode').checked;
        config.appearance.backgroundColor = document.getElementById('backgroundColor').value;
        config.appearance.natureMode = document.getElementById('natureMode').checked;

        // Save and apply
        saveConfig();
        applyConfig();

        // Close panel
        document.getElementById('settingsPanel').classList.remove('open');

        // Show feedback
        const btn = document.getElementById('saveSettingsBtn');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i data-lucide="check"></i> Saved!';
        lucide.createIcons();
        
        setTimeout(() => {
            btn.innerHTML = originalText;
            lucide.createIcons();
        }, 2000);
    });

    // Update clocks every second
    setInterval(() => {
        if (config.wallClock.enabled) {
            updateClock();
        }
        if (config.digitalClock.enabled) {
            updateDigitalClock();
        }
    }, 1000);

    // Update sun time every minute
    if (config.location.enabled) {
        setInterval(() => {
            if (config.location.enabled) {
                updateSunTime();
            }
        }, 60000);
    }

    // Update temperature every 10 minutes
    setInterval(() => {
        if (config.appearance.enableThermometer) {
            fetchTemperature(config.appearance.thermometerCity);
        }
    }, 600000);

    // Make thermometer draggable
    const thermometer = document.getElementById('thermometer');
    let isDragging = false;
    let offsetX, offsetY;

    thermometer.addEventListener('mousedown', (e) => {
        isDragging = true;
        offsetX = e.clientX - thermometer.getBoundingClientRect().left;
        offsetY = e.clientY - thermometer.getBoundingClientRect().top;
        thermometer.style.cursor = 'grabbing';
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            const x = e.clientX - offsetX;
            const y = e.clientY - offsetY;
            thermometer.style.left = `${x}px`;
            thermometer.style.top = `${y}px`;
            thermometer.style.right = 'auto';
        }
    });

    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            thermometer.style.cursor = 'move';
        }
    });

    // Close settings when clicking outside
    document.getElementById('settingsPanel').addEventListener('click', (e) => {
        if (e.target.id === 'settingsPanel') {
            document.getElementById('settingsPanel').classList.remove('open');
        }
    });
});

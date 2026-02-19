// Display Settings
function openDisplaySettings() {
    window.open('ms-settings:display', '_blank');
}

// Mouse Settings
function openMouseSettings() {
    window.open('ms-settings:mousetouchpad', '_blank');
}

function openMouseSpeed() {
    window.open('ms-settings:mousetouchpad', '_blank');
}

// Keyboard Settings
function openKeyboardSettings() {
    window.open('ms-settings:regionlanguage', '_blank');
}

// Magnifier
function toggleMagnifier() {
    window.open('ms-settings:easeofaccess-magnifier', '_blank');
    alert('Or just press: Win + Plus (+) to start magnifier!\n\nTo close: Win + Esc');
}

// Narrator
function toggleNarrator() {
    alert('Press: Ctrl + Win + Enter\n\nThis will start the Narrator!\n(Press the same keys again to stop it)');
}

// Fun Websites
function openEmbarrassingWebsite() {
    const sites = [
        'https://corndog.io/',
        'https://heeeeeeeey.com/',
        'https://www.republiquedesmangues.fr/',
        'https://www.staggeringbeauty.com/',
        'https://www.koalastothemax.com/',
        'https://pointerpointer.com/'
    ];
    
    // Open 3-5 random tabs
    const numTabs = Math.floor(Math.random() * 3) + 3;
    for (let i = 0; i < numTabs; i++) {
        const randomSite = sites[Math.floor(Math.random() * sites.length)];
        window.open(randomSite, '_blank');
    }
}

// Desktop Icons
function openDesktopSettings() {
    alert('Right-click on the desktop\n→ View\n→ Uncheck "Show desktop icons"');
}

// AutoCorrect Tips
function showAutocorrectTips() {
    const tips = document.getElementById('autocorrect-tips');
    tips.style.display = tips.style.display === 'none' ? 'block' : 'none';
}

// Surprise Music
function playSurpriseMusic() {
    const songs = [
        'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // Never Gonna Give You Up
        'https://www.youtube.com/watch?v=y6120QOlsfU', // Darude - Sandstorm
        'https://www.youtube.com/watch?v=ZZ5LpwO-An4', // HEYYEYAAEYAAAEYAEYAA
        'https://www.youtube.com/watch?v=kfVsfOSbJY0', // Rebecca Black - Friday
        'https://www.youtube.com/watch?v=9bZkp7q19f0'  // Gangnam Style
    ];
    
    const randomSong = songs[Math.floor(Math.random() * songs.length)];
    window.open(randomSong, '_blank');
}

// Snipping Tool
function openSnippingTool() {
    alert('Press: Win + Shift + S\n\nThis opens the Snipping Tool!\n\nFor the Fake Desktop prank:\n1. Take fullscreen screenshot\n2. Save it\n3. Right-click the image → Set as desktop background\n4. Hide desktop icons (see Icon Hide & Seek)');
}

// Taskbar Settings
function openTaskbarSettings() {
    window.open('ms-settings:taskbar', '_blank');
}

// Copy Code Function
function copyCode(button, elementId) {
    const codeElement = document.getElementById(elementId);
    const textToCopy = codeElement.textContent;
    
    navigator.clipboard.writeText(textToCopy).then(() => {
        const originalText = button.textContent;
        button.textContent = 'Copied!';
        button.classList.add('copied');
        
        setTimeout(() => {
            button.textContent = originalText;
            button.classList.remove('copied');
        }, 2000);
    }).catch(err => {
        alert('Failed to copy. Please copy manually:\n\n' + textToCopy);
    });
}

// High Contrast Mode
function toggleHighContrast() {
    alert('Press: Left Alt + Left Shift + Print Screen\n\nThen click "Yes" in the dialog!\n\nThis enables High Contrast mode instantly!');
}

// Calculator Spam
function calculatorSpam() {
    const numCalcs = 20;
    for (let i = 0; i < numCalcs; i++) {
        setTimeout(() => {
            window.open('calculator:', '_blank');
        }, i * 100);
    }
    alert(`Opening ${numCalcs} calculators! 🔢`);
}

// Notepad Spam
function notepadSpam() {
    const messages = [
        'LOCK YOUR PC!',
        'Remember: Win + L',
        'Security is important!',
        'This could have been worse...',
        'Don\'t forget to lock next time! 😊',
        'Unlocked = Pranked',
        'Your friendly IT reminder',
        'Lock it or lose it!'
    ];
    
    for (let i = 0; i < 8; i++) {
        setTimeout(() => {
            const newWindow = window.open('', '_blank');
            if (newWindow) {
                newWindow.document.write(`
                    <!DOCTYPE html>
                    <html>
                    <head><title>Reminder #${i + 1}</title></head>
                    <body style="font-family: Arial; font-size: 48px; text-align: center; padding-top: 100px; background: #${Math.floor(Math.random()*16777215).toString(16)};">
                        <h1>${messages[i]}</h1>
                    </body>
                    </html>
                `);
            }
        }, i * 200);
    }
}

// Accessibility Settings
function openAccessibilitySettings() {
    window.open('ms-settings:easeofaccess-keyboard', '_blank');
}

// Show Shutdown Code
function showShutdownCode() {
    const code = document.getElementById('shutdown-code');
    code.style.display = code.style.display === 'none' ? 'block' : 'none';
}

// Show Homepage Tips
function showHomepageTips() {
    const tips = document.getElementById('homepage-tips');
    tips.style.display = tips.style.display === 'none' ? 'block' : 'none';
}

// Screen Saver Settings
function openScreenSaver() {
    alert('Opening screen saver settings...\n\nNote: Windows 11 has limited screen saver options.\nUse the CMD code for instant configuration!');
    window.open('control desk.cpl,,@screensaver', '_blank');
}

// Sound Settings
function openSoundSettings() {
    window.open('ms-settings:sound', '_blank');
}

// Emoji Message
function emojiMessage() {
    const newWindow = window.open('', '_blank', 'width=600,height=400');
    if (newWindow) {
        newWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>🔒 Important Security Message 🔒</title>
                <style>
                    body {
                        font-family: 'Segoe UI', Arial, sans-serif;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        text-align: center;
                        padding: 50px;
                        margin: 0;
                    }
                    h1 { font-size: 3em; margin: 20px 0; }
                    p { font-size: 1.5em; line-height: 1.6; }
                    .emoji { font-size: 5em; }
                </style>
            </head>
            <body>
                <div class="emoji">🔓</div>
                <h1>YOU FORGOT TO LOCK YOUR PC!</h1>
                <p>This is a friendly reminder from your colleague 😊</p>
                <p>Next time, use <strong>Win + L</strong></p>
                <div class="emoji">😂</div>
                <p style="font-size: 1em; margin-top: 50px;">
                    P.S. - No harm done! Just lock it next time! 
                </p>
            </body>
            </html>
        `);
    }
}

// Night Light Settings
function openNightLight() {
    window.open('ms-settings:nightlight', '_blank');
}

// Show Caps Lock Tip
function showCapsLockTip() {
    const tip = document.getElementById('capslock-tip');
    tip.style.display = tip.style.display === 'none' ? 'block' : 'none';
}

// Easter egg - Konami code
let konamiCode = [];
const konamiPattern = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', function(e) {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);
    
    if (konamiCode.join(',') === konamiPattern.join(',')) {
        document.body.style.transform = 'rotate(180deg)';
        setTimeout(() => {
            document.body.style.transform = '';
            alert('😄 You found the easter egg! But... did you just prank yourself?');
        }, 2000);
    }
});

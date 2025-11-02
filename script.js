// Service Desk Portal JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the page
    initializePage();
    
    // Add hover effects for better UX
    addEnhancedHoverEffects();

    // Add ESC key handler to focus first object
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' || e.key === 'Esc') {
            focusFirstObject();
        }
    });
});

function focusFirstObject() {
    // Try terminal-link, then service-link, then lang-btn
    const selectors = ['.terminal-link', '.service-link', '.lang-btn'];
    for (const sel of selectors) {
        const el = document.querySelector(sel);
        if (el) {
            el.focus();
            return;
        }
    }
}

function initializePage() {
    // Check for saved language preference
    const savedLanguage = localStorage.getItem('preferredLanguage') || 'nl';
    setLanguage(savedLanguage);
    
    // Add smooth scrolling for better navigation
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Initialize tooltips if needed
    //initializeTooltips();
}

function setLanguage(lang) {
    // Validate language selection
    const validLanguages = ['en', 'fr', 'nl'];
    if (!validLanguages.includes(lang)) {
        lang = 'nl'; // Default fallback
    }
    
    // Set the language attribute on body
    document.body.setAttribute('data-lang', lang);
    
    // Update active language button
    const langButtons = document.querySelectorAll('.lang-btn');
    langButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-lang') === lang) {
            btn.classList.add('active');
        }
    });
    
    // Show/hide language-specific content
    const langElements = document.querySelectorAll('.lang');
    langElements.forEach(element => {
        element.classList.remove('active');
        if (element.classList.contains(lang)) {
            element.classList.add('active');
        }
    });
    
    // Save language preference
    localStorage.setItem('preferredLanguage', lang);
    
    // Announce language change for accessibility
    announceLanguageChange(lang);
}

function announceLanguageChange(lang) {
    const announcements = {
        'en': 'Language changed to English',
        'fr': 'Langue changée en Français',
        'nl': 'Taal gewijzigd naar Nederlands'
    };
    
    // Temp bericht wanneer je taal wijzigt staat nu verstopt
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.textContent = announcements[lang];
    announcement.style.position = 'absolute';
    announcement.style.left = '-9999px';
    announcement.style.width = '1px';
    announcement.style.height = '1px';
    announcement.style.overflow = 'hidden';
    
    document.body.appendChild(announcement);
    
    // Remove after announcement
    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1500);
}

function addEnhancedHoverEffects() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        let hoverTimeout;
        
        card.addEventListener('mouseenter', function() {
            clearTimeout(hoverTimeout);
            this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        });
        
        card.addEventListener('mouseleave', function() {
            hoverTimeout = setTimeout(() => {
                this.style.transition = 'all 0.3s ease';
            }, 100);
        });
        
        // Add ripple effect on click
        card.addEventListener('click', function(e) {
            if (!e.target.closest('.service-link')) {
                addRippleEffect(this, e);
            }
        });
    });
}

function addRippleEffect(element, event) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');
    
    // Add ripple styles dynamically
    const style = document.createElement('style');
    style.textContent = `
        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(0, 102, 204, 0.3);
            transform: scale(0);
            animation: ripple-animation 0.6s linear;
            pointer-events: none;
        }
        
        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    
    if (!document.querySelector('style[data-ripple]')) {
        style.setAttribute('data-ripple', 'true');
        document.head.appendChild(style);
    }
    
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

function initializeTooltips() {
    // tooltips: indien we extra uitleg willen toevoegen aan de service cards, misschien onhover?
    // wordt nu niet opgeroepen
    const tooltipTexts = {
        'Microsoft Password Reset': {
            'en': 'Quickly reset your Microsoft account password if you\'ve forgotten it',
            'fr': 'Réinitialisez rapidement votre mot de passe Microsoft si vous l\'avez oublié',
            'nl': 'Reset snel uw Microsoft account wachtwoord als u het bent vergeten'
        },
        'Office 365': {
            'en': 'Access your email, Word, Excel, PowerPoint and other Office applications',
            'fr': 'Accédez à votre email, Word, Excel, PowerPoint et autres applications Office',
            'nl': 'Toegang tot uw email, Word, Excel, PowerPoint en andere Office applicaties'
        },
        'Windows Update': {
            'en': 'Keep your system secure with the latest Windows updates',
            'fr': 'Gardez votre système sécurisé avec les dernières mises à jour Windows',
            'nl': 'Houd uw systeem veilig met de laatste Windows updates'
        },
        'Remote Desktop': {
            'en': 'Connect to your work computer from anywhere',
            'fr': 'Connectez-vous à votre ordinateur de bureau depuis n\'importe où',
            'nl': 'Verbind met uw werk computer vanaf elke locatie'
        },
        'IT Support': {
            'en': 'Get help from our IT support team for technical issues',
            'fr': 'Obtenez de l\'aide de notre équipe de support IT pour les problèmes techniques',
            'nl': 'Krijg hulp van ons IT support team voor technische problemen'
        },
        'System Information': {
            'en': 'View detailed information about your computer system',
            'fr': 'Affichez des informations détaillées sur votre système informatique',
            'nl': 'Bekijk gedetailleerde informatie over uw computersysteem'
        }
    };
    
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        const serviceName = card.querySelector('h3').textContent;
        const tooltipData = tooltipTexts[serviceName];
        
        if (tooltipData) {
            card.setAttribute('data-tooltip-en', tooltipData.en);
            card.setAttribute('data-tooltip-fr', tooltipData.fr);
            card.setAttribute('data-tooltip-nl', tooltipData.nl);
            
            // You can add actual tooltip implementation here if desired
        }
    });
}

// Console log wanneer venster wordt geresized
let resizeTimeout;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function() {
        // Recalculate any dynamic layouts if needed
        console.log('Window resized, adjusting layout...');
    }, 250);
});

// Service worker registration for offline functionality (optional) Todo, zien als dit nodig is?
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // Uncomment to enable service worker
        // navigator.serviceWorker.register('/sw.js')
        //     .then(function(registration) {
        //         console.log('ServiceWorker registration successful');
        //     })
        //     .catch(function(error) {
        //         console.log('ServiceWorker registration failed');
        //     });
    });
}

// function showAlert(messageEn, messageFr, messageNl) {
//     const alertContainer = document.getElementById('alertContainer');
//     const alertMessage = document.getElementById('alertMessage');
    
//     // Update bericht
//     alertMessage.innerHTML = `
//         <span class="lang en">${messageEn}</span>
//         <span class="lang fr">${messageFr}</span>
//         <span class="lang nl">${messageNl}</span>
//     `;
    
//     // Toon alert
//     alertContainer.style.display = 'block';
    
//     // // Herlaad taal instellingen
//     // const currentLang = localStorage.getItem('language') || 'en';
//     // setLanguage(currentLang);
// }

// function closeAlert() {
//     document.getElementById('alertContainer').style.display = 'none';
// }

// // Voorbeeld gebruik - roep aan wanneer nodig:
// showAlert(
//     "Microsoft is experiencing issues today. Email delivery may be delayed.",
//     "Microsoft connaît des problèmes aujourd'hui. La livraison d'e-mails peut être retardée.",
//     "Microsoft ondervindt vandaag problemen. E-mailbezorging kan vertraagd zijn."
// );
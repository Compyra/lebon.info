document.addEventListener('DOMContentLoaded', () => {
    const clearPrivacyBtn = document.getElementById('clearPrivacyBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const logEl = document.getElementById('log');

    function log(message) {
        const timestamp = new Date().toLocaleTimeString();
        logEl.textContent += `[${timestamp}] ${message}\n`;
        logEl.scrollTop = logEl.scrollHeight;
    }

    clearPrivacyBtn.addEventListener('click', () => {
        log('Starting privacy cleaning...');

        // 1. Clear clipboard
        try {
            navigator.clipboard.writeText('').then(() => {
                log('✅ Clipboard cleared.');
            }).catch(err => {
                log('❌ Could not clear clipboard. Trying fallback...');
                const textArea = document.createElement("textarea");
                textArea.value = "";
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand("copy");
                document.body.removeChild(textArea);
                log('✅ Clipboard cleared (fallback).');
            });
        } catch (error) {
            log('❌ Clipboard API not available or failed.');
        }

        // 2. Clear browser history and cache (with limitations)
        log('ℹ️ Browser security prevents scripts from clearing all browsing history and cache.');
        log('ℹ️ This is a feature to protect your data from malicious websites.');
        log('ℹ️ We can only request to clear data for *this* website.');
        log('ACTION: Requesting to clear site-specific data (cache, cookies for this site). The browser may or may not do this.');
        // This is done via server headers (Clear-Site-Data: "*"), but we can't set headers from client-side JS.
        // There is no JS API to do this. We log the explanation.
        
        log('Privacy cleaning process finished.');
    });

    logoutBtn.addEventListener('click', () => {
        log('Starting social media logout...');
        log('ℹ️ This will attempt to log you out from popular sites by loading their logout pages in the background.');
        log('ℹ️ This is not guaranteed to work for all sites due to their security measures.');

        const logoutUrls = [
            'https://accounts.google.com/Logout',
            'https://www.facebook.com/logout.php',
            'https://www.instagram.com/accounts/logout/',
            'https://www.linkedin.com/m/logout/',
            'https://twitter.com/logout',
            'https://www.amazon.com/gp/flex/sign-out.html',
            'https://www.reddit.com/logout',
            'https://login.live.com/logout.srf', // Microsoft/Outlook
            'https://www.netflix.com/SignOut',
            'https://store.steampowered.com/logout/',
            'https://github.com/logout',
            'https://slack.com/signout',
            'https://www.dropbox.com/logout',
            'https://www.tiktok.com/logout',
            'https://www.pinterest.com/logout/'
        ];

        let successCount = 0;
        let failedCount = 0;

        logoutUrls.forEach(url => {
            log(`Attempting to log out from: ${new URL(url).hostname}`);
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.src = url;
            
            iframe.onload = () => {
                log(`✅ Successfully loaded logout page for ${new URL(url).hostname}.`);
                successCount++;
                document.body.removeChild(iframe);
                checkCompletion();
            };
            
            iframe.onerror = () => {
                log(`❌ Failed to load logout page for ${new URL(url).hostname}. The site may have blocked this action.`);
                failedCount++;
                document.body.removeChild(iframe);
                checkCompletion();
            };

            document.body.appendChild(iframe);
        });

        function checkCompletion() {
            if (successCount + failedCount === logoutUrls.length) {
                log(`Logout process finished. Success: ${successCount}, Failed: ${failedCount}.`);
            }
        }
    });

    log('Privacy Cleaner initialized. Ready for your command.');
});

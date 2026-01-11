// WebCheck - Website Audit Tool
// This tool checks if important files and configurations exist on websites

document.addEventListener('DOMContentLoaded', function() {
    const websiteInput = document.getElementById('websiteInput');
    const checkButton = document.getElementById('checkButton');
    const resultsContainer = document.getElementById('resultsContainer');
    const results = document.getElementById('results');

    checkButton.addEventListener('click', runAudit);
    websiteInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            runAudit();
        }
    });

    async function runAudit() {
        const input = websiteInput.value.trim();
        if (!input) {
            alert('Please enter at least one website');
            return;
        }

        // Parse multiple websites (comma-separated)
        const websites = input.split(',').map(w => w.trim()).filter(w => w);
        
        // Clear previous results
        results.innerHTML = '';
        resultsContainer.style.display = 'block';

        // Process each website
        for (const website of websites) {
            await checkWebsite(website);
        }
    }

    async function checkWebsite(website) {
        // Normalize URL
        let url = website;
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'https://' + url;
        }

        const domain = new URL(url).hostname;
        
        // Create result container for this website
        const websiteResult = document.createElement('div');
        websiteResult.className = 'website-result';
        websiteResult.innerHTML = `
            <div class="website-header">
                <span class="website-name">${domain}</span>
                <span class="website-url">${url}</span>
            </div>
            <div class="checks-container" id="checks-${domain.replace(/\./g, '-')}">
                <div class="loading">Running audit...</div>
            </div>
        `;
        results.appendChild(websiteResult);

        const checksContainer = document.getElementById(`checks-${domain.replace(/\./g, '-')}`);
        checksContainer.innerHTML = '';

        // Define all checks
        const checks = [
            { name: 'HTTPS/SSL', test: () => checkHTTPS(url, domain) },
            { name: 'robots.txt', test: () => checkFile(url, '/robots.txt') },
            { name: 'sitemap.xml', test: () => checkFile(url, '/sitemap.xml') },
            { name: 'security.txt', test: () => checkSecurityTxt(url) },
            { name: 'favicon.ico', test: () => checkFavicon(url) },
            { name: '404 Page', test: () => check404Page(url) },
            { name: 'site.webmanifest', test: () => checkFile(url, '/site.webmanifest') },
            { name: 'humans.txt', test: () => checkFile(url, '/humans.txt') },
            { name: 'Meta Tags', test: () => checkMetaTags(url) }
        ];

        // Run all checks
        for (const check of checks) {
            const result = await check.test();
            const checkDiv = createCheckResult(check.name, result);
            checksContainer.appendChild(checkDiv);
        }
    }

    function createCheckResult(name, result) {
        const div = document.createElement('div');
        div.className = 'check-result';
        
        let statusIcon, statusClass;
        if (result.passed === true) {
            statusIcon = '✓';
            statusClass = 'status-pass';
        } else if (result.passed === false) {
            statusIcon = '✗';
            statusClass = 'status-fail';
        } else {
            statusIcon = '?';
            statusClass = 'status-warning';
        }
        
        let details = '';
        if (result.details) {
            details = `<div class="check-details">${result.details}</div>`;
        }
        
        let link = '';
        if (result.link) {
            link = `<a href="${result.link}" target="_blank" class="check-link" title="Visit ${result.link}">🔗 Visit</a>`;
        }
        
        div.innerHTML = `
            <div class="check-row">
                <span class="check-status ${statusClass}">${statusIcon}</span>
                <span class="check-name">${name}</span>
                ${link}
            </div>
            ${details}
        `;
        
        return div;
    }

    // Check functions
    function checkHTTPS(url, domain) {
        return new Promise((resolve) => {
            resolve({
                passed: null,
                details: 'Please verify HTTPS/SSL manually by visiting the site',
                link: url
            });
        });
    }

    async function checkFile(baseUrl, filepath) {
        const fullUrl = baseUrl + filepath;
        
        try {
            // Using a CORS proxy to check files (Note: This is a limitation of browser-based checks)
            // In production, you'd want a backend API to do these checks
            const response = await fetch(fullUrl, { 
                method: 'HEAD',
                mode: 'no-cors' // This will always succeed but we can't read the response
            });
            
            // Due to CORS and no-cors mode limitations, we can't actually verify
            // We'll attempt a different approach - try to fetch with a timeout
            const result = await checkFileWithTimeout(fullUrl, filepath);
            result.link = fullUrl;
            return result;
            
        } catch (error) {
            return {
                passed: false,
                details: `${filepath} not found or not accessible`,
                link: fullUrl
            };
        }
    }

    async function checkFileWithTimeout(url, filepath) {
        // Create an image element to test if resource exists
        // This works for some files due to browser behavior
        return new Promise((resolve) => {
            const timeout = setTimeout(() => {
                resolve({
                    passed: null,
                    details: `${filepath} - Unable to verify (CORS restriction)`
                });
            }, 3000);

            // Try different methods based on file type
            if (filepath.endsWith('.ico') || filepath.endsWith('.png')) {
                const img = new Image();
                img.onload = () => {
                    clearTimeout(timeout);
                    resolve({ passed: true, details: `${filepath} found ✓` });
                };
                img.onerror = () => {
                    clearTimeout(timeout);
                    resolve({ passed: false, details: `${filepath} not found` });
                };
                img.src = url;
            } else {
                // For text files, we can't easily check without CORS
                // In a real implementation, you'd use a backend proxy
                fetch(url)
                    .then(response => {
                        clearTimeout(timeout);
                        if (response.ok) {
                            resolve({ passed: true, details: `${filepath} found ✓` });
                        } else if (response.status === 404) {
                            resolve({ passed: false, details: `${filepath} not found (404)` });
                        } else {
                            resolve({ passed: false, details: `${filepath} returned ${response.status}` });
                        }
                    })
                    .catch(() => {
                        clearTimeout(timeout);
                        resolve({
                            passed: null,
                            details: `${filepath} - Unable to verify (CORS restriction)`
                        });
                    });
            }
        });
    }

    async function check404Page(baseUrl) {
        const testUrl = baseUrl + '/this-page-definitely-does-not-exist-' + Date.now();
        
        try {
            const response = await fetch(testUrl);
            
            if (response.status === 404) {
                // Check if there's custom content
                const text = await response.text();
                const hasCustom404 = text.length > 500; // Assume custom if more than 500 chars
                
                return {
                    passed: true,
                    details: hasCustom404 ? 
                        'Custom 404 page detected ✓' : 
                        '404 status returned (may be default page)',
                    link: testUrl
                };
            } else {
                return {
                    passed: false,
                    details: `Non-existent page returns ${response.status} (should be 404)`,
                    link: testUrl
                };
            }
        } catch (error) {
            return {
                passed: null,
                details: 'Unable to verify 404 page (CORS restriction)',
                link: testUrl
            };
        }
    }

    async function checkSecurityTxt(baseUrl) {
        // Check both common security.txt locations
        const locations = ['/.well-known/security.txt', '/security.txt'];
        const results = [];
        
        for (const location of locations) {
            const result = await checkFileWithTimeout(baseUrl + location, location);
            results.push({ location, result });
        }
        
        // Check if any location passed
        const anyPassed = results.some(r => r.result.passed === true);
        const allFailed = results.every(r => r.result.passed === false);
        
        if (anyPassed) {
            const foundLocations = results
                .filter(r => r.result.passed === true)
                .map(r => r.location)
                .join(', ');
            const foundUrl = baseUrl + results.find(r => r.result.passed === true).location;
            return {
                passed: true,
                details: `security.txt found at: ${foundLocations}`,
                link: foundUrl
            };
        } else if (allFailed) {
            return {
                passed: false,
                details: 'security.txt not found at /.well-known/security.txt or /security.txt',
                link: baseUrl + '/.well-known/security.txt'
            };
        } else {
            return {
                passed: null,
                details: 'Unable to verify security.txt (CORS restriction)',
                link: baseUrl + '/.well-known/security.txt'
            };
        }
    }

    async function checkFavicon(baseUrl) {
        // Check both common favicon locations
        const locations = ['/favicon.ico', '/favicons/favicon.ico'];
        const results = [];
        
        for (const location of locations) {
            const result = await checkFileWithTimeout(baseUrl + location, location);
            results.push({ location, result });
        }
        
        // Check if any location passed
        const anyPassed = results.some(r => r.result.passed === true);
        const allFailed = results.every(r => r.result.passed === false);
        
        if (anyPassed) {
            const foundLocations = results
                .filter(r => r.result.passed === true)
                .map(r => r.location)
                .join(', ');
            const foundUrl = baseUrl + results.find(r => r.result.passed === true).location;
            return {
                passed: true,
                details: `Favicon found at: ${foundLocations}`,
                link: foundUrl
            };
        } else if (allFailed) {
            return {
                passed: false,
                details: 'Favicon not found at /favicon.ico or /favicons/favicon.ico (Note: favicon can also be defined in HTML <link> tag)',
                link: baseUrl + '/favicon.ico'
            };
        } else {
            return {
                passed: null,
                details: 'Unable to verify favicon (CORS restriction) - Note: favicon can be defined in HTML <link> tag',
                link: baseUrl + '/favicon.ico'
            };
        }
    }

    async function checkMetaTags(baseUrl) {
        try {
            // Note: Due to CORS, we can't actually fetch and parse the HTML
            // This is a limitation of client-side checking
            // In production, use a backend service
            
            // Extract just the domain from the URL for the link
            const urlObj = new URL(baseUrl);
            const domain = urlObj.hostname;
            
            return {
                passed: null,
                details: 'Meta tags check requires backend service (CORS limitation)',
                link: `meta.html?url=${encodeURIComponent(domain)}`
            };
        } catch (error) {
            return {
                passed: null,
                details: 'Unable to check meta tags (CORS restriction)',
                link: `meta.html?url=${encodeURIComponent(baseUrl)}`
            };
        }
    }
});

// Note for production:
// Due to browser CORS restrictions, many of these checks will be limited
// For a full-featured version, implement a backend API that:
// 1. Fetches the website HTML and files server-side
// 2. Parses meta tags, headers, etc.
// 3. Returns comprehensive results to the frontend
// 4. Could use libraries like Puppeteer for full page analysis

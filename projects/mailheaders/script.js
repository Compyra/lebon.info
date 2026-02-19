// DOM Elements
const pasteBtn = document.getElementById('pasteBtn');
const toggleTextbox = document.getElementById('toggleTextbox');
const textboxContainer = document.getElementById('textboxContainer');
const headersInput = document.getElementById('headersInput');
const analyzeBtn = document.getElementById('analyzeBtn');
const results = document.getElementById('results');
const emptyState = document.getElementById('emptyState');
const securityChecks = document.getElementById('securityChecks');
const senderInfo = document.getElementById('senderInfo');
const relayTimeline = document.getElementById('relayTimeline');
const allHeaders = document.getElementById('allHeaders');
const themeToggle = document.getElementById('themeToggle');

// Theme Management
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
    }
}

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    const currentTheme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
    localStorage.setItem('theme', currentTheme);
});

// Initialize theme on page load
initTheme();

// Toggle textbox visibility
toggleTextbox.addEventListener('click', () => {
    textboxContainer.classList.toggle('hidden');
    textboxContainer.classList.toggle('visible');
    toggleTextbox.classList.toggle('active');
});

// Paste from clipboard when button clicked
pasteBtn.addEventListener('click', async () => {
    try {
        const text = await navigator.clipboard.readText();
        analyzeHeaders(text);
    } catch (err) {
        alert('Failed to read clipboard. Please use Ctrl+V or paste manually.');
    }
});

// Analyze button click
analyzeBtn.addEventListener('click', () => {
    const text = headersInput.value;
    if (text.trim()) {
        analyzeHeaders(text);
    }
});

// Global Ctrl+V listener
document.addEventListener('keydown', async (e) => {
    if (e.ctrlKey && e.key === 'v' && document.activeElement !== headersInput) {
        e.preventDefault();
        try {
            const text = await navigator.clipboard.readText();
            analyzeHeaders(text);
        } catch (err) {
            console.error('Clipboard read failed:', err);
        }
    }
});

// Parse email headers
function parseHeaders(headerText) {
    const headers = {};
    const lines = headerText.split('\n');
    let currentHeader = '';
    let currentValue = '';

    for (let line of lines) {
        // Check if line starts a new header (has a colon and doesn't start with whitespace)
        if (line.match(/^[\w-]+:/) && !line.startsWith(' ') && !line.startsWith('\t')) {
            // Save previous header
            if (currentHeader) {
                if (!headers[currentHeader]) {
                    headers[currentHeader] = [];
                }
                headers[currentHeader].push(currentValue.trim());
            }
            
            // Start new header
            const colonIndex = line.indexOf(':');
            currentHeader = line.substring(0, colonIndex).trim();
            currentValue = line.substring(colonIndex + 1).trim();
        } else {
            // Continuation of previous header
            currentValue += ' ' + line.trim();
        }
    }
    
    // Save last header
    if (currentHeader) {
        if (!headers[currentHeader]) {
            headers[currentHeader] = [];
        }
        headers[currentHeader].push(currentValue.trim());
    }

    return headers;
}

// Extract domain from email address
function extractDomain(email) {
    const match = email.match(/@([^\s>]+)/);
    return match ? match[1].toLowerCase() : '';
}

// Analyze headers
function analyzeHeaders(headerText) {
    if (!headerText.trim()) return;

    const headers = parseHeaders(headerText);
    
    // Hide empty state, show results
    emptyState.classList.add('hidden');
    results.classList.remove('hidden');

    // Analyze security
    displaySecurityChecks(headers);
    
    // Display sender info
    displaySenderInfo(headers);
    
    // Display relay timeline
    displayRelayTimeline(headers);
    
    // Display all headers
    displayAllHeaders(headers);
}

// Display security checks
function displaySecurityChecks(headers) {
    securityChecks.innerHTML = '';

    const checks = [];
    const authResults = getHeader(headers, 'Authentication-Results');
    const from = getHeader(headers, 'From');
    const fromDomain = from ? extractDomain(from) : '';

    // Parse Authentication-Results
    const authData = parseAuthenticationResults(authResults);

    // SPF Authentication Check
    let spfAuthStatus = 'neutral';
    let spfAuthValue = 'Not found';
    if (authData.spf.result) {
        if (authData.spf.result === 'pass') {
            spfAuthStatus = 'pass';
            spfAuthValue = 'Pass ✓';
        } else if (authData.spf.result === 'fail') {
            spfAuthStatus = 'fail';
            spfAuthValue = 'Failed ✗';
        } else if (authData.spf.result === 'softfail') {
            spfAuthStatus = 'warning';
            spfAuthValue = 'Soft Fail ~';
        } else {
            spfAuthStatus = 'warning';
            spfAuthValue = authData.spf.result;
        }
    }
    checks.push({ label: 'SPF Authentication', value: spfAuthValue, status: spfAuthStatus });

    // SPF Alignment Check
    let spfAlignStatus = 'neutral';
    let spfAlignValue = 'Unknown';
    
    // Get Return-Path and check SPF alignment
    const returnPath = getHeader(headers, 'Return-Path');
    const returnDomain = returnPath ? extractDomain(returnPath) : null;
    const spfAuthDomain = authData.spf.domain || returnDomain;
    
    if (spfAuthDomain && fromDomain) {
        // Compare domains - SPF alignment requires the authenticated domain to match From domain
        const spfDomainLower = spfAuthDomain.toLowerCase();
        const fromDomainLower = fromDomain.toLowerCase();
        
        // Check exact match or organizational domain match
        if (spfDomainLower === fromDomainLower) {
            spfAlignStatus = 'pass';
            spfAlignValue = 'Aligned ✓';
        } else if (spfDomainLower.endsWith('.' + fromDomainLower) || fromDomainLower.endsWith('.' + spfDomainLower)) {
            // Subdomain alignment (relaxed mode)
            spfAlignStatus = 'warning';
            spfAlignValue = `Relaxed Alignment ⚠ (${spfAuthDomain})`;
        } else {
            spfAlignStatus = 'fail';
            spfAlignValue = `Domain Mismatch ✗ (auth: ${spfAuthDomain}, from: ${fromDomain})`;
        }
    } else if (authData.spf.result === 'pass' && !spfAuthDomain) {
        spfAlignStatus = 'warning';
        spfAlignValue = 'Cannot determine domain';
    } else if (!fromDomain) {
        spfAlignStatus = 'neutral';
        spfAlignValue = 'No From domain';
    }
    
    checks.push({ label: 'SPF Alignment', value: spfAlignValue, status: spfAlignStatus });

    // DKIM Authentication Check - check for aligned signature
    let dkimAuthStatus = 'neutral';
    let dkimAuthValue = 'Not found';
    let alignedDkimSignature = null;
    
    // Check for composite authentication failures early
    const compauthFailedEarly = authData.compauth && authData.compauth.result === 'fail';
    const dmarcFailedEarly = authData.dmarc && (authData.dmarc.result === 'fail' || authData.dmarc.result === 'none');
    
    if (authData.dkim.signatures.length > 0) {
        // Find signature that matches From domain
        alignedDkimSignature = authData.dkim.signatures.find(sig => 
            sig.domain.toLowerCase() === fromDomain.toLowerCase() ||
            fromDomain.toLowerCase().endsWith('.' + sig.domain.toLowerCase()) ||
            sig.domain.toLowerCase().endsWith('.' + fromDomain.toLowerCase())
        );
        
        authData.dkim.alignedSignature = alignedDkimSignature;
        
        if (alignedDkimSignature) {
            // Found aligned signature - check its result and composite auth
            if (alignedDkimSignature.result === 'pass') {
                // Check if composite authentication failed
                if (compauthFailedEarly || dmarcFailedEarly) {
                    dkimAuthStatus = 'fail';
                    let reasons = [];
                    if (compauthFailedEarly && authData.compauth.reason) {
                        reasons.push(`compauth fail (${authData.compauth.reason})`);
                    } else if (compauthFailedEarly) {
                        reasons.push('compauth fail');
                    }
                    if (dmarcFailedEarly) {
                        reasons.push(`dmarc ${authData.dmarc.result}`);
                    }
                    dkimAuthValue = `Failed ✗ (${alignedDkimSignature.domain}: ${reasons.join(', ')})`;
                } else {
                    dkimAuthStatus = 'pass';
                    dkimAuthValue = `Pass ✓ (${alignedDkimSignature.domain})`;
                }
            } else if (alignedDkimSignature.result === 'fail') {
                dkimAuthStatus = 'fail';
                dkimAuthValue = `Failed ✗ (no key for ${alignedDkimSignature.domain})`;
            } else {
                dkimAuthStatus = 'fail';
                dkimAuthValue = `${alignedDkimSignature.result} (${alignedDkimSignature.domain})`;
            }
        } else {
            // No aligned signature found
            const passedSignatures = authData.dkim.signatures.filter(sig => sig.result === 'pass');
            if (passedSignatures.length > 0) {
                // Even unaligned signatures fail if compauth fails
                if (compauthFailedEarly || dmarcFailedEarly) {
                    dkimAuthStatus = 'fail';
                    let reasons = [];
                    if (compauthFailedEarly) reasons.push('compauth fail');
                    if (dmarcFailedEarly) reasons.push(`dmarc ${authData.dmarc.result}`);
                    dkimAuthValue = `Failed ✗ (${passedSignatures.map(s => s.domain).join(', ')}: ${reasons.join(', ')})`;
                } else {
                    dkimAuthStatus = 'warning';
                    dkimAuthValue = `Pass but no aligned signature (${passedSignatures.map(s => s.domain).join(', ')})`;
                }
            } else {
                dkimAuthStatus = 'fail';
                dkimAuthValue = 'No valid signatures';
            }
        }
    }
    checks.push({ label: 'DKIM Authentication', value: dkimAuthValue, status: dkimAuthStatus });

    // DKIM Alignment Check
    let dkimAlignStatus = 'neutral';
    let dkimAlignValue = 'Unknown';
    
    // Check for composite authentication failures (Microsoft)
    const compauthFailed = authData.compauth && authData.compauth.result === 'fail';
    const arcFailed = authData.arc && authData.arc.result === 'fail';
    const dmarcFailed = authData.dmarc && (authData.dmarc.result === 'fail' || authData.dmarc.result === 'none');
    
    if (authData.dkim.signatures.length > 0 && fromDomain) {
        if (alignedDkimSignature) {
            // We have an aligned signature - but check composite auth results
            if (alignedDkimSignature.result === 'pass') {
                // Even if signature passes, check composite authentication
                if (compauthFailed || dmarcFailed) {
                    dkimAlignStatus = 'fail';
                    let reasons = [];
                    if (compauthFailed && authData.compauth.reason) {
                        reasons.push(`compauth fail (${authData.compauth.reason})`);
                    } else if (compauthFailed) {
                        reasons.push('compauth fail');
                    }
                    if (dmarcFailed) {
                        reasons.push(`dmarc ${authData.dmarc.result}`);
                    }
                    if (arcFailed) {
                        reasons.push('arc fail');
                    }
                    dkimAlignValue = `Failed ✗ (${reasons.join(', ')})`;
                } else {
                    dkimAlignStatus = 'pass';
                    dkimAlignValue = 'Aligned ✓';
                }
            } else {
                dkimAlignStatus = 'fail';
                // Check for specific failure reasons
                const failureReason = alignedDkimSignature.reason || 'signature invalid';
                dkimAlignValue = `Aligned but ${failureReason} ✗`;
            }
        } else {
            // No aligned signature - show what domains we have
            const signatureDomains = authData.dkim.signatures.map(s => s.domain).join(', ');
            dkimAlignStatus = 'fail';
            dkimAlignValue = `No aligned signature ✗ (have: ${signatureDomains})`;
        }
    } else if (authData.dkim.signatures.length === 0) {
        dkimAlignStatus = 'fail';
        dkimAlignValue = 'No DKIM signatures found ✗';
    } else if (!fromDomain) {
        dkimAlignStatus = 'neutral';
        dkimAlignValue = 'No From domain';
    }
    
    checks.push({ label: 'DKIM Alignment', value: dkimAlignValue, status: dkimAlignStatus });
    
    // DKIM Body Hash Check - check for body hash verification failures
    let bodyHashCheckAdded = false;
    if (authData.dkim.signatures.length > 0) {
        authData.dkim.signatures.forEach((sig, index) => {
            if (sig.reason && sig.reason.toLowerCase().includes('body')) {
                const bodyHashStatus = 'fail';
                const bodyHashValue = `Body Hash Not Verified ✗ - Message body was modified after signing (domain: ${sig.domain})`;
                checks.push({ label: 'DKIM Body Hash Verification', value: bodyHashValue, status: bodyHashStatus });
                bodyHashCheckAdded = true;
            }
        });
    }
    
    // Also check DKIM-Signature headers directly for body hash tag
    const dkimSignatures = headers['DKIM-Signature'] || headers['dkim-signature'] || [];
    if (!bodyHashCheckAdded && dkimSignatures.length > 0) {
        // Check if any DKIM signature failed in authentication results
        const failedDkimSigs = authData.dkim.signatures.filter(sig => 
            sig.result === 'fail' || sig.result === 'hardfail' || sig.result === 'temperror' || sig.result === 'permerror'
        );
        
        if (failedDkimSigs.length > 0) {
            // Parse DKIM-Signature to extract domain
            dkimSignatures.forEach(sigHeader => {
                const domainMatch = sigHeader.match(/d=([^;\s]+)/);
                const bhMatch = sigHeader.match(/bh=([^;\s]+)/);
                
                if (domainMatch && bhMatch) {
                    const sigDomain = domainMatch[1].toLowerCase();
                    const failedSig = failedDkimSigs.find(s => s.domain === sigDomain);
                    
                    if (failedSig && (!failedSig.reason || failedSig.reason.toLowerCase().includes('body'))) {
                        const bodyHashStatus = 'fail';
                        const bodyHashValue = `Body Hash Not Verified ✗ - Computed hash doesn't match bh= tag (domain: ${sigDomain})`;
                        checks.push({ label: 'DKIM Body Hash Verification', value: bodyHashValue, status: bodyHashStatus });
                        bodyHashCheckAdded = true;
                    }
                }
            });
        }
    }

    // DMARC Check
    let dmarcStatus = 'neutral';
    let dmarcValue = 'Not found';
    if (authData.dmarc.result) {
        if (authData.dmarc.result === 'pass') {
            dmarcStatus = 'pass';
            dmarcValue = 'Pass ✓';
        } else if (authData.dmarc.result === 'fail') {
            dmarcStatus = 'fail';
            dmarcValue = 'Failed ✗';
        } else if (authData.dmarc.result === 'none') {
            dmarcStatus = 'fail';
            dmarcValue = 'None ✗';
        } else {
            dmarcStatus = 'warning';
            dmarcValue = authData.dmarc.result;
        }
    }
    checks.push({ label: 'DMARC', value: dmarcValue, status: dmarcStatus });

    // Domain Check (returnPath already retrieved in SPF alignment check above)
    let domainStatus = 'neutral';
    let domainValue = 'Unknown';
    
    if (from) {
        domainValue = fromDomain;
        
        if (returnPath) {
            const returnDomainCheck = extractDomain(returnPath);
            if (fromDomain !== returnDomainCheck && returnDomainCheck) {
                domainStatus = 'warning';
                domainValue = `${fromDomain} (Return: ${returnDomainCheck})`;
            } else {
                domainStatus = 'pass';
            }
        }
    }
    checks.push({ label: 'Domain', value: domainValue, status: domainStatus });

    // Render checks
    checks.forEach(check => {
        const checkDiv = document.createElement('div');
        checkDiv.className = `security-check ${check.status}`;
        checkDiv.innerHTML = `
            <div class="check-label">${check.label}</div>
            <div class="check-value">${check.value}</div>
        `;
        securityChecks.appendChild(checkDiv);
    });
}

// Display sender information
function displaySenderInfo(headers) {
    senderInfo.innerHTML = '';

    const importantHeaders = [
        { key: 'From', label: 'From', important: true },
        { key: 'To', label: 'To', important: true },
        { key: 'Return-Path', label: 'Return Path', important: true },
        { key: 'Reply-To', label: 'Reply To', important: false },
        { key: 'Sender', label: 'Sender', important: false },
        { key: 'Subject', label: 'Subject', important: true },
        { key: 'Date', label: 'Date', important: false },
        { key: 'Message-ID', label: 'Message ID', important: false },
    ];

    const from = getHeader(headers, 'From');
    const returnPath = getHeader(headers, 'Return-Path');
    const fromDomain = from ? extractDomain(from) : '';
    const returnDomain = returnPath ? extractDomain(returnPath) : '';

    importantHeaders.forEach(({ key, label, important }) => {
        const value = getHeader(headers, key);
        if (value) {
            const itemDiv = document.createElement('div');
            
            // Check for suspicious behavior
            let isSuspicious = false;
            if (key === 'Return-Path' && fromDomain && returnDomain && fromDomain !== returnDomain) {
                isSuspicious = true;
            }
            if (key === 'Reply-To') {
                const replyDomain = extractDomain(value);
                if (fromDomain && replyDomain && fromDomain !== replyDomain) {
                    isSuspicious = true;
                }
            }

            itemDiv.className = `info-item ${important ? 'important' : ''} ${isSuspicious ? 'suspicious' : ''}`;
            itemDiv.innerHTML = `
                <div class="info-label">${label}</div>
                <div class="info-value ${important ? 'bold' : ''}">${escapeHtml(value)}</div>
            `;
            senderInfo.appendChild(itemDiv);
        }
    });
}

// Display relay timeline
function displayRelayTimeline(headers) {
    relayTimeline.innerHTML = '';

    // Get all Received headers (they are in reverse chronological order - newest first)
    const receivedHeaders = headers['Received'] || headers['received'] || [];
    
    if (receivedHeaders.length === 0) {
        relayTimeline.innerHTML = '<p style="color: var(--text-secondary); padding: 20px; text-align: center;">No relay information found</p>';
        return;
    }

    // Parse each Received header
    const relays = receivedHeaders.map((header, index) => {
        const relay = {
            index: receivedHeaders.length - index, // Reverse numbering (oldest = 1)
            rawHeader: header,
            from: null,
            by: null,
            with: null,
            id: null,
            for: null,
            date: null,
            timestamp: null
        };

        // Parse FROM
        const fromMatch = header.match(/from\s+([^\s(]+)/i);
        if (fromMatch) relay.from = fromMatch[1];

        // Parse BY
        const byMatch = header.match(/by\s+([^\s(]+)/i);
        if (byMatch) relay.by = byMatch[1];

        // Parse WITH
        const withMatch = header.match(/with\s+([^\s;]+)/i);
        if (withMatch) relay.with = withMatch[1];

        // Parse ID
        const idMatch = header.match(/id\s+([^\s;]+)/i);
        if (idMatch) relay.id = idMatch[1];

        // Parse FOR
        const forMatch = header.match(/for\s+<([^>]+)>/i);
        if (forMatch) relay.for = forMatch[1];

        // Parse date (multiple formats)
        const dateMatch = header.match(/;\s*(.+)$/);
        if (dateMatch) {
            relay.date = dateMatch[1].trim();
            try {
                relay.timestamp = new Date(relay.date);
            } catch (e) {
                relay.timestamp = null;
            }
        }

        return relay;
    });

    // Reverse to show oldest first (chronological order)
    relays.reverse();

    // Display timeline
    relays.forEach((relay, index) => {
        const timelineItem = document.createElement('div');
        const isFirst = index === 0;
        timelineItem.className = `timeline-item ${isFirst ? 'first-hop' : ''}`;

        // Format date
        let dateDisplay = relay.date || 'Unknown';
        if (relay.timestamp && !isNaN(relay.timestamp.getTime())) {
            const options = { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric', 
                hour: '2-digit', 
                minute: '2-digit',
                second: '2-digit',
                timeZoneName: 'short'
            };
            dateDisplay = relay.timestamp.toLocaleString('en-US', options);
        }

        // Build timeline content
        let detailsHTML = '';
        
        if (relay.from) {
            detailsHTML += `
                <div class="timeline-detail-row">
                    <div class="timeline-detail-label">From:</div>
                    <div class="timeline-detail-value">${escapeHtml(relay.from)}</div>
                </div>
            `;
        }
        
        if (relay.by) {
            detailsHTML += `
                <div class="timeline-detail-row">
                    <div class="timeline-detail-label">By:</div>
                    <div class="timeline-detail-value">${escapeHtml(relay.by)}</div>
                </div>
            `;
        }
        
        if (relay.with) {
            detailsHTML += `
                <div class="timeline-detail-row">
                    <div class="timeline-detail-label">Protocol:</div>
                    <div class="timeline-detail-value">${escapeHtml(relay.with)}</div>
                </div>
            `;
        }
        
        if (relay.id) {
            detailsHTML += `
                <div class="timeline-detail-row">
                    <div class="timeline-detail-label">ID:</div>
                    <div class="timeline-detail-value">${escapeHtml(relay.id)}</div>
                </div>
            `;
        }
        
        if (relay.for) {
            detailsHTML += `
                <div class="timeline-detail-row">
                    <div class="timeline-detail-label">For:</div>
                    <div class="timeline-detail-value">${escapeHtml(relay.for)}</div>
                </div>
            `;
        }

        const hopLabel = isFirst ? 'Original Sender' : `Hop ${relay.index}`;
        const serverName = relay.from || relay.by || 'Unknown Server';

        timelineItem.innerHTML = `
            <div class="timeline-number">${hopLabel}</div>
            <div class="timeline-header">
                <div class="timeline-server">${escapeHtml(serverName)}</div>
                <div class="timeline-time">${escapeHtml(dateDisplay)}</div>
            </div>
            <div class="timeline-details">
                ${detailsHTML}
            </div>
        `;

        relayTimeline.appendChild(timelineItem);
    });
}

// Display all headers
function displayAllHeaders(headers) {
    allHeaders.innerHTML = '';

    const importantHeaderNames = [
        'from', 'to', 'cc', 'bcc', 'subject', 'date',
        'return-path', 'reply-to', 'sender',
        'received-spf', 'authentication-results', 'dkim-signature',
        'received', 'x-originating-ip', 'x-mailer'
    ];

    const suspiciousPatterns = [
        /X-Spam/i,
        /X-Virus/i,
        /X-Malware/i,
        /X-Phishing/i
    ];

    for (const [name, values] of Object.entries(headers)) {
        const isImportant = importantHeaderNames.includes(name.toLowerCase());
        const isSuspicious = suspiciousPatterns.some(pattern => pattern.test(name));

        values.forEach(value => {
            const headerDiv = document.createElement('div');
            headerDiv.className = `header-item ${isImportant ? 'important' : ''} ${isSuspicious ? 'suspicious' : ''}`;
            headerDiv.innerHTML = `
                <span class="header-name">${escapeHtml(name)}:</span>
                <span class="header-value">${escapeHtml(value)}</span>
            `;
            allHeaders.appendChild(headerDiv);
        });
    }
}

// Parse Authentication-Results header
function parseAuthenticationResults(authResults) {
    const result = {
        spf: { result: null, domain: null },
        dkim: { signatures: [], alignedSignature: null }, // Changed to support multiple DKIM
        dmarc: { result: null },
        compauth: { result: null, reason: null },
        arc: { result: null }
    };

    if (!authResults) return result;

    // Parse SPF
    const spfMatch = authResults.match(/spf=(\w+)/i);
    if (spfMatch) {
        result.spf.result = spfMatch[1].toLowerCase();
    }
    const spfDomainMatch = authResults.match(/smtp\.mailfrom=([^\s;]+)/i) || 
                           authResults.match(/smtp\.mail=([^\s;]+)/i) ||
                           authResults.match(/envelope-from=([^\s;]+)/i);
    if (spfDomainMatch) {
        result.spf.domain = extractDomain(spfDomainMatch[1]);
    }

    // Parse ALL DKIM signatures (there can be multiple)
    const dkimRegex = /dkim=(\w+)\s*(?:\(([^)]*)\)\s*)?header\.d=([^\s;]+)/gi;
    let dkimMatch;
    while ((dkimMatch = dkimRegex.exec(authResults)) !== null) {
        const dkimResult = dkimMatch[1].toLowerCase();
        const dkimReason = dkimMatch[2] || null;
        const dkimDomain = dkimMatch[3].toLowerCase();
        
        // Parse the reason if it exists to detect specific failures
        let failureReason = null;
        if (dkimReason) {
            if (dkimReason.toLowerCase().includes('body hash')) {
                failureReason = 'body hash not verified';
            } else if (dkimReason.toLowerCase().includes('signature')) {
                failureReason = 'signature verification failed';
            } else {
                failureReason = dkimReason.toLowerCase();
            }
        }
        
        result.dkim.signatures.push({
            result: dkimResult,
            domain: dkimDomain,
            reason: failureReason
        });
    }

    // Parse DMARC
    const dmarcMatch = authResults.match(/dmarc=(\w+)/i);
    if (dmarcMatch) {
        result.dmarc.result = dmarcMatch[1].toLowerCase();
    }

    // Parse compauth (Microsoft composite authentication)
    const compauthMatch = authResults.match(/compauth=(\w+)(?:\s+reason=(\d+))?/i);
    if (compauthMatch) {
        result.compauth.result = compauthMatch[1].toLowerCase();
        result.compauth.reason = compauthMatch[2] || null;
    }

    // Parse arc (Authenticated Received Chain)
    const arcMatch = authResults.match(/arc=(\w+)/i);
    if (arcMatch) {
        result.arc.result = arcMatch[1].toLowerCase();
    }

    return result;
}

// Helper function to get header value
function getHeader(headers, name) {
    const key = Object.keys(headers).find(k => k.toLowerCase() === name.toLowerCase());
    return key && headers[key] ? headers[key][0] : null;
}

// Escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

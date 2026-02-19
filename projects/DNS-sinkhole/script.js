// Blocklist data
const blocklists = [
    {
        name: "StevenBlack Unified Hosts",
        url: "https://raw.githubusercontent.com/StevenBlack/hosts/master/hosts",
        description: "Unified hosts file with adware and malware blocking",
        category: "Ads & Malware"
    },
    {
        name: "KAD Hosts",
        url: "https://raw.githubusercontent.com/PolishFiltersTeam/KADhosts/master/KADhosts.txt",
        description: "Blocks fraud, adware, and malware domains",
        category: "Ads"
    },
    {
        name: "FadeMind Spam",
        url: "https://raw.githubusercontent.com/FadeMind/hosts.extras/master/add.Spam/hosts",
        description: "Blocks spam and junk domains",
        category: "Spam"
    },
    {
        name: "W3KBL",
        url: "https://v.firebog.net/hosts/static/w3kbl.txt",
        description: "Blocks web exploits and malicious domains",
        category: "Malware"
    },
    {
        name: "AdAway",
        url: "https://adaway.org/hosts.txt",
        description: "Mobile and general advertising blocking",
        category: "Ads"
    },
    {
        name: "AdGuard DNS",
        url: "https://v.firebog.net/hosts/AdguardDNS.txt",
        description: "AdGuard's DNS blocking list",
        category: "Ads"
    },
    {
        name: "Admiral",
        url: "https://v.firebog.net/hosts/Admiral.txt",
        description: "Blocks anti-adblock detection scripts",
        category: "Anti-Adblock"
    },
    {
        name: "Anudeep Ad Servers",
        url: "https://raw.githubusercontent.com/anudeepND/blacklist/master/adservers.txt",
        description: "Curated list of ad serving domains",
        category: "Ads"
    },
    {
        name: "Disconnect.me Simple Ad",
        url: "https://s3.amazonaws.com/lists.disconnect.me/simple_ad.txt",
        description: "Basic advertising tracking protection",
        category: "Ads"
    },
    {
        name: "Easylist",
        url: "https://v.firebog.net/hosts/Easylist.txt",
        description: "Primary filter list for ad blocking",
        category: "Ads"
    },
    {
        name: "Yoyo Ad Servers",
        url: "https://pgl.yoyo.org/adservers/serverlist.php?hostformat=hosts&showintro=0&mimetype=plaintext",
        description: "Comprehensive ad server blocking list",
        category: "Ads"
    },
    {
        name: "Unchecky Ads",
        url: "https://raw.githubusercontent.com/FadeMind/hosts.extras/master/UncheckyAds/hosts",
        description: "Blocks ads from bundled installers",
        category: "Ads"
    },
    {
        name: "HostsVN",
        url: "https://raw.githubusercontent.com/bigdargon/hostsVN/master/hosts",
        description: "Vietnamese ad and tracking domains",
        category: "Ads"
    },
    {
        name: "EasyPrivacy",
        url: "https://v.firebog.net/hosts/Easyprivacy.txt",
        description: "Blocks privacy-invasive trackers",
        category: "Tracking"
    },
    {
        name: "Prigent Ads",
        url: "https://v.firebog.net/hosts/Prigent-Ads.txt",
        description: "Advertising domains blocklist",
        category: "Ads"
    },
    {
        name: "2o7.net Tracking",
        url: "https://raw.githubusercontent.com/FadeMind/hosts.extras/master/add.2o7Net/hosts",
        description: "Blocks Adobe/Omniture tracking (2o7.net)",
        category: "Tracking"
    },
    {
        name: "Windows Spy Blocker",
        url: "https://raw.githubusercontent.com/crazy-max/WindowsSpyBlocker/master/data/hosts/spy.txt",
        description: "Blocks Windows telemetry and tracking",
        category: "Tracking"
    },
    {
        name: "First-party Trackers",
        url: "https://hostfiles.frogeye.fr/firstparty-trackers-hosts.txt",
        description: "Blocks first-party tracking domains",
        category: "Tracking"
    },
    {
        name: "DandelionSprout Anti-Malware",
        url: "https://raw.githubusercontent.com/DandelionSprout/adfilt/master/Alternate%20versions%20Anti-Malware%20List/AntiMalwareHosts.txt",
        description: "Malware, phishing, and scam domains",
        category: "Malware"
    },
    {
        name: "Disconnect.me Malvertising",
        url: "https://s3.amazonaws.com/lists.disconnect.me/simple_malvertising.txt",
        description: "Blocks malicious advertising networks",
        category: "Malware"
    },
    {
        name: "Prigent Crypto",
        url: "https://v.firebog.net/hosts/Prigent-Crypto.txt",
        description: "Blocks cryptocurrency mining and crypto-related threats",
        category: "Cryptomining"
    },
    {
        name: "FadeMind Risk Domains",
        url: "https://raw.githubusercontent.com/FadeMind/hosts.extras/master/add.Risk/hosts",
        description: "High-risk and suspicious domains",
        category: "Malware"
    },
    {
        name: "Mandiant APT1",
        url: "https://bitbucket.org/ethanr/dns-blacklists/raw/8575c9f96e5b4a1308f2f12394abd86d0927a4a0/bad_lists/Mandiant_APT1_Report_Appendix_D.txt",
        description: "Advanced Persistent Threat indicators from Mandiant report",
        category: "Malware"
    },
    {
        name: "Phishing Army",
        url: "https://phishing.army/download/phishing_army_blocklist_extended.txt",
        description: "Extended phishing and scam domains",
        category: "Phishing"
    },
    {
        name: "NoTrack Malware",
        url: "https://gitlab.com/quidsup/notrack-blocklists/raw/master/notrack-malware.txt",
        description: "Malware and malicious site blocking",
        category: "Malware"
    },
    {
        name: "RPiList Malware",
        url: "https://v.firebog.net/hosts/RPiList-Malware.txt",
        description: "Raspberry Pi focused malware blocklist",
        category: "Malware"
    },
    {
        name: "RPiList Phishing",
        url: "https://v.firebog.net/hosts/RPiList-Phishing.txt",
        description: "Raspberry Pi focused phishing blocklist",
        category: "Phishing"
    },
    {
        name: "Spam404",
        url: "https://raw.githubusercontent.com/Spam404/lists/master/main-blacklist.txt",
        description: "Spam and scam domains blacklist",
        category: "Spam"
    },
    {
        name: "Stalkerware Indicators",
        url: "https://raw.githubusercontent.com/AssoEchap/stalkerware-indicators/master/generated/hosts",
        description: "Blocks stalkerware and spyware domains",
        category: "Spyware"
    },
    {
        name: "URLhaus Malware",
        url: "https://urlhaus.abuse.ch/downloads/hostfile/",
        description: "Active malware distribution sites from abuse.ch",
        category: "Malware"
    },
    {
        name: "Hagezi Gambling",
        url: "https://raw.githubusercontent.com/hagezi/dns-blocklists/main/wildcard/gambling-onlydomains.txt",
        description: "Blocks gambling and betting sites",
        category: "Gambling"
    },
    {
        name: "DeveloperDan Ads & Tracking Extended",
        url: "https://www.github.developerdan.com/hosts/lists/ads-and-tracking-extended.txt",
        description: "Extended ads and tracking blocklist by Lightswitch05",
        category: "Ads & Tracking"
    },
    {
        name: "Phishing Army Blocklist",
        url: "https://phishing.army/download/phishing_army_blocklist.txt",
        description: "Comprehensive phishing domain blocklist",
        category: "Phishing"
    },
    {
        name: "DeveloperDan AMP Hosts Extended",
        url: "https://www.github.developerdan.com/hosts/lists/amp-hosts-extended.txt",
        description: "Blocks Google AMP (Accelerated Mobile Pages) domains",
        category: "Privacy"
    },
    {
        name: "OISD Big",
        url: "https://big.oisd.nl/",
        description: "Large unified blocklist from OISD project",
        category: "Comprehensive"
    },
    {
        name: "OISD NSFW",
        url: "https://nsfw.oisd.nl/",
        description: "Blocks NSFW and adult content domains",
        category: "Adult Content"
    },
    {
        name: "DRSDavidSoft Ad Servers & Trackers",
        url: "https://raw.githubusercontent.com/DRSDavidSoft/additional-hosts/master/domains/blacklist/adservers-and-trackers.txt",
        description: "Additional ad servers and tracking domains",
        category: "Ads & Tracking"
    },
    {
        name: "Mobile Hosts - AdGuard Mobile Ads",
        url: "https://raw.githubusercontent.com/r-a-y/mobile-hosts/master/AdguardMobileAds.txt",
        description: "Mobile-specific advertising domains",
        category: "Mobile Ads"
    },
    {
        name: "Mobile Hosts - AdGuard DNS",
        url: "https://raw.githubusercontent.com/r-a-y/mobile-hosts/master/AdguardDNS.txt",
        description: "AdGuard DNS filter for mobile",
        category: "Mobile Ads"
    },
    {
        name: "Mobile Hosts - CNAME Microsites",
        url: "https://raw.githubusercontent.com/r-a-y/mobile-hosts/master/AdguardCNAMEMicrosites.txt",
        description: "CNAME cloaking microsites for mobile",
        category: "Mobile Tracking"
    },
    {
        name: "Mobile Hosts - AdGuard Apps",
        url: "https://raw.githubusercontent.com/r-a-y/mobile-hosts/master/AdguardApps.txt",
        description: "App-based tracking and ads (last updated 2020)",
        category: "Mobile Ads"
    },
    {
        name: "Mobile Hosts - CNAME",
        url: "https://raw.githubusercontent.com/r-a-y/mobile-hosts/master/AdguardCNAME.txt",
        description: "CNAME cloaking tracking domains",
        category: "Mobile Tracking"
    },
    {
        name: "Mobile Hosts - CNAME Ads",
        url: "https://raw.githubusercontent.com/r-a-y/mobile-hosts/master/AdguardCNAMEAds.txt",
        description: "CNAME-based advertising domains",
        category: "Mobile Ads"
    },
    {
        name: "Mobile Hosts - CNAME Clickthroughs",
        url: "https://raw.githubusercontent.com/r-a-y/mobile-hosts/master/AdguardCNAMEClickthroughs.txt",
        description: "CNAME clickthrough tracking",
        category: "Mobile Tracking"
    },
    {
        name: "Mobile Hosts - EasyPrivacy Specific",
        url: "https://raw.githubusercontent.com/r-a-y/mobile-hosts/master/EasyPrivacySpecific.txt",
        description: "Specific privacy trackers for mobile",
        category: "Mobile Tracking"
    },
    {
        name: "Mobile Hosts - EasyPrivacy CNAME",
        url: "https://raw.githubusercontent.com/r-a-y/mobile-hosts/master/EasyPrivacyCNAME.txt",
        description: "EasyPrivacy CNAME cloaking trackers",
        category: "Mobile Tracking"
    },
    {
        name: "Mobile Hosts - EasyPrivacy 3rd Party",
        url: "https://raw.githubusercontent.com/r-a-y/mobile-hosts/master/EasyPrivacy3rdParty.txt",
        description: "Third-party privacy trackers for mobile",
        category: "Mobile Tracking"
    },
    {
        name: "Mobile Hosts - AdGuard Tracking",
        url: "https://raw.githubusercontent.com/r-a-y/mobile-hosts/master/AdguardTracking.txt",
        description: "AdGuard tracking domains for mobile",
        category: "Mobile Tracking"
    },
    {
        name: "Mobile Hosts - Mobile Spyware",
        url: "https://raw.githubusercontent.com/r-a-y/mobile-hosts/master/AdguardMobileSpyware.txt",
        description: "Mobile spyware and malicious apps",
        category: "Mobile Spyware"
    },
    {
        name: "NoTrack Blocklist",
        url: "https://gitlab.com/quidsup/notrack-blocklists/raw/master/notrack-blocklist.txt",
        description: "General tracking and ad blocking",
        category: "Ads & Tracking"
    },
    {
        name: "No Google Analytics",
        url: "https://raw.githubusercontent.com/nickspaargaren/no-google/master/categories/analyticsparsed",
        description: "Blocks Google Analytics and tracking services",
        category: "Privacy"
    },
    {
        name: "mmotti Pi-hole Regex",
        url: "https://raw.githubusercontent.com/mmotti/pihole-regex/master/regex.list",
        description: "Regex patterns for advanced blocking (Pi-hole compatible)",
        category: "Regex"
    }
];

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    renderBlocklists();
    setupEventListeners();
});

// Render blocklists
function renderBlocklists() {
    const container = document.getElementById('blocklistContainer');
    container.innerHTML = '';

    blocklists.forEach((list, index) => {
        const item = createBlocklistItem(list, index);
        container.appendChild(item);
    });
}

// Create a blocklist item element
function createBlocklistItem(list, index) {
    const div = document.createElement('div');
    div.className = 'blocklist-item';
    div.dataset.index = index;

    div.innerHTML = `
        <div class="blocklist-header">
            <div class="blocklist-info">
                <div class="blocklist-name">${list.name}</div>
                <div class="blocklist-description">${list.description}</div>
                <span class="blocklist-category">${list.category}</span>
            </div>
        </div>
        <div class="blocklist-url">
            <span class="url-text">${list.url}</span>
            <button class="btn-copy" data-index="${index}">Copy</button>
        </div>
    `;

    return div;
}

// Setup event listeners
function setupEventListeners() {
    // Filter input
    const filterInput = document.getElementById('filterInput');
    filterInput.addEventListener('input', handleFilter);

    // Copy all button
    const copyAllBtn = document.getElementById('copyAll');
    copyAllBtn.addEventListener('click', copyAllUrls);

    // Copy individual buttons
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-copy')) {
            const index = parseInt(e.target.dataset.index);
            copyUrl(blocklists[index].url, e.target);
        }
    });
}

// Filter blocklists
function handleFilter(e) {
    const searchTerm = e.target.value.toLowerCase();
    const items = document.querySelectorAll('.blocklist-item');
    let visibleCount = 0;

    items.forEach((item, index) => {
        const list = blocklists[index];
        const searchableText = `${list.name} ${list.description} ${list.category} ${list.url}`.toLowerCase();
        
        if (searchableText.includes(searchTerm)) {
            item.classList.remove('hidden');
            visibleCount++;
        } else {
            item.classList.add('hidden');
        }
    });

    updateStats(visibleCount);
}

// Update stats
function updateStats(filteredCount = null) {
    const totalCount = document.getElementById('totalCount');
    const filteredCountEl = document.getElementById('filteredCount');

    totalCount.textContent = `${blocklists.length} blocklists`;

    if (filteredCount !== null && filteredCount !== blocklists.length) {
        filteredCountEl.textContent = `(${filteredCount} shown)`;
    } else {
        filteredCountEl.textContent = '';
    }
}

// Copy individual URL
function copyUrl(url, button) {
    navigator.clipboard.writeText(url).then(() => {
        const originalText = button.textContent;
        button.textContent = 'Copied!';
        button.classList.add('copied');

        setTimeout(() => {
            button.textContent = originalText;
            button.classList.remove('copied');
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy:', err);
        alert('Failed to copy URL');
    });
}

// Copy all URLs
function copyAllUrls() {
    const visibleItems = document.querySelectorAll('.blocklist-item:not(.hidden)');
    const urls = Array.from(visibleItems).map(item => {
        const index = parseInt(item.dataset.index);
        return blocklists[index].url;
    });

    const allUrls = urls.join('\n');
    
    navigator.clipboard.writeText(allUrls).then(() => {
        const btn = document.getElementById('copyAll');
        const originalText = btn.textContent;
        btn.textContent = `Copied ${urls.length} URLs!`;
        btn.style.background = 'var(--success-color)';

        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = '';
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy:', err);
        alert('Failed to copy URLs');
    });
}

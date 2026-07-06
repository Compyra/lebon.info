// IT Toolkit page JavaScript

// View mode management
let currentView = localStorage.getItem('viewMode') || 'grid';
let toolsData = [];

// Security: ensure all links opening in a new tab are isolated from the opener
function secureExternalLinks() {
    document.querySelectorAll('a[target="_blank"]').forEach(a => {
        a.setAttribute('rel', 'noopener noreferrer');
    });
}

// Toggle between grid and compact view
function toggleView(mode) {
    currentView = mode;
    localStorage.setItem('viewMode', mode);

    const gridView = document.getElementById('toolsGrid');
    const tableView = document.getElementById('toolsTable');
    const sortControls = document.getElementById('sortControls');
    const gridBtn = document.getElementById('gridViewBtn');
    const compactBtn = document.getElementById('compactViewBtn');

    if (mode === 'compact') {
        gridView.style.display = 'none';
        tableView.style.display = 'block';
        sortControls.style.display = 'inline-block';
        gridBtn.classList.remove('active');
        compactBtn.classList.add('active');
        generateTableView();
    } else {
        gridView.style.display = 'grid';
        tableView.style.display = 'none';
        sortControls.style.display = 'none';
        gridBtn.classList.add('active');
        compactBtn.classList.remove('active');
    }
}

// Generate table view from cards
function generateTableView() {
    const cards = Array.from(document.querySelectorAll('.tool-card'));
    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = '';

    toolsData = cards.map(card => {
        const h3Element = card.querySelector('h3');
        const name = h3Element.textContent;
        const nameHtml = h3Element.innerHTML; // Preserve HTML including stamps
        const type = card.querySelector('.badge.online, .badge.hybrid, .badge.download, .badge.browser').textContent;
        const priceEl = card.querySelector('.badge.free, .badge.freemium, .badge.trial, .badge.paid');
        const price = priceEl ? priceEl.textContent : 'N/A';
        const desc = card.querySelector('.tool-desc').textContent;
        const warning = card.querySelector('.warning') ? card.querySelector('.warning').textContent : '';
        const category = card.dataset.category;
        const verified = card.dataset.verified === 'true';
        // Get only direct links, not those inside details/expandable sections
        const toolLinksDiv = card.querySelector('.tool-links');
        const links = toolLinksDiv ? Array.from(toolLinksDiv.querySelectorAll(':scope > a, :scope > .portal-details > .portal-links > a')) : [];
        const isVisible = card.style.display !== 'none';

        return { name, nameHtml, type, price, desc, warning, category, links, isVisible, verified, element: card };
    });

    sortTools();
}

// Sort tools in table view
function sortTools() {
    const sortBy = document.getElementById('sortSelect').value;
    const tableBody = document.getElementById('tableBody');

    let sorted = [...toolsData].filter(tool => tool.isVisible);

    switch (sortBy) {
        case 'name':
            sorted.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'name-desc':
            sorted.sort((a, b) => b.name.localeCompare(a.name));
            break;
        case 'category':
            sorted.sort((a, b) => a.category.localeCompare(b.category));
            break;
        case 'type':
            sorted.sort((a, b) => a.type.localeCompare(b.type));
            break;
        case 'price':
            sorted.sort((a, b) => a.price.localeCompare(b.price));
            break;
    }

    tableBody.innerHTML = '';
    sorted.forEach(tool => {
        // Separate main link from specific links
        const mainLink = tool.links[0];
        const specificLinks = tool.links.slice(1);

        // Build links HTML
        let linksHtml = '';
        if (mainLink) {
            const mainIcon = mainLink.innerHTML.split(' ')[0];
            linksHtml = `<a href="${mainLink.href}" target="_blank" rel="noopener noreferrer">${mainIcon}</a>`;
        }

        // Add expandable section if there are specific links
        if (specificLinks.length > 0) {
            linksHtml += `<details class="portal-details-compact">
                <summary>⚙️</summary>
                <div class="portal-links-compact">
                    ${specificLinks.map(link => {
                return `<a href="${link.href}" target="_blank" rel="noopener noreferrer">${link.innerHTML}</a>`;
            }).join(' ')}
                </div>
            </details>`;
        }

        const row = document.createElement('tr');
        const verifiedStamp = tool.verified ? ' <span class="verified-stamp">📍 lebon.info</span>' : '';
        row.innerHTML = `
            <td class="tool-name">${tool.nameHtml}${verifiedStamp}</td>
            <td class="tool-type-cell">${tool.type}</td>
            <td class="tool-price-cell">${tool.price}</td>
            <td class="tool-category">${formatCategory(tool.category)}</td>
            <td class="tool-description">${tool.desc}${tool.warning ? '<br><span class="warning" style="font-size: 11px;">' + tool.warning + '</span>' : ''}</td>
            <td class="tool-links-cell">${linksHtml}</td>
        `;
        tableBody.appendChild(row);
    });

    updateToolCount(sorted.length);
}

// Format category for display
function formatCategory(category) {
    const cats = category.split(' ');
    const icons = {
        'online': '🌐',
        'download': '💾',
        'network': '🔌',
        'security': '🔒',
        'development': '💻',
        'system': '⚙️',
        'entra': '🪟',
        'microsoft': '🪟',
        'docker': '🐳',
        'browser': '🌍',
        'forensics': '🔍',
        'media': '🎥',
        'language': '🔠',
        'rdh': '🕸️',
        'hybrid': '🔀'
    };
    return cats.map(c => icons[c] ? `${icons[c]} ${c}` : c).join(', ');
}

// Filter by category
function filterCategory(category, btn) {
    const cards = document.querySelectorAll('.tool-card');
    const buttons = document.querySelectorAll('.filter-btn');

    // Clear search input when using category filter
    document.getElementById('searchInput').value = '';

    // Update active button
    buttons.forEach(b => b.classList.remove('active'));
    if (btn) {
        btn.classList.add('active');
    } else {
        buttons[0].classList.add('active');
    }

    // Filter cards
    let visibleCount = 0;
    cards.forEach(card => {
        if (category === 'all' || card.dataset.category.includes(category)) {
            card.style.display = 'block';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });

    updateToolCount(visibleCount);

    // Update table view if in compact mode
    if (currentView === 'compact') {
        generateTableView();
    }
}

// Search filter
function filterTools() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const advancedSearch = document.getElementById('advancedSearch').checked;
    const cards = document.querySelectorAll('.tool-card');
    let visibleCount = 0;

    // Reset filter buttons to "All Tools" when searching
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    buttons[0].classList.add('active'); // First button is "All Tools"

    cards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const desc = card.querySelector('.tool-desc').textContent.toLowerCase();
        const category = card.dataset.category.toLowerCase();

        let matches = title.includes(searchTerm) || desc.includes(searchTerm) || category.includes(searchTerm);

        // If advanced search is enabled, also search link text and href values
        if (advancedSearch && !matches && searchTerm) {
            const links = card.querySelectorAll('a');
            links.forEach(link => {
                const linkText = link.textContent.toLowerCase();
                const linkHref = link.href.toLowerCase();
                if (linkText.includes(searchTerm) || linkHref.includes(searchTerm)) {
                    matches = true;
                }
            });
        }

        if (matches) {
            card.style.display = 'block';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });

    updateToolCount(visibleCount);

    // Update table view if in compact mode
    if (currentView === 'compact') {
        generateTableView();
    }
}

// Save search preference
function saveSearchPreference() {
    const advancedSearch = document.getElementById('advancedSearch').checked;
    localStorage.setItem('advancedSearch', advancedSearch);
}

// Toggle theme (remove/add borders and shadows)
function toggleTheme() {
    const body = document.body;
    body.classList.toggle('clean-theme');
    const isCleanTheme = body.classList.contains('clean-theme');
    localStorage.setItem('cleanTheme', isCleanTheme);

    // Close dropdown after selection
    document.getElementById('themeDropdownContent').classList.remove('show');
}

// Toggle Bright theme
function toggleBrightTheme() {
    const body = document.body;
    body.classList.toggle('bright-theme');
    const isBrightTheme = body.classList.contains('bright-theme');
    localStorage.setItem('brightTheme', isBrightTheme);

    // Update button text
    const btn = document.getElementById('brightThemeBtn');
    if (isBrightTheme) {
        btn.textContent = '🌑 Join the dark side';
    } else {
        btn.textContent = '☀️ I like it bright';
    }

    // Close dropdown after selection
    document.getElementById('themeDropdownContent').classList.remove('show');
}

// Update tool count
function updateToolCount(count) {
    document.getElementById('toolCount').textContent = count || document.querySelectorAll('.tool-card').length;
}

// Initialize on load
window.onload = function () {
    secureExternalLinks();
    updateToolCount();
    // Restore saved view mode
    if (currentView === 'compact') {
        toggleView('compact');
    }
    // Restore advanced search preference
    const savedAdvancedSearch = localStorage.getItem('advancedSearch');
    if (savedAdvancedSearch === 'true') {
        document.getElementById('advancedSearch').checked = true;
    }
    // Restore theme preference
    const savedTheme = localStorage.getItem('cleanTheme');
    if (savedTheme === 'true') {
        document.body.classList.add('clean-theme');
    }
    // Restore Bright theme preference
    const savedBrightTheme = localStorage.getItem('brightTheme');
    if (savedBrightTheme === 'true') {
        document.body.classList.add('bright-theme');
        document.getElementById('brightThemeBtn').textContent = '🌑 Join the dark side';
    }
};

// Toggle dropdown menu
document.getElementById('themeDropdownBtn').addEventListener('click', function (e) {
    e.stopPropagation();
    const dropdown = document.getElementById('themeDropdownContent');
    dropdown.classList.toggle('show');
});

// Close dropdown when clicking outside
window.addEventListener('click', function () {
    const dropdown = document.getElementById('themeDropdownContent');
    dropdown.classList.remove('show');
});

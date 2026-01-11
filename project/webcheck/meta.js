// Meta Tag Viewer - WebCheck
// Fetches and displays the <head> section and meta tags from any website

document.addEventListener('DOMContentLoaded', function() {
    const urlInput = document.getElementById('urlInput');
    const fetchButton = document.getElementById('fetchButton');
    const loadingContainer = document.getElementById('loadingContainer');
    const errorContainer = document.getElementById('errorContainer');
    const errorMessage = document.getElementById('errorMessage');
    const resultsContainer = document.getElementById('resultsContainer');

    // Check if URL is provided in query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const urlParam = urlParams.get('url');
    
    if (urlParam) {
        urlInput.value = urlParam;
        fetchMetaTags();
    }

    fetchButton.addEventListener('click', fetchMetaTags);
    urlInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            fetchMetaTags();
        }
    });

    async function fetchMetaTags() {
        const input = urlInput.value.trim();
        if (!input) {
            showError('Please enter a website URL');
            return;
        }

        // Normalize URL
        let url = input;
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'https://' + url;
        }

        // Update URL parameter
        const newUrl = new URL(window.location);
        newUrl.searchParams.set('url', input);
        window.history.pushState({}, '', newUrl);

        // Show loading, hide others
        loadingContainer.style.display = 'block';
        errorContainer.style.display = 'none';
        resultsContainer.style.display = 'none';

        try {
            // Try to fetch the webpage
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const html = await response.text();
            parseAndDisplayHead(html, url);
            
        } catch (error) {
            // CORS error or other fetch error
            loadingContainer.style.display = 'none';
            showError(`Unable to fetch webpage directly due to CORS restrictions.<br><br>
                <strong>Alternative options:</strong><br>
                1. <a href="view-source:${url}" target="_blank" class="terminal-link">View page source</a><br>
                2. Use a CORS proxy (not recommended for production)<br>
                3. Install a browser extension to bypass CORS<br><br>
                Error details: ${error.message}`);
        }
    }

    function parseAndDisplayHead(html, url) {
        loadingContainer.style.display = 'none';
        resultsContainer.style.display = 'block';

        // Extract the <head> section
        const headMatch = html.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
        
        if (!headMatch) {
            showError('Could not find &lt;head&gt; section in the HTML');
            return;
        }

        const headContent = headMatch[1];
        
        // Parse the head content
        const parser = new DOMParser();
        const doc = parser.parseFromString(`<html><head>${headContent}</head></html>`, 'text/html');
        const head = doc.head;

        // Display page information
        displayPageInfo(head, url);

        // Display meta tags
        displayMetaTags(head);

        // Display link tags
        displayLinkTags(head);

        // Display other head elements
        displayOtherTags(head);

        // Display full head section
        displayFullHead(headContent);
    }

    function displayPageInfo(head, url) {
        const pageInfo = document.getElementById('pageInfo');
        const title = head.querySelector('title');
        const description = head.querySelector('meta[name="description"]');
        const keywords = head.querySelector('meta[name="keywords"]');
        const viewport = head.querySelector('meta[name="viewport"]');

        let html = `
            <div class="info-grid">
                <div class="info-item">
                    <span class="info-label">URL:</span>
                    <span class="info-value"><a href="${url}" target="_blank" class="terminal-link">${url}</a></span>
                </div>
                <div class="info-item">
                    <span class="info-label">Title:</span>
                    <span class="info-value">${title ? escapeHtml(title.textContent) : '<em>No title found</em>'}</span>
                </div>
        `;

        if (description) {
            html += `
                <div class="info-item">
                    <span class="info-label">Description:</span>
                    <span class="info-value">${escapeHtml(description.getAttribute('content'))}</span>
                </div>
            `;
        }

        if (keywords) {
            html += `
                <div class="info-item">
                    <span class="info-label">Keywords:</span>
                    <span class="info-value">${escapeHtml(keywords.getAttribute('content'))}</span>
                </div>
            `;
        }

        if (viewport) {
            html += `
                <div class="info-item">
                    <span class="info-label">Viewport:</span>
                    <span class="info-value">${escapeHtml(viewport.getAttribute('content'))}</span>
                </div>
            `;
        }

        html += '</div>';
        pageInfo.innerHTML = html;
    }

    function displayMetaTags(head) {
        const metaTags = document.getElementById('metaTags');
        const metas = head.querySelectorAll('meta');

        if (metas.length === 0) {
            metaTags.innerHTML = '<p class="empty-message">No meta tags found</p>';
            return;
        }

        let html = '<div class="tag-list">';
        metas.forEach((meta, index) => {
            const attrs = getAttributes(meta);
            html += `
                <div class="tag-item">
                    <div class="tag-header">Meta Tag ${index + 1}</div>
                    <div class="tag-attributes">
                        ${attrs}
                    </div>
                    <div class="tag-code">
                        <code>${escapeHtml(meta.outerHTML)}</code>
                    </div>
                </div>
            `;
        });
        html += '</div>';
        metaTags.innerHTML = html;
    }

    function displayLinkTags(head) {
        const linkTags = document.getElementById('linkTags');
        const links = head.querySelectorAll('link');

        if (links.length === 0) {
            linkTags.innerHTML = '<p class="empty-message">No link tags found</p>';
            return;
        }

        let html = '<div class="tag-list">';
        links.forEach((link, index) => {
            const attrs = getAttributes(link);
            html += `
                <div class="tag-item">
                    <div class="tag-header">Link Tag ${index + 1}</div>
                    <div class="tag-attributes">
                        ${attrs}
                    </div>
                    <div class="tag-code">
                        <code>${escapeHtml(link.outerHTML)}</code>
                    </div>
                </div>
            `;
        });
        html += '</div>';
        linkTags.innerHTML = html;
    }

    function displayOtherTags(head) {
        const otherTags = document.getElementById('otherTags');
        const children = Array.from(head.children);
        const others = children.filter(el => 
            el.tagName !== 'META' && 
            el.tagName !== 'LINK' && 
            el.tagName !== 'TITLE'
        );

        if (others.length === 0) {
            otherTags.innerHTML = '<p class="empty-message">No other head elements found</p>';
            return;
        }

        let html = '<div class="tag-list">';
        others.forEach((el, index) => {
            const attrs = getAttributes(el);
            const hasContent = el.textContent.trim().length > 0;
            
            html += `
                <div class="tag-item">
                    <div class="tag-header">&lt;${el.tagName.toLowerCase()}&gt; ${index + 1}</div>
                    <div class="tag-attributes">
                        ${attrs}
                    </div>
                    ${hasContent ? `<div class="tag-content">${escapeHtml(el.textContent.trim())}</div>` : ''}
                    <div class="tag-code">
                        <code>${escapeHtml(el.outerHTML)}</code>
                    </div>
                </div>
            `;
        });
        html += '</div>';
        otherTags.innerHTML = html;
    }

    function displayFullHead(headContent) {
        const fullHead = document.getElementById('fullHead');
        
        // Format the HTML nicely
        const formatted = formatHtml(headContent);
        fullHead.textContent = formatted;
    }

    function getAttributes(element) {
        const attrs = Array.from(element.attributes);
        if (attrs.length === 0) {
            return '<em>No attributes</em>';
        }

        let html = '<ul class="attr-list">';
        attrs.forEach(attr => {
            html += `<li><strong>${escapeHtml(attr.name)}:</strong> ${escapeHtml(attr.value)}</li>`;
        });
        html += '</ul>';
        return html;
    }

    function formatHtml(html) {
        // Simple HTML formatting
        let formatted = html;
        formatted = formatted.replace(/></g, '>\n<');
        
        // Add indentation
        let indent = 0;
        const lines = formatted.split('\n');
        const indented = lines.map(line => {
            const trimmed = line.trim();
            if (trimmed.startsWith('</')) {
                indent = Math.max(0, indent - 1);
            }
            
            const result = '  '.repeat(indent) + trimmed;
            
            if (trimmed.startsWith('<') && !trimmed.startsWith('</') && !trimmed.endsWith('/>') && !trimmed.includes('</')) {
                indent++;
            }
            
            return result;
        });
        
        return indented.join('\n');
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function showError(message) {
        errorContainer.style.display = 'block';
        errorMessage.innerHTML = message;
        loadingContainer.style.display = 'none';
        resultsContainer.style.display = 'none';
    }
});

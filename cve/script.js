// Page-specific JS for cve/index.html
// - Gathers links from the DOM (#cveList)
// - Opens each link in a new tab with a small delay to reduce popup-blocking heuristics
// - If popups are blocked, copies the URLs to the clipboard as a fallback

document.addEventListener('DOMContentLoaded', async () => {
  const listContainer = document.getElementById('cveList');
  const btn = document.getElementById('openAll');

  if (!listContainer) return;

  // Load links from local JSON file
  let links = [];
  try {
    const res = await fetch('./links.json');
    if (!res.ok) throw new Error('Failed to fetch links.json: ' + res.status);
    links = await res.json();
  } catch (e) {
    console.error('Could not load links.json', e);
    listContainer.innerHTML = '<div class="note">Failed to load link list. See console for details.</div>';
    // still expose setLanguage
    window.setLanguage = (lang) => {
      document.body.setAttribute('data-lang', lang);
      document.querySelectorAll('.lang-btn').forEach(b => b.classList.toggle('active', b.getAttribute('data-lang') === lang));
    };
    return;
  }

  // Render list
  listContainer.innerHTML = '';
  links.forEach(item => {
    const div = document.createElement('div');
    div.className = 'cve-item';
    // support both the older `title` field and the newer `title_en`
    const title = item.title_en || item.title || '';
    const url = item.url || '';

    if (url && /^https?:\/\//i.test(url)) {
      const a = document.createElement('a');
      a.href = url;
      a.target = '_blank';
      a.rel = 'noopener';
      a.textContent = title;
      div.appendChild(a);
    } else {
      const span = document.createElement('span');
      span.textContent = title + (url ? ' (' + url + ')' : ' (URL not set)');
      span.className = 'missing-url';
      div.appendChild(span);
    }
    listContainer.appendChild(div);
  });
  
  // Only include valid http(s) URLs for the "open all" action
  const urls = links.map(l => l.url).filter(u => typeof u === 'string' && /^https?:\/\//i.test(u));

  if (!btn) return;
  btn.setAttribute('aria-pressed', 'false');
  btn.setAttribute('aria-busy', 'false');

  btn.addEventListener('click', async () => {
    if (btn.getAttribute('aria-busy') === 'true') return;
    const proceed = confirm('Open all monitored URLs in new tabs?');
    if (!proceed) return;

    btn.setAttribute('aria-busy', 'true');
    btn.setAttribute('aria-pressed', 'true');

    let blocked = false;
    for (let i = 0; i < urls.length; i++) {
      const url = urls[i];
      try {
        const w = window.open(url, '_blank');
        if (!w) {
          blocked = true;
          break;
        }
      } catch (e) {
        console.error('open failed', e);
        blocked = true;
        break;
      }
      // small delay to reduce popup-blocker heuristics
      await new Promise(r => setTimeout(r, 250));
    }

    btn.removeAttribute('aria-busy');
    btn.setAttribute('aria-pressed', 'false');

    if (blocked) {
      // fallback: copy URLs to clipboard so user can paste or open manually
      const text = urls.join('\n');
      try {
        await navigator.clipboard.writeText(text);
        alert('Popup blocked. All URLs were copied to your clipboard. Paste them into a browser or open the links manually.');
      } catch (e) {
        // Clipboard unavailable: show a single text area as a last resort
        const listText = urls.map(u => '- ' + u).join('\n');
        const msg = 'Popup blocked and clipboard not available. Please open the following links manually:\n\n' + listText;
        alert(msg);
      }
    }
  });

  // language switcher used by page
  window.setLanguage = function(lang){
    document.body.setAttribute('data-lang', lang);
    document.querySelectorAll('.lang-btn').forEach(b => b.classList.toggle('active', b.getAttribute('data-lang') === lang));
  };
});

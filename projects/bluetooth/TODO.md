# BT Scanner — TODO / Roadmap

All items below were implemented and QA-verified on 2026-07-06.

## 1. Use `company_identifiers.yaml` for manufacturer names — ✅ DONE
- **Approach:** `fetch('company_identifiers.yaml')` at page load + a ~15-line purpose-built parser
  (the file is perfectly regular `- value:` / `name:` pairs — no YAML library needed).
  Parse into `Map<number, string>`; use it for all manufacturer display names and grouping.
- Keep the small curated SURVEILLANCE / TRACKER ID lists **only for classification**
  (the YAML says who made a chip, not whether it's a surveillance product).
- Add source comment: https://bitbucket.org/bluetooth-SIG/public/src/main/assigned_numbers/company_identifiers/company_identifiers.yaml
- **Caveat:** `fetch()` fails on `file://` pages — fall back to the embedded lists so nothing breaks locally.
- Effort: low-medium. Do this FIRST — items 2, 6 build on the resolved names.

## 2. Sort by proximity or severity — ✅ DONE
- **Approach:** "SORT:" select (LAST SEEN — default / PROXIMITY / SEVERITY) next to the filters.
  - Proximity = RSSI descending (strongest ≈ closest).
  - Severity = surveillance > tracker > normal, RSSI as tie-breaker.
- Reuse `rebuildList()` with a pluggable comparator; re-sorting rides the existing 300 ms
  throttled flush, so no perf cost. Effort: low.

## 3. Hide devices not seen in 10 minutes — ✅ DONE
- **Approach:** toggle button "HIDE STALE"; add `lastSeen >= now - 10 min` to
  `deviceMatchesFilters()`; a 30 s interval re-applies the filter while idle.
- Also raise the bridge's `STALE_AFTER_S` (60 s → 15 min) so the page owns staleness, not the bridge.
- Effort: low.

## 4. First seen / last seen / timeline — ✅ DONE (phase 1; sparkline still optional)
- **Phase 1 (trivial):** card already tracks both — show `FIRST` + `LAST` + "seen for Xm Ys".
- **Phase 2 (optional):** per-device RSSI history (capped ring buffer, ~50 samples) rendered as a
  tiny inline sparkline — gives a visual "was it here all along or did it just arrive?" timeline.
- Effort: low (phase 1) / medium (phase 2).

## 5. Copy / Google / DuckDuckGo buttons next to device name — ✅ DONE
- **Approach:** three small icon buttons in the card header:
  - ⧉ copy → `navigator.clipboard.writeText(name + mfr + id)`
  - `[G]` → `https://www.google.com/search?q=<encoded name/mfr + " bluetooth device">`
  - `[DDG]` → `https://duckduckgo.com/?q=...`
- Use **event delegation** on `#device-list` (cards are re-rendered constantly; per-card
  listeners would be lost/leaked). `encodeURIComponent` everything. Effort: low.

## 6. Per-device notes saved in localStorage — ✅ DONE
- **Approach:** NOTE row with an edit button → inline input; persist as one JSON blob
  (`btscan-notes` key, `{deviceId: text}`). Render through `escapeHTML` (already exists).
- **Caveat to accept:** phones/AirTags rotate their MAC every ~15 min, so notes stick reliably
  only to fixed-address devices (HVAC controllers, headsets, beacons…). Item 7 mitigates this.
- Effort: medium.

## 7. Bundle devices with matching MFR ID + very similar location — ✅ DONE
- "Location" over BLE = signal strength, so bundling means detecting **MAC rotation**:
  the same physical device reappearing under a new random address.
- **Conservative heuristic (minimise false merges):** bundle B into A only when
  - same manufacturer ID, and both nameless (named devices rarely rotate), and
  - A disappeared < 30 s before B first appeared (time-disjoint!), and
  - |RSSI(A) − RSSI(B)| ≤ 8 dBm.
- Bundled card = one entry with alias count + merged first/last-seen span (feeds item 4's timeline).
- Toggle "BUNDLE ROTATING MACS", label results as guesses. RSSI naturally swings ±10 dBm,
  so mis-bundles will happen — keep the raw view one click away. Effort: high.

---
Done so far: bridge architecture, dedupe fix, throttled rendering, filters (type/text/RSSI),
group-by-manufacturer, distance estimate, a11y pass, responsive pass.

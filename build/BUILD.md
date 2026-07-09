# Build toolchain — Energy CRM / HYBRIX marketing site

Source + scripts used to produce the deployed pages (`../product-ro.html`, `../product-en.html`).
The deployed HTML is the source of truth for hosting; this folder documents how it was built and lets it be re-derived.

> Scripts use **absolute Windows paths** for this machine
> (`C:/Users/vladu/Desktop/energy-crm-site/` = repo, `C:/Users/vladu/Desktop/energy_crm_presentation/` = original working dir).
> Run them from `energy_crm_presentation` (where `sc-inject.html` lives) or adjust the `REPO`/`HERE` constants.

## Files
| File | Role |
|---|---|
| `sc-inject.html` | RO **source** of the 4 self-playing showcases + comparison + impact + "Cum funcționează" detail panels (scoped under `.sxwrap`). |
| `sc-inject-en.html` | EN showcase, **generated** by `translate-inject.js` (don't edit by hand). |
| `integrate.js` | Splices the showcase CSS/sections/JS from `sc-inject*.html` into a product page at anchors; idempotent (wraps injected blocks in `<!--SX-->…<!--/SX-->`). |
| `translate-inject.js` | Ordered RO→EN phrase map → writes `sc-inject-en.html`. Edit the map here when showcase copy changes. |
| `add-details.js` | Adds the "Cum funcționează / How it works" expand-panels to `sc-inject.html` (already applied). |
| `ro-terms.js` | **RO terminology layer**, post-injection on `product-ro.html` only (PZU/PI, "Pipeline automat", deviație, precizie, "închiderea porții", "Comandă putere", …). EN never touched. |
| `add-form.js` | Injects the demo lead-capture modal (Nume/Telefon/Email → FormSubmit `contact@progemisoft.com` + `_cc` `alexandru.vladut@progemisoft.com`), rewires demo buttons, shows contact email. Both pages. `<!--LF-->` markers. |
| `prelaunch.js` | Removes the circular `crm.progemisoft.com` button, fixes broken nav anchors (#journey→#s-forecast, #why→#s-compare), injects SEO/OG/Twitter meta. Both pages. |
| `og-gen.js` | Renders the 1200×630 social share card → `../assets/og-image.png`. |
| `audit.js` | Headless pre-launch audit (console errors, broken anchors/images, responsive overflow, modal, toggle). |

## Rebuild order (if `integrate.js` is re-run)
`integrate.js product-ro.html` → `translate-inject.js` → `integrate.js product-en.html sc-inject-en.html` → **`ro-terms.js`** → `add-form.js` → `prelaunch.js`

⚠️ `ro-terms.js` edits live **inside** the injected showcase (SX) block, so they are reverted by any re-integration — always re-run it after `integrate.js`. `add-form.js` / `prelaunch.js` touch base/head/`<!--LF-->` regions and survive re-integration.

## Notes
- No build step for hosting — the deployed HTML is fully static & self-contained (fonts/icons via CDN, images local, form via FormSubmit). Just serve `index.html` + `product-*.html` + `assets/`.
- `../index.html` auto-redirects RO/EN by browser language (relative paths → host-agnostic).

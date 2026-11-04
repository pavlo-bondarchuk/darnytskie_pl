# Verification — 2026-11-04

Browser: Google Chrome, local HTTP server http://127.0.0.1:8765. Manual browser checks used the integrated browser tooling.

## Executed checks

- All four application JavaScript files passed `node --check`.
- Local page, CSS, scripts, fonts, logo and product artwork returned HTTP 200.
- All seven page sections rendered; inspected desktop/mobile hero, catalog, about, locator, mobile menu and mobile product dialog, plus a full-page desktop capture.
- At 390, 768, 1024, 1440 and 1920 CSS pixels, document scrollWidth equalled viewport width: no horizontal document overflow.
- All eight products opened their matching label artwork and titles. Escape closed each native dialog; focus returned to the originating product. The close button and Gdzie kupić action also closed the dialog. Opening a dialog locked background scrolling.
- Mobile menu opened and closed, Escape restored focus, and Shift+Tab from the first link reached the close toggle. All four menu anchors closed the menu and landed below the fixed header, around 70 px from the viewport top.
- Desktop product/about navigation and active section indication were inspected.
- Searching Łódź showed a city-specific, truthful no-confirmed-addresses message. Clearing the field restored the demo state. The decorative demo map remained intact.
- Emulated prefers-reduced-motion: reduce kept all hero title lines visible and the closed dialog hidden. After restoring normal motion and reloading, all title lines reached opacity 1.
- Chrome console contained no JavaScript errors at final review. No completed image had a failed natural width.
- A catalog image sizing issue was found and fixed: label artwork is absolutely fitted into a reserved image area, preventing intrinsic image height from overlapping headings. A later targeted adjustment reserves extra room for the two-line smoked-ears name.

## Captures

- desktop-1440.jpg: 1440 × 1000, hero.
- mobile-390.jpg: 390 × 844, hero.
- catalog-390.jpg: 390 × 844, catalog detail.
- full-page-1440.jpg: desktop full-page capture; fixed header is captured at the current scroll location.

## Scope limits

No physical mobile devices, Safari or Firefox were tested. There are no confirmed stores or contacts, so live availability, Google Maps destinations for real records and messaging were not tested. Nutrition, storage and final Polish commercial naming need approval. Generated gastronomy images are illustrative; original product photography is still needed. No production deployment was performed.

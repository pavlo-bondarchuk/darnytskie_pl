# Motion and product grid review — 2026-11-06

## Changes

- Shared easing and timing for color transitions, controls and product artwork.
- Hover decoration applies to fine hover pointers. Product cards stay on their grid tracks; only their artwork, decorative ring and arrow animate.
- Product entrances fade in without moving the tile. Other reveals use smaller distances and clear temporary animation styles on completion.
- Hero photography is animated by CSS; its wrapper no longer has an overlapping GSAP entrance. Removed the image parallax that could expose empty edges.
- Native product dialogs and mobile navigation use entry and exit transitions, including their backdrops, in browsers supporting discrete display/overlay transitions. Other browsers retain native open/close behavior.
- Motion preference changes affect only this animation module. Lucide icon styles target the rendered SVG elements.

## Verification

Chrome desktop and emulated mobile, local HTTP preview. Ukrainian and Polish product-grid geometry checked at 320, 390, 768, 1024, 1440 and 1920 CSS pixels. All eight tiles match their CSS Grid tracks; maximum measurement discrepancy was below 0.002 px. Gaps are 12 px on desktop, 9 px on tablet and 7 px on mobile. No horizontal document overflow was observed.

All eight internal card hovers respond and return to their baseline without changing card rectangles. Navigation, header CTA, round link, cream/outline/wine buttons, product footer and About links, contact circle, footer navigation, back-to-top, language controls, search clear, menu toggle/close/link and modal close were checked with before/hover/after computed-style snapshots.

Product dialog opening and both Escape/button exit transitions were observed through the Web Animations API. Dialog and menu focus restoration, scroll lock restoration, and menu anchor navigation passed. Touch emulation leaves decorative hover transforms inactive. Initial reduced motion and a live normal/reduced/normal preference round trip keep content available and preserve an unrelated GSAP tween. No application JavaScript exceptions were observed. The preview has an existing missing favicon request.

Initial QA harness failures were corrected or independently rechecked: snapshots taken during a card entrance or header color transition were compared again after settling; menu-close was rechecked with the pointer outside it before the baseline. Temporary QA scripts and their draft reports are outside the repository.

The custom Lucide zoom cursor and full-bleed Vershkova photo are preserved. Real mobile hardware and Safari/Firefox were not tested.

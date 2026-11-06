# Inline product expansion — 2026-11-06

## Interaction

Selecting any of the eight product cards expands that card in place to cover the catalog area. The selected card uses a centered circular reveal that grows with the card; nearby tiles shrink and fade in a short outward wave. Close and Escape reverse the wave and collapse the circle as the original mosaic returns. The motion has no bounce or cursor tracking. Product details and the close control are part of the expanded card; there is no product popup or backdrop. Close and Escape restore the mosaic and return focus to the originating card. The buy link closes the expanded view and moves to the store locator. Resizing restores the mosaic. On smaller screens the expanded area is capped to a viewport-aware height. Reduced motion skips the transition while keeping the same states available.

## Verification

Chrome with the local HTTP preview. All eight cards expanded to the full grid and returned to their original positions. Checked the circular reveal and reverse close, outward shrink/fade, Escape during and after expansion, focus restoration, language switching while expanded, resize reset, store-locator navigation, touch emulation, reduced-motion preference changes, and operation without GSAP or Web Animations API. Desktop and responsive checks passed at 1920, 1440, 1024, 768, 390 and 320 CSS pixels. No application page errors were observed.

Visual snapshots confirmed the full-grid desktop state and the responsive expanded card with its close control and product details. Safari, Firefox and physical mobile devices were not tested.

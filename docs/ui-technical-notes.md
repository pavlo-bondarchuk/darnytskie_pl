# UI technical notes

## Type scale and controls

Use rem-based minimums for responsive text: body copy at 1.125rem, interactive controls at 1rem, and labels at 0.875rem. These map to 18px, 16px, and 14px at the default 16px root size. Recheck computed values at mobile and desktop widths after all CSS overrides load.

## Local fonts

The prototype includes variable WOFF2 subsets for Manrope 400–700 and Oswald 500–700 in `assets/fonts/`. Each family has Latin, Latin Extended, Cyrillic, and Cyrillic Extended subsets, with the SIL Open Font License text beside the files. CSS declares `font-display: swap` and unicode ranges so Polish diacritics and Ukrainian Cyrillic render locally without a Google Fonts request.

## Product labels and illustration provenance

`assets/labels/*.tiff` holds original packaging artwork; same-directory WebP files are display previews. The product JS references WebP previews mapped from the visible label text. They show labels, not actual food cutouts. `assets/products/vershkova.webp` is a 400 × 300 image supplied in upstream change `d6d1d23`; the source and authenticity as a brand product photo have not been independently verified. `assets/lifestyle/hero*.webp` and `table*.webp` are illustrative ImageGen artwork, not verified brand photography. Keep these distinctions in visible descriptions and image alt text.

## Navigation and dialogs

The mobile menu is a native `<dialog>` controlled by a button with `aria-controls` and `aria-expanded`; opening moves focus into the menu, closing can restore focus, Escape closes it, and Tab is contained while open. The product detail view also uses a native dialog. Verify both paths in a browser with keyboard input and assistive-technology semantics; static markup alone does not establish successful behavior.

## Contrast review

Ratios were calculated from the product background values in `js/products.js` and foreground rules in `css/style.css`, using WCAG relative luminance. The current product-card ink pairing passes 4.5:1 for normal text: dark ink on the five light variants ranges from 5.65:1 to 9.19:1; cream ink on the three dark variants ranges from 4.82:1 to 6.00:1.

Several muted foregrounds on light surfaces need review: `#88756a` on cream is 3.77:1; `#827267` on cream is 3.98:1; and map label `#927d67` on `#e7d9c4` is 3.38:1. A tested candidate `#625047` gives 6.56:1 on cream and 5.48:1 on the map background. Recalculate after any color or background changes and inspect text over photographs separately, since the underlying pixels vary.

## Verification boundary

A temporary local copy of axe-core 4.10.3 is available at `qa/axe.min.js` for browser injection. Run it against the final page states and viewport sizes, record the actual results, then remove the temporary script. Automated checks supplement manual keyboard and responsive review; neither this note nor a zero-issue scan alone certifies WCAG conformance.

## 2026-11-05 — Завершення перевірки

Фінальні результати й обмеження: [qa/ACCESSIBILITY.md](../qa/ACCESSIBILITY.md). Перевірено шість ширин обома мовами, 200% текст на 320px і збільшені інтервали. Мобільне фото заповнює hero по висоті без зміни пропорцій. Оновлення не скасовує UK/PL або фото Вершкової з upstream.

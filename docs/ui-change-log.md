# UI change log

## 2026-11-04 — Darnytskie design prototype

- Prototype direction: warm cream and burgundy brand system, oversized display typography, asymmetric product mosaic, illustration-led hero and editorial sections, and a demonstration-only store locator.
- Typography floor requested for readable UI: body text 1.125rem (18px at a 16px root), interactive controls 1rem (16px), and labels 0.875rem (14px). Final browser results are recorded in qa/ACCESSIBILITY.md.
- Added locally hosted variable Manrope (400–700) and Oswald (500–700) WOFF2 files for Latin and Latin Extended characters, with OFL license texts. Local CSS font references return HTTP 200; offline visual rendering remains to be checked.
- Added original SVG logo, original packaging-label TIFFs, and optimized WebP previews. Product-to-label mapping is based on visible Cyrillic package text. Label artwork and generated gastronomy illustrations are disclosed as artwork, not photographs of actual products.
- Added upstream `assets/products/vershkova.webp` from change `d6d1d23`; it is 400 × 300 and its image source/authenticity has not been independently verified.
- Mobile navigation uses a native dialog with explicit open/close controls, expanded state, Escape handling, focus placement and restoration, and a keyboard focus loop. Browser keyboard checks are recorded in qa/ACCESSIBILITY.md.
- Accessibility corrections and the axe-core 4.10.3 browser scan are complete for the recorded scope. No WCAG conformance claim is made.

## 2026-11-05 — Завершення перевірки

Фінальні результати й обмеження: [qa/ACCESSIBILITY.md](../qa/ACCESSIBILITY.md). Перевірено шість ширин обома мовами, 200% текст на 320px і збільшені інтервали. Мобільне фото заповнює hero по висоті без зміни пропорцій. Оновлення не скасовує UK/PL або фото Вершкової з upstream.

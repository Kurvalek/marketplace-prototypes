# Marketplace Prototypes

Static HTML/CSS/JS prototypes of TeePublic + Redbubble marketplace UI. No
framework, no build step. `node serve.js` → http://localhost:4180.

- Content (mock products) lives in `js/products.js`, separate from rendering in
  `js/tiles.js`. Keep new mock content in data files, not in markup.
- Brand styling is scoped by `data-brand` on `<html>` and per-brand class
  prefixes (`tp-`, `rb-`). Keep the two brands' CSS in their own files.
- The control panel (`.panel` in `index.html`) is prototype chrome, not part of
  either brand's UI. New toggles go there.
- Product images are crops of production screenshots; they are placeholders for
  internal prototyping only.

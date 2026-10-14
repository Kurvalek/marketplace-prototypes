# Marketplace Prototypes

Quick, throwaway-friendly prototypes of Articore marketplace UI, with a control
panel to switch between **TeePublic** and **Redbubble**.

## Run it

```
node serve.js
```

Open http://localhost:4180. No install or build step. (Opening `index.html`
directly in a browser also works.)

Add `?brand=redbubble` or `?brand=teepublic` to the URL to open straight into
one brand.

## What's here

| Path | What it is |
| --- | --- |
| `index.html` | Page + control panel |
| `js/products.js` | Mock product data (titles, prices, images) — edit this to change content |
| `js/tiles.js` | Tile markup, one renderer per brand |
| `js/app.js` | Brand switch, sale countdown, favorite toggle |
| `css/base.css` | Page shell + control panel |
| `css/teepublic.css`, `css/redbubble.css` | Brand tile styles |
| `assets/products/` | Product images, cropped from production screenshots |

## Current prototypes

- **Product tiles** — two per brand (a tee and a sticker), mocked from
  production screenshots (Oct 2026).
# marketplace-prototypes

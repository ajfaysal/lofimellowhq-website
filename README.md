# LofiMellowHQ — Official Artist Website

Premium multi-page static website for **LofiMellowHQ**, built for direct deployment on **Cloudflare Pages** using only HTML5, CSS3, and Vanilla JavaScript.

## Highlights

- Luxury, calm, music-first dark interface with glassmorphism and soft glow
- Fully static architecture (no backend, no npm, no framework)
- Reusable JS-rendered components for header, footer, release cards, platform cards, and audio player
- Single source of truth in `config.js` for brand data, releases, social links, streaming links, and metadata
- Modular ES6 JavaScript with dynamic page rendering
- Accessible keyboard-friendly navigation and controls
- SEO-ready metadata, canonical tags, JSON-LD structured data, robots.txt, sitemap.xml, and manifest
- Cloudflare Pages ready (drag-and-drop deploy)

## Project Structure

```text
/
├── index.html
├── music.html
├── discography.html
├── about.html
├── contact.html
├── privacy.html
├── 404.html
├── style.css
├── config.js
├── script.js
├── robots.txt
├── sitemap.xml
├── manifest.webmanifest
├── favicon.svg
├── README.md
└── assets/
    ├── covers/
    ├── fonts/
    ├── icons/
    ├── images/
    └── music/
```

## Content Management

All editable content is centralized in `config.js`:

- Brand name, tagline, description
- Navigation and footer links
- Contact details
- Streaming links and social links
- Release library (albums, EPs, singles, tracks, cover art, credits)
- Page metadata

### Add a New Release

1. Open `config.js`
2. Add a new object to the `RELEASES` array
3. Add local artwork in `assets/covers/`
4. Add optional preview audio in `assets/music/`
5. Add platform links only when official URLs are available

No layout edits are required on `index.html`, `music.html`, or `discography.html`.

## Deployment (Cloudflare Pages)

1. Upload the project root directly to Cloudflare Pages.
2. No build command required.
3. No output directory configuration required.
4. Ensure your custom domain points to the deployed project.

## Performance Notes

- Local WebP artwork with fixed dimensions
- Lazy loading for below-the-fold images
- Minimal vanilla JS with reusable rendering functions
- No dependency bloat

## Accessibility Notes

- Semantic HTML sections and headings
- Visible focus states for interactive controls
- Keyboard-accessible navigation and player controls
- ARIA labels and live regions for dynamic feedback

## Security Notes

- External links open with `target="_blank" rel="noopener noreferrer"`
- Site prepared for HTTPS deployment
- Privacy page included for transparency

---

© LofiMellowHQ. All Rights Reserved.

# LofiMellowHQ — Official Artist Website

Premium multi-page static website for **LofiMellowHQ**, built for direct deployment on **Cloudflare Pages** using only HTML5, CSS3, and Vanilla JavaScript.

## Highlights

- Luxury, calm, music-first dark interface with glassmorphism and soft glow
- Fully static architecture (no backend, no npm, no framework)
- Reusable JS-rendered components for header, footer, release cards, platform cards, and audio player
- Single source of truth in `config.js` for brand data, releases, social links, streaming links, and metadata
- Modular ES6 JavaScript with dynamic page rendering
- WCAG 2.2 AA accessible: keyboard navigation, focus management, screen reader support, skip-to-content, `aria-current`, reduced motion
- SEO-optimized: canonical tags, JSON-LD `@graph` structured data, Open Graph with image dimensions, Twitter Cards, robots.txt, sitemap.xml with `lastmod`
- Cloudflare Pages production-ready with `_headers` (CSP, caching, security) and `_redirects`

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
├── _headers
├── _redirects
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
5. The `_headers` file will automatically apply security headers and cache rules.
6. The `_redirects` file handles URL normalization.

## Performance

- Local WebP artwork with fixed dimensions and lazy loading
- Hero image preloaded with `fetchpriority="high"`
- Google Fonts loaded with `font-display: swap` and preconnect
- Passive scroll listeners for reduced main-thread work
- Minimal vanilla JS with no dependencies
- Cloudflare edge caching via `_headers` (assets: 1 year immutable, CSS/JS: 1 week)

## Accessibility (WCAG 2.2 AA)

- Semantic HTML5 landmarks (`header`, `main`, `footer`, `nav`, `section`)
- Skip-to-content link visible on focus
- Visible `:focus-visible` outlines on all interactive elements
- `aria-current="page"` on active navigation links
- `aria-expanded` on toggles, `aria-live` regions for dynamic feedback
- `role="list"` on styled lists for VoiceOver compatibility
- `prefers-reduced-motion: reduce` disables animations
- Keyboard shortcuts: `Escape` closes mobile menu, `Ctrl/Cmd+K` toggles playback
- Print stylesheet included

## Security

- Content Security Policy via `_headers`
- `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy`
- External links use `target="_blank" rel="noopener noreferrer"` with accessible labels
- Form inputs use proper `type` attributes and client-side validation
- Privacy page included for transparency

## SEO

- Unique `<title>` and `<meta description>` per page
- Open Graph tags with `og:image:width`, `og:image:height`, `og:locale`
- Twitter Card summary_large_image on all pages
- JSON-LD `@graph` with Organization, MusicGroup, WebSite, WebPage, BreadcrumbList, and MusicAlbum schemas
- ISO 8601 durations in MusicRecording structured data
- Canonical URLs (homepage uses `/`, 404 has no canonical)
- `sitemap.xml` with `<lastmod>` dates
- `robots.txt` disallows `/404.html`

---

&copy; LofiMellowHQ. All Rights Reserved.

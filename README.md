# Restaurant Cambodia — landing page

A flat-file, single-page site for **restaurant-cambodia.com**, the service
that sells websites to restaurant owners in Cambodia. Plain HTML/CSS/JS, no
framework, no build step, deployable straight to Cloudflare Pages.

## What's in this folder

| File | Purpose |
|---|---|
| `index.html` | The full page: hero, problem, benefits, live example, pricing, how it works, about, FAQ, final CTA, footer. English only. |
| `styles.css` | All styles. Mobile-first, CSS custom properties at the top of the file (`--chili`, `--turmeric`, `--cream`, `--charcoal`) for one-place re-theming. |
| `script.js` | Telegram-link injection — reads one config object and points every "Message on Telegram" button/link at it. |
| `images/` | One real photo plus a couple of remaining placeholders (see below). |
| `favicon.svg` | Site icon. |
| `robots.txt` / `sitemap.xml` | Crawl config. |
| `_headers` | Cloudflare Pages cache/security headers. |

## Placeholders you still need to replace before launch

### 1. Telegram handle — already set
`script.js` now points every "Message me on Telegram" button (header,
hero, pricing ×3, sticky mobile bar, final CTA band, footer) and the
JSON-LD `sameAs` entry at `@PhnomPenhinfo`:
```js
var CONFIG = {
  telegramHandle: "PhnomPenhinfo",
  demoUrl: ""    // ← still needs the live demo site URL
};
```
If the handle ever changes, this one line is the only place to edit it.

### 2. Live demo URL
Same `CONFIG.demoUrl` field above. Until it's filled in, the "Live example"
section's link points at `#`. Once you have a real demo restaurant site
live, drop its URL in and the "Visit the live demo →" text link (and the
mockup itself) will point to it.

### 3. Photos (in `images/`)

| File | Used for | Status |
|---|---|---|
| `images/restaurantcambodia-hero1.webp` | Hero photo inside both the phone mockup and the "Live example" browser mockup (same file, fetched once and reused — see below) | Real, AI-generated interior photo. Swap for an actual client/demo restaurant photo whenever you have one, keeping the filename or updating the two `<img src>` references in `index.html`. |
| `images/about-photo-placeholder.svg` | About section | Still a placeholder. Replace with a real photo of you, square crop, ~280×280 (displayed at 140×140, so export at 2x for retina). |
| `images/og-image.png` | Open Graph / Facebook + Twitter share preview | Already a real 1200×630 PNG (generated, branded, on-theme), but swap it for a version with your actual name/photo once you have one. This is what shows up when the link is shared on Facebook — check it with a link-preview debugger before announcing the site. |

The phone mockup and the live-example browser frame are both built as real
HTML/CSS ("demo mini-webpage" markup: `.demo-nav`, `.demo-hero`,
`.demo-menu-grid`, etc. in `styles.css`), not flat images — the hero photo
is the *only* actual image request either one makes, and since both use
the exact same `<img src="images/restaurantcambodia-hero1.webp">`, the
browser fetches and caches it once and reuses it in both places. If you
replace it, keep the `width="1536" height="1024"` attributes in sync with
the new file's real pixel dimensions (or just remove them if the new photo
has a different size — the layout uses `object-fit: cover` so any
reasonably landscape photo will crop in nicely).

### 4. Personal details
- **Name** — already set: "Heng Sovann Ratana" in the About section
  heading and signature in `index.html`.
- **Phone number** — footer, currently `+855 12 345 678`
  (`tel:+855123456789` href in `index.html`) — still a placeholder.
- **Facebook page** — footer link, currently
  `https://www.facebook.com/restaurantcambodia`, and in the JSON-LD
  `sameAs` array in `<head>` — still a placeholder.

### 5. Domain-dependent SEO fields
Once deployed, double check these all point at the real final domain
(they're already set to `https://restaurant-cambodia.com/`, update only if
you deploy elsewhere or add a custom domain later):
- `<link rel="canonical">` in `index.html`
- `og:url`, `og:image`, `twitter:image` in `index.html`
- `url` and `image` in the JSON-LD `ProfessionalService` block
- `Sitemap:` line in `robots.txt`
- `<loc>` in `sitemap.xml`

## Publishing to Cloudflare Pages

1. Fill in the placeholders above (at minimum: Telegram handle).
2. In the Cloudflare dashboard: **Workers & Pages → Create → Pages →
   Upload assets**, and upload every file in this folder as-is (flat, no
   subfolders except `images/`).
   - Or connect this GitHub repo directly (**Pages → Create → Connect to
     Git**) with build command empty and output directory `/` — it's a
     static site, no build step.
3. Attach the custom domain (`restaurant-cambodia.com`) under **Custom
   domains** and follow the DNS instructions.
4. Submit `sitemap.xml` in **Google Search Console** and request indexing
   for the homepage.
5. Validate the Open Graph output with a link-preview debugger (e.g. paste
   the URL into a new Facebook post and check the preview, then delete the
   post) and the JSON-LD with Google's Rich Results Test before announcing
   the site.
6. Run Lighthouse (mobile) on the deployed URL — everything here was built
   for a 95+ mobile score (inlined critical CSS, no render-blocking JS,
   zero external JS libraries, lazy-loaded below-the-fold images), but real
   photos in `images/` can affect it if they're large — export them as
   WebP and keep them reasonably sized.

### A note on `_headers` caching
`_headers` sets `styles.css`, `script.js`, `images/*`, and `favicon.svg` to
cache for a year (`immutable`). That's great for repeat-visitor speed, but
it means if you edit `styles.css` or `script.js` after launch, returning
visitors' browsers (and Cloudflare's edge cache) may keep serving the old
version until the cache expires. After an edit, either purge the cache in
the Cloudflare dashboard, or rename the file and update the `<link>`/
`<script>` tag in `index.html` to bust the cache.

## Design notes

- **Palette** (from the brand swatches supplied, a dusk-lake photo): near-
  black deep teal `#061417` (text, darkest sections), deep navy `#012C3C`
  (secondary text, alt dark tone), steel blue `#285669` (primary accent:
  buttons, links, icons on light backgrounds), warm taupe `#928477`
  (alternate section backgrounds, muted text on dark), light greige
  `#C6BFBB` (page background). All as CSS custom properties at the top of
  `styles.css` (`--chili` now holds the steel-blue value, `--turmeric` a
  lighter tint of it used specifically for icons/labels sitting on the
  dark `--charcoal` sections — kept the original variable *names* so the
  rest of the stylesheet didn't need touching, only re-themed the values).
  Note this palette's accent (`--chili`) is a mid-tone rather than a light
  "pop" color like a previous gold accent was, so buttons/badges built on
  it use light text (white), not dark text, to stay readable, and a
  separate lighter `--turmeric` tint covers icons on dark backgrounds
  where the base accent alone wouldn't have enough contrast.
- **Font: Google Sans everywhere.** "Google Sans" isn't a redistributable
  web font — Google doesn't publish it on Google Fonts — so the stack
  requests it *by name* first (`"Google Sans", "Google Sans Text"`), which
  resolves automatically for any visitor who already has it installed
  locally (ChromeOS, Android, Google Workspace apps), and falls back to
  **Roboto** for everyone else — Google's own open font and Google Sans's
  metrically-closest sibling. If you have a licensed copy of the actual
  Google Sans font files, self-hosting them via `@font-face` in
  `styles.css` (above the current `--font-display`/`--font-body`
  declarations) will give a pixel-perfect match for every visitor instead
  of relying on the fallback.
- No external JS libraries — `script.js` is vanilla JS, ~60 lines, no
  dependencies.
- English only, with no mention of Khmer anywhere on the page. There's no
  language toggle (an earlier version had an EN/Khmer switch; removed),
  and the copy that used to advertise the *delivered restaurant websites*
  supporting English + Khmer visitors (hero trust badge, a benefit card,
  two pricing feature bullets) has been swapped out: the hero badge now
  reads "One flat yearly price", and the benefit card is now "Direct
  support, not a ticket queue".
- Sticky bottom "Message on Telegram" bar shows on mobile only (below the
  960px breakpoint, where the header CTA is hidden instead).
- **Motion**: the hero phone mockup gently floats (CSS `@keyframes`, pure
  transform, GPU-cheap). Sections/cards fade+rise into view on scroll via
  a `.reveal`/`.reveal-scale` class pair — `script.js`'s
  `initScrollReveal()` uses one shared `IntersectionObserver` to add
  `.in-view` the first time each element crosses into the viewport, then
  stops watching it (so it never re-fires on scroll-back). Cards/buttons
  also get a hover lift + shadow. Everything respects
  `prefers-reduced-motion: reduce` — the CSS media query at the bottom of
  `styles.css` disables the float animation and all transitions, and
  shows every `.reveal` element at full opacity immediately instead of
  waiting on the observer.

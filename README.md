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
| `images/` | Placeholder graphics (see below — all need replacing). |
| `favicon.svg` | Site icon. |
| `robots.txt` / `sitemap.xml` | Crawl config. |
| `_headers` | Cloudflare Pages cache/security headers. |

## Placeholders you need to replace before launch

Everything below is a stand-in. Nothing here is real business data.

### 1. Telegram handle (most important — every CTA depends on this)
Edit **one line** in `script.js`:
```js
var CONFIG = {
  telegramHandle: "restaurant_cambodia", // ← put your real @handle here
  demoUrl: ""                             // ← paste the live demo site URL here
};
```
All "Message me on Telegram" buttons (header, hero, pricing ×3, sticky
mobile bar, final CTA band, footer) read from this one constant.

### 2. Live demo URL
Same `CONFIG.demoUrl` field above. Until it's filled in, the "Live example"
section's link points at `#`. Once you have a real demo restaurant site
live, drop its URL in and both the browser-mockup image and the "Visit the
live demo →" text link will point to it.

Also consider swapping `images/live-example-screenshot.svg` for an actual
screenshot of that demo site (see image list below).

### 3. Photos (in `images/`)
All current images are hand-drawn SVG placeholders so the page never shows
a broken image, but they are **not real photos**. Replace with real WebP
images, keep the same filenames (or update the `src` in `index.html`), and
keep the `width`/`height` attributes matching the new file's actual pixel
size so the layout doesn't shift on load:

| File | Used for | Replace with |
|---|---|---|
| `images/hero-example-site.svg` | Phone mockup screen in the hero | A real screenshot of a client site or the demo site, portrait crop, ~276×598 |
| `images/live-example-screenshot.svg` | "Live example" section | A real screenshot of the demo restaurant site, ~640×420 |
| `images/about-photo-placeholder.svg` | About section | A real photo of you, square crop, ~280×280 (displayed at 140×140, so export at 2x for retina) |
| `images/og-image.png` | Open Graph / Facebook + Twitter share preview | Already a real 1200×630 PNG (generated, branded, on-theme), but swap it for a version with your actual name/photo once you have one. This is what shows up when the link is shared on Facebook — check it with a link-preview debugger before announcing the site. |

The hero phone mockup and the live-example browser frame (nav dots, URL
bar) are built with CSS in `styles.css` / `index.html` — you don't need an
image for those parts, only for the screenshots inside them.

### 4. Personal details
- **Name** — `index.html`, About section (`Hi, I'm [Your Name].` and the
  `— [Your Name], founder` signature).
- **Phone number** — footer, currently `+855 12 345 678`
  (`tel:+855123456789` href in `index.html`).
- **Facebook page** — footer link, currently
  `https://www.facebook.com/restaurantcambodia`, and in the JSON-LD
  `sameAs` array in `<head>`.

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

- **Palette** (from the brand swatches supplied): near-black navy `#0D1419`
  (text, dark sections), slate `#253A4A` (secondary text/dark accents),
  warm gold `#E0A840` (primary accent — buttons, links, icons), greige
  `#CDC6B6` (alternate section backgrounds, muted text on dark), cream
  `#F7F4E3` (page background). All as CSS custom properties at the top of
  `styles.css` (`--chili` now holds the gold value, `--turmeric` the slate
  value — kept the original variable *names* so the rest of the stylesheet
  didn't need touching, only re-themed the values).
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
- No external JS libraries — `script.js` is vanilla JS, ~20 lines, no
  dependencies.
- English only — there's no language toggle. (An earlier version of this
  page had an EN/Khmer switch; it's been removed. Some benefit/pricing
  copy still mentions that the *delivered restaurant websites* support
  English + Khmer visitors — that's a product feature being sold, not a
  language option on this marketing page itself.)
- Sticky bottom "Message on Telegram" bar shows on mobile only (below the
  960px breakpoint, where the header CTA is hidden instead).

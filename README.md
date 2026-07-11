# Restaurant Cambodia — landing page

A flat-file, single-page site for **restaurant-cambodia.com**, the service
that sells websites to restaurant owners in Cambodia. Plain HTML/CSS/JS, no
framework, no build step, deployable straight to Cloudflare Pages.

## What's in this folder

| File | Purpose |
|---|---|
| `index.html` | The full page: hero, problem, benefits, live example, pricing, how it works, about, FAQ, final CTA, footer. English only. |
| `styles.css` | All styles. Mobile-first, CSS custom properties at the top of the file (`--chili`, `--turmeric`, `--cream`, `--charcoal`) for one-place re-theming. |
| `script.js` | Telegram-link injection, scroll-reveal motion, and the lead-form submit handler — reads one config object at the top of the file. |
| `images/` | One real photo plus a couple of remaining placeholders (see below). |
| `favicon.svg` | Site icon. |
| `robots.txt` / `sitemap.xml` | Crawl config. |
| `_headers` | Cloudflare Pages cache/security headers. |
| `n8n-lead-form-workflow.json` | Importable n8n workflow that receives the lead form's submissions, notifies you on Telegram, and logs them to a Google Sheet. Not deployed as part of the site itself — see "Lead form + n8n workflow" below. |

## Placeholders you still need to replace before launch

### 1. Telegram handle — already set
`script.js` now points every "Message me on Telegram" button (header,
hero, pricing ×3, sticky mobile bar, final CTA band, footer) and the
JSON-LD `sameAs` entry at `@PhnomPenhinfo`:
```js
var CONFIG = {
  telegramHandle: "PhnomPenhinfo",
  demoUrl: "",         // ← still needs the live demo site URL
  formWebhookUrl: ""   // ← still needs your n8n webhook URL, see below
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

## Lead form + n8n workflow

The final section of the page ("Ready to be found on Google?") now has a
small form under the Telegram button — restaurant name, your name, a phone
or Telegram contact, and an optional message — for visitors who'd rather
type than open Telegram. It's a plain HTML form; `script.js`'s
`initLeadForm()` intercepts the submit, does a little client-side
validation, and POSTs JSON to whatever URL you put in
`CONFIG.formWebhookUrl`. Until that's set, submitting shows a friendly
"this form isn't connected yet, message me on Telegram instead" message
instead of failing silently.

It also has a **honeypot** field (`website`) that's hidden from real
visitors via the same `.visually-hidden` CSS class used for the skip link,
with `tabindex="-1"` so keyboard users never land on it. If it's filled
in, the JS assumes it's a bot, shows the normal "success" message, and
never actually calls the webhook — and the n8n workflow re-checks the same
field server-side, in case a bot posts straight to the webhook URL without
running the page's JS at all.

### Setting up the n8n side

`n8n-lead-form-workflow.json` in this folder is a full workflow, ready to
import:

**Webhook → Format Lead → Validate Lead → (Telegram + Google Sheets) → Respond**

1. In n8n: **Workflows → Import from File**, pick
   `n8n-lead-form-workflow.json`. (Any n8n instance works — n8n Cloud or
   self-hosted.)
2. **Telegram credential**: message [@BotFather](https://t.me/BotFather)
   on Telegram, run `/newbot`, and copy the bot token it gives you into a
   new *Telegram API* credential in n8n. Then message your new bot once
   from your own Telegram account (anything, e.g. "hi") so it has a chat
   to reply into, and find your numeric chat ID by opening
   `https://api.telegram.org/bot<YOUR_TOKEN>/getUpdates` in a browser —
   it's the `"chat":{"id": ...}` value. Paste that number into the
   **Notify Owner on Telegram** node's `Chat ID` field (replacing
   `REPLACE_WITH_YOUR_TELEGRAM_CHAT_ID`).
3. **Google Sheets credential** (optional but included by default): create
   a blank Google Sheet with a tab named `Leads`, connect a *Google Sheets
   OAuth2* credential in n8n, and put the sheet's ID (the long string in
   its URL between `/d/` and `/edit`) into the **Log Lead to Google
   Sheet** node, replacing `REPLACE_WITH_YOUR_GOOGLE_SHEET_ID`. Don't want
   a spreadsheet log? Just delete this node and reconnect **Notify Owner
   on Telegram** straight to **Respond Success**.
4. Click each node with a red "set up credential" warning and pick the
   credential you just created (n8n won't reuse them automatically across
   an import).
5. **Activate** the workflow (top-right toggle). Open the **Lead Form
   Webhook** node and copy its **Production URL** (not the Test URL —
   that only works while the workflow editor is open).
6. Paste that URL into `CONFIG.formWebhookUrl` in `script.js`, redeploy,
   and submit the form once yourself to confirm the Telegram message and
   sheet row both show up.

If your n8n instance rejects the import because of a node version
mismatch (n8n's node schemas shift between releases), the fix is usually
to delete just that node and re-add the same node type fresh from the
panel — the workflow's shape (five steps: webhook, format, validate,
notify, respond) is simple enough to rebuild by hand in a few minutes if
needed.

### CORS
Browsers block cross-origin `fetch()` calls unless the server allows it.
n8n's Webhook node allows all origins by default; if you see a CORS error
in the browser console after wiring up the real URL, open the **Lead Form
Webhook** node → **Options** → **Allowed Origins (CORS)** and set it to
`*` or `https://restaurant-cambodia.com`.

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
- No external JS libraries — `script.js` is vanilla JS, ~160 lines
  (Telegram links, scroll-reveal, lead-form submit), no dependencies.
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

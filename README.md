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
| `n8n-lead-form-workflow.json` | *Optional, not used by default.* An importable n8n workflow that receives lead-form submissions, notifies you on Telegram, and logs them to a Google Sheet — an alternative to Formspree's plain email notifications if you want more automation later. See "Lead form" below. |

## Placeholders you still need to replace before launch

### 1. Telegram handle and lead form — already set
`script.js` now points every "Message me on Telegram" button (header,
hero, pricing ×3, sticky mobile bar, final CTA band, footer) and the
JSON-LD `sameAs` entry at `@PhnomPenhinfo`, and the lead form at the
Formspree endpoint `https://formspree.io/f/mvzepopk`:
```js
var CONFIG = {
  telegramHandle: "PhnomPenhinfo",
  demoUrl: "",              // ← still needs the live demo site URL
  formspreeId: "mvzepopk"
};
```
If either ever changes, these are the only lines to edit — the Formspree
ID is also set as the lead form's static `action` attribute in
`index.html` (a no-JS fallback; see "Lead form" below), so update that
too if you switch to a different Formspree form.

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

## Lead form

The final section of the page ("Ready to be found on Google?") has a
small form under the Telegram button — restaurant name, your name, a phone
or Telegram contact, and an optional message — for visitors who'd rather
type than open Telegram. It's a plain HTML form pointed at your real
Formspree endpoint (`https://formspree.io/f/mvzepopk`, both as the form's
static `action` attribute and in `CONFIG.formspreeId`), so it works even
if JavaScript fails to load (plain POST, browser redirects to Formspree's
default "thanks" page). When JS *is* available — the normal case —
`script.js`'s `initLeadForm()` intercepts the submit instead, does a
little client-side validation, and POSTs via `fetch()` with
`Accept: application/json` so the page can show an inline status message
without navigating away. This is the same underlying request Formspree's
own `@formspree/ajax` library sends; it's hand-rolled here instead of
pulled in from their CDN to keep the site at zero external JS
dependencies (see "Design notes" below).

It also has a **honeypot** field (`_gotcha`, Formspree's own convention
for this) that's hidden from real visitors via the same `.visually-hidden`
CSS class used for the skip link, with `tabindex="-1"` so keyboard users
never land on it. If it's filled in, the JS assumes it's a bot, shows the
normal "success" message, and never actually calls Formspree — and
Formspree re-checks the same field server-side too, in case a bot posts
straight to the endpoint without running the page's JS at all.

### Formspree setup — already done
The Formspree form is created and wired in (`mvzepopk`). What's left:

1. Submissions land as email to the address on your Formspree account by
   default — check **Settings → Notifications** on the form at
   [formspree.io](https://formspree.io) to confirm/change recipients.
2. Deploy, then submit the form once yourself to confirm the email
   actually arrives (and check spam/junk the first time).
3. Keep an eye on the free plan's submission limit (50/month at time of
   writing — check [formspree.io/plans](https://formspree.io/plans) for
   current limits); it stops accepting new submissions once you hit it
   until the month resets or you upgrade.
4. No CORS setup needed — Formspree's AJAX endpoint explicitly supports
   cross-origin `fetch()` requests out of the box.

If you ever create a different Formspree form, update it in **two**
places: `CONFIG.formspreeId` in `script.js`, and the form's `action`
attribute in `index.html`.

### Optional: swap in the n8n workflow instead

`n8n-lead-form-workflow.json` is a complete, importable n8n workflow
(**Webhook → Format Lead → Validate Lead → Telegram notification → Google
Sheets log → Respond**) for later, if plain email notifications stop
being enough and you want a Telegram ping plus a running spreadsheet of
every lead instead. It's not wired up by default. To use it:

1. In n8n: **Workflows → Import from File**, pick
   `n8n-lead-form-workflow.json`. (n8n Cloud or self-hosted both work.)
2. **Telegram credential**: message [@BotFather](https://t.me/BotFather)
   on Telegram, run `/newbot`, and copy the bot token into a new
   *Telegram API* credential in n8n. Message your new bot once from your
   own account (anything, e.g. "hi") so it has a chat to reply into, then
   find your numeric chat ID at
   `https://api.telegram.org/bot<YOUR_TOKEN>/getUpdates` — it's the
   `"chat":{"id": ...}` value. Paste it into the **Notify Owner on
   Telegram** node's `Chat ID` field, replacing
   `REPLACE_WITH_YOUR_TELEGRAM_CHAT_ID`.
3. **Google Sheets credential**: create a blank sheet with a tab named
   `Leads`, connect a *Google Sheets OAuth2* credential in n8n, and put
   the sheet's ID (the long string in its URL between `/d/` and `/edit`)
   into the **Log Lead to Google Sheet** node, replacing
   `REPLACE_WITH_YOUR_GOOGLE_SHEET_ID`. Don't want the spreadsheet log?
   Delete this node and reconnect **Notify Owner on Telegram** straight to
   **Respond Success**.
4. Click each node with a red "set up credential" warning and pick the
   credential you just made (n8n doesn't reuse credentials across an
   import automatically).
5. **Activate** the workflow, open the **Lead Form Webhook** node, and
   copy its **Production URL** (not the Test URL, which only works while
   the editor is open).
6. In `index.html`/`script.js`, switch the form to post there instead of
   Formspree: change `initLeadForm()`'s `endpoint` to
   `https://your-n8n-instance/webhook/restaurant-cambodia-lead`, and swap
   the `fetch()` call's `body` from `new FormData(form)` back to a JSON
   payload (`JSON.stringify({...})`), since this workflow's **Format
   Lead** node expects `$json.body.<field>` — a JSON request body, not
   multipart form data. Also rename the honeypot input back from
   `_gotcha` to something like `website` if you'd rather it not collide
   with Formspree's convention, and update the **Validate Lead** node's
   condition to match.
7. If n8n's import complains about a node version mismatch (schemas shift
   between n8n releases), delete just that node and re-add the same node
   type fresh from the panel — the workflow's shape (five steps: webhook,
   format, validate, notify, respond) is simple to rebuild by hand.
8. n8n's Webhook node allows all origins by default; if a CORS error shows
   up in the browser console, open the **Lead Form Webhook** node →
   **Options** → **Allowed Origins (CORS)** and set it to `*` or
   `https://restaurant-cambodia.com`.

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

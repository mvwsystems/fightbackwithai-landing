# Fight Back with AI — Landing Page (v2)

Static landing page for the free weekly newsletter for solopreneurs. No build step, no framework. Plain HTML, CSS, JS.

## Files
- `index.html` — the page (hero, sales letter sections, CTA, footer)
- `styles.css` — all styling; tokens at the top
- `script.js` — scroll-reveal, and the signup form's fetch to `/api/subscribe`
- `netlify/functions/subscribe.mjs` — server-side beehiiv proxy; holds the API key
- `netlify.toml` — publish root, security and cache headers
- `og-image.png` — 1200×630 share image (add before launch; see below)
- `CLAUDE.md` — rules for Claude Code and any editor
- `soul.md` / `audience.md` / `voice.md` / `design.md` — brand context

## Before launch
1. **beehiiv API key.** The signup form is wired to beehiiv already. It needs the key:
   ```bash
   netlify env:set BEEHIIV_API_KEY "<your beehiiv API key>"
   netlify api createSiteBuild --data '{"site_id":"c5694999-122d-4a69-b6dc-ad87774c39a5"}'
   ```
   Get the key from beehiiv → Settings → API. Until it is set, the form returns
   "Signup is not configured yet." Never put the key in `index.html` or `script.js`.
2. **Sample issue link.** Replace the `href="#"` on “Read this issue →”.
3. **Ledger rows.** Swap the four placeholder rows for real shipped issues.
4. **og-image.png.** Export from the Brand Kit at 1200×630 and drop it in this folder. The `<meta>` tags already point at `/og-image.png`.

## Weekly
Update the “This week” teaser under the signup form (marked `Update weekly`). Add a row to the ledger when an issue ships.

## Deploy
Live at **https://fightbackwithai.netlify.app** — auto-deploys on every push to `main`.

- Repo: `mvwsystems/fightbackwithai-landing`
- Netlify project: `fightbackwithai` (Superhuman Systems team)
- No build command; publish directory `.` (set in `netlify.toml`)

Push to `main` and Netlify rebuilds. To put the site on `fightbackwithai.com`, add the
domain under Netlify → Domain management and follow the DNS instructions.

## Signup form
The form posts to `/api/subscribe`, a Netlify function that calls beehiiv's
subscriptions API with `BEEHIIV_API_KEY`. The key is a secret and must stay
server-side — a static page cannot hold it without publishing it.

With JS off, the form falls back to its `action`, beehiiv's hosted subscribe
page, so signup still works. Success copy follows the `status` beehiiv returns,
so it reads correctly with or without double opt-in.

## Editing rules
Read `CLAUDE.md`. Short version: one accent color, two typefaces, square corners, no new components, no hype.

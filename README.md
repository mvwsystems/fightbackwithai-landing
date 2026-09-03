# Fight Back with AI — Landing Page (v2)

Static landing page for the free weekly newsletter for solopreneurs. No build step, no framework. Plain HTML, CSS, JS.

## Files
- `index.html` — the page (hero, sales letter sections, CTA, footer)
- `styles.css` — all styling; tokens at the top
- `script.js` — scroll-reveal only
- `netlify.toml` — publish root, security and cache headers
- `og-image.png` — 1200×630 share image (add before launch; see below)
- `CLAUDE.md` — rules for Claude Code and any editor
- `soul.md` / `audience.md` / `voice.md` / `design.md` — brand context

## Before launch
1. **beehiiv form.** In `index.html`, find the `BEEHIIV` comment. Either paste the beehiiv embed iframe in place of the `<form>`, or set the form's `action` to your subscribe URL.
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

## Editing rules
Read `CLAUDE.md`. Short version: one accent color, two typefaces, square corners, no new components, no hype.

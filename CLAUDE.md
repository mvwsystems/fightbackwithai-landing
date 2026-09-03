# CLAUDE.md — Fight Back with AI landing page

Plain static site. `index.html` + `styles.css` + `script.js`. No build step, no npm, no framework. Deployed on Netlify from the repo root.

## Before any change, read
- `soul.md` — why this exists
- `audience.md` — who it's for and the constraints that follow
- `voice.md` — how copy is written (Kennedy structure, Welsh voice)
- `design.md` — tokens, type, rules; the do-not list is binding

## Hard rules
- Colors: only the six tokens at the top of `styles.css`. Crimson `#c1121f` is the single accent.
- Type: Archivo Black for headings (Title Case), Archivo for everything else. No third face.
- One accent word or phrase per headline, wrapped in `<em>`. Never two.
- Border-radius is 0 everywhere. Shadows only on white cards, and only the two existing values.
- The outline bolt is the only illustration. No icons, emoji, stock photos, badges, logos, or star ratings.
- No exclamation points in copy. No “AI-powered”, “cutting-edge”, “unlock”, “supercharge”, “game-changer”, “10x”, “leverage”.
- Dollar figures describe the model taught, never a promised outcome. Do not add income language.
- Every new section uses the existing vocabulary: `.eyebrow` + `h2`, `.cols`/`.col`, `.two-up` + `.note`, `.card`. If a change needs a new component, it's probably overbuilt.
- `prefers-reduced-motion` stays respected. Page must render fully without JS.
- Test at 375px. Columns collapse; the ledger stacks.

## Marked edit points in index.html
- `BEEHIIV` — signup form / embed
- `Update weekly` — the This Week teaser
- `Replace these rows` — the ledger
- “Read this issue →” — sample issue link

## Copy calibration
These lines are the register. New copy must sit beside them without embarrassing them:
- “If we can't put a number on it, we don't send it.”
- “Done is better than perfect.”
- “Run your last real proposal through the stack tonight. Compare.”

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

## Intake page (/intake)
- `intake.html` at the root, served at `/intake` via a rewrite in `netlify.toml`. It is the
  application form for the free productize-and-automate engagement, linked from the
  done-for-you line above the closing CTA.
- `netlify/functions/intake.mjs` handles `POST /api/intake`: validates, runs the Productize
  Brain (Phase 1) over the submission via the Anthropic API, then emails the brief, the raw
  answers and a JSON attachment through Resend. `prompts/productize-brain.md` is the system
  prompt, shipped with the bundle via `included_files` in `netlify.toml` — keep that entry.
- Env vars: `ANTHROPIC_API_KEY`, `RESEND_API_KEY`, `INTAKE_FROM` (a sender on a
  Resend-verified domain). Optional: `INTAKE_TO` (default hello@6signal.co),
  `ANTHROPIC_MODEL` (default claude-fable-5-1). Without these the form accepts input and
  then fails to deliver, so set them before pointing anyone at the page.
- `intake.html` keeps its own `<style>` block rather than linking `styles.css`: `.col`,
  `.wrap`, `.fine`, `.label` and `.meta` exist in both and would break the form. Its `:root`
  mirrors the six tokens exactly — if you change a token in `styles.css`, change it here too.

## Waitlist page (/waitlist)
- `waitlist.html` at the root, served at `/waitlist` via a rewrite. It links `styles.css`
  and reuses the landing page components; the only new CSS is the `.wl-*` block, because
  `.signup-row` fits one field beside a button and this form stacks three.
- `netlify/functions/waitlist.mjs` handles `POST /api/waitlist`. Looks the address up by
  email, then creates (welcome email on) or updates (welcome email off) so nobody is
  duplicated or welcomed twice.
- Waitlist signups are separated by `utm_source=waitlist-page`, which beehiiv stores as
  `acquisition_source`. Subscriber tags are deliberately not used: the publication is on
  the free Launch plan. Filter or segment on acquisition source in the beehiiv UI.
- `custom_fields` (`community_waitlist`, `first_name`, `ai_job`) are sent optimistically.
  beehiiv discards names that do not exist on the publication, so the signup works whether
  or not they have been created. Until they exist, those answers are not stored anywhere.
- Env vars: `BEEHIIV_API_KEY`, `BEEHIIV_PUBLICATION_ID`. Both must carry a value in the
  context you are running in — a name with an empty value reads as unconfigured.

## Copy calibration
These lines are the register. New copy must sit beside them without embarrassing them:
- “If we can't put a number on it, we don't send it.”
- “Done is better than perfect.”
- “Run your last real proposal through the stack tonight. Compare.”

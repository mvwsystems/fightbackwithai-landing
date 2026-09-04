# design.md — the flat editorial system

Codified from the live page. Match the site from this document alone. Supersedes every prior kit, including the sunset print-shop system.

## Color
- Ground `#f4f2ee` — page canvas, flat. Never a texture, never dark.
- Ink `#0f0f0f` — headlines, body, strong rules.
- Crimson `#c1121f` — the one accent. Eyebrows, the accent word in each headline, the “AI” in the wordmark, buttons, links, bolt strokes.
- Rule grey `#d8d2c8` — hairline dividers.
- Muted `#5a554f` — secondary text, tracked-caps metadata.
- White `#ffffff` — card surfaces only, always with a 1px ink or crimson border.

Hover: crimson ↔ ink swap. Selection: crimson ground, cream text. No gradients. No other hues.

## Type
Google Fonts: Archivo (400/500/600/700, italics) and Archivo Black.
- Display: Archivo Black 400, Title Case, line-height .96–1.05, letter-spacing −.025em (large) to −.01em (small). H1 `clamp(52px, min(7.2vw, 15.5cqi), 104px)` — the `cqi` term sizes it against the hero
copy column (a container), which stops growing at ~512px once `.wrap` hits its 1200px cap; without it the
three `<br>` lines break apart on laptops; H2 `clamp(34px, 4.4vw, 54px)`; CTA H2 `clamp(40px, 5.6vw, 76px)`; H3 21px; numerals 13–19px.
- Body: Archivo 400, 15–19px, line-height 1.55–1.6. `text-wrap: pretty`.
- Eyebrow: Archivo 700, 11px, letter-spacing .18em, uppercase, crimson.
- Meta: Archivo 600, 10px, letter-spacing .16em, muted.
- Wordmark: Archivo 700, letter-spacing .06em, “AI” in the opposing color, bolt at left with 9px gap. Nav runs crimson with ink “AI”; footer runs ink with crimson “AI”.

## Rules and borders
- Hairline: 1px rule grey (section dividers, list rows).
- Strong: 1px ink (card frames, footer top).
- Column/list top: 2px ink; one column per set takes 2px crimson (the last, or the one to emphasize).
- Underline link: 2px crimson bottom border, 2px padding.
- Border-radius: 0 everywhere.
- Shadows: cards only. `0 2px 10–12px rgba(15,15,15,.07)` or `0 4px 18px rgba(15,15,15,.09)` for the tilted hero card.

## The bolt
SVG, outline only, the sole illustration.
```
viewBox="0 0 120 200"
path d="M76 12 L26 108 L58 108 L44 188 L100 84 L66 84 Z"
fill="none" stroke-linejoin="round"
```
Stroke width scales inversely with size: 14 at 11–13px wide, 10 at 22px, 9 at 30px. Stroke is ink, crimson, or cream on an inverted ground.

## Spacing
- Column: max-width 1200px, gutters `clamp(20px, 4vw, 48px)`.
- Sections: 100px vertical (72px under 480px). Header 34px top. Footer 26/30px.
- Rhythm: eyebrow → 14 → heading → 18 → sub → 44/52 → grid. Rows 16–18px vertical.
- Grids: `auto-fit` with 260–340px minimums, gap `clamp(24px, 3vw, 44px)`.

## Components on the page
Eyebrow + H2 section head · three-column and two-column `.col` grids with 2px top rules · `.two-up` with a `.note` (2px top rule, 58ch) · `.card` (white, ink border) for the sample issue and the math · `.job-list` two-column numbered list · `.ledger` table · centered CTA with bolt · footer.

## Inverted treatment (paid-tier surfaces, off-site)
Ground ink `#0f0f0f` or rust-dark `#7f2a15`; type cream `#f4f2ee`; accent stays crimson on ink, goes cream on rust-dark; hairlines `rgba(244,242,238,.25)`. Same layout, same bolt.

## Do not
Introduce a second accent · use a third typeface · round a corner · add an icon set · add gradients or textures · put a shadow on anything but a card · fabricate proof (testimonials, logos, badges, stats) · use emoji or exclamation points.

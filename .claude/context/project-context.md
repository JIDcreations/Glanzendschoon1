# Project context — Glanzend Schoon (cleaning-company one-pager)

## What this is
A one-page marketing site for "Glanzend Schoon," a small exterior-cleaning
company (terraces, driveways, glazing) based in Destelbergen, Belgium. Dutch
copy, trust-first local-service audience (homeowners getting quotes). Static
HTML/CSS/vanilla JS — no build step, no framework. Voice: plain, confident,
no marketing fluff, no invented stats.

The site just went through a design pass using the `design-taste-frontend`
skill (anti-slop frontend taste rules) that fixed rule violations (em-dashes,
hand-rolled icons, a banned repeated 3-column layout) and did one bold visual
pass (dark hero, bolder type, deeper shadows, solid confident buttons). The
owner still isn't happy with the overall look and wants each section pushed
further, in parallel, so they can compare/approve section-by-section.

## Design tokens — use ONLY these, no new hex values
Defined in `css/style.css` `:root` (top of file):
- **Colors:** `--ink #101b2e` (near-black navy, body text + dark sections),
  `--mist #eef4fb` / `--mist-dim #e0edf8` (pale blue-white backgrounds),
  `--paper #ffffff`, `--rinse #1f4483` (brand blue, the ONE true accent —
  logo color, all primary CTAs), `--rinse-dark #0f2547`, `--rinse-light
  #e5edf8`, `--sun #f5a623` (amber, used sparingly for icon accents /
  highlights), `--sun-light #fdf0dc`, `--aqua #0ea8ad` (teal, gradient
  partner / hover accents), `--aqua-light #e0f6f5`, `--stone #93a2b4`,
  `--stone-light #dce6ee`, `--slate #45566b` (body copy on light bg).
- **Type:** Display = `Bricolage Grotesque` (headings, `--font-display`).
  Body = `IBM Plex Sans` (`--font-body`). Mono = `IBM Plex Mono`
  (`--font-mono`, used for small tag labels like "Voor"/"Na"). Headings are
  now weight 700, tight tracking (`letter-spacing: -0.02em` or tighter).
  Section h2: `clamp(2.1rem, 3.8vw, 3.15rem)`.
- **Spacing / radius / easing:** `--container: 1220px` max width.
  `--radius-s 10px`, `--radius-m 18px`, `--radius-l 28px` (pick ONE scale
  consistently — don't invent a 4th radius). `--ease:
  cubic-bezier(0.22,1,0.36,1)` for all transitions.
- **Shadows (already deepened this pass, reuse them):** `--shadow-card`,
  `--shadow-pop` (bigger/softer, for hover/lift states), `--shadow-lift`.
  All tinted to `--ink`, never pure black.
- **Buttons:** `.btn` base + `.btn--primary` (solid `--rinse`, white text,
  hover = `--rinse-dark` + `translateY(-2px)` + deeper shadow),
  `.btn--ghost`, `.btn--on-dark`, `.btn--light`. Fully rounded (999px pill).
  Reuse these classes; don't invent a second button system.
- **Icons:** every icon site-wide is a real Phosphor Icons (regular weight,
  256×256 viewBox, `fill="currentColor"`) inline SVG — nav toggle, arrows,
  before/after handle, timeline badges, contact/social icons. If you need a
  NEW icon, fetch the real Phosphor SVG (e.g.
  `https://cdn.jsdelivr.net/npm/@phosphor-icons/core@2/assets/regular/<name>.svg`)
  and inline its exact path — never hand-draw/invent SVG path data.
- **Motion:** scroll reveal via `.reveal` class (JS toggles `.is-visible` on
  intersect) — fade + translateY(18px), respects `prefers-reduced-motion`
  already. Hover states use `transform` + `box-shadow` only (GPU-cheap).

## Voice / content
Dutch, direct, no fluff. Keep existing copy/wording as-is unless a section's
copy is genuinely too long/short for the new layout — if you must edit copy,
keep it a minimal, meaning-preserving tweak, not a rewrite.
**Zero em-dashes (`—` or `–`) anywhere, ever** — use a comma, period, or
colon instead. This is a hard, already-audited rule; don't reintroduce one.

## Acceptance criteria (quality bar)
- No horizontal overflow at 1440px, 768px, and 375px viewport widths.
- Hero headline (if you touch it): max 2 lines at desktop, subtext max ~20
  words / 4 lines, CTA visible without scrolling.
- No 3-equal-column generic card pattern back-to-back with another section
  using the same layout family.
- No hand-rolled/invented SVG icon paths — real Phosphor icons only.
- Buttons: text never wraps to 2 lines; contrast passes WCAG AA.
- `prefers-reduced-motion` still collapses all motion to static/instant.
- Real photography only (this site has real work photos in `assets/img/`
  and unused ones in `assets/source/` — check `assets/source/` before
  concluding you need a new image; if you truly need one that doesn't
  exist, say so rather than inventing a fake screenshot or generic SVG
  illustration).
- Verify by rendering the page (open the static file / dev server, look at
  it) at the widths above before reporting done.

## Contracts that must not break
These are relied on by `js/main.js` or by other sections — do not rename or
remove them even if you restructure markup around them:
- `.reveal` / `.is-visible` — IntersectionObserver reveal-on-scroll hook.
- `.nav__toggle`, `.nav__drawer`, `.icon-open`, `.icon-close`,
  `aria-expanded` attribute — mobile menu JS.
- `[data-nav]` attribute on nav links, and section `id`s they point to
  (`#diensten`, `#troeven`, `#galerij`, `#over-ons`, `#contact`) — scroll-spy
  JS matches `href="#id"` to `data-nav` links. If your unit owns one of
  these section ids, keep the id on the top-level `<section>`.
- `.ba`, `.ba__before`, `.ba__after`, `.ba__handle`, `.ba__knob`,
  `.ba__tag--before/after` — before/after slider JS (pointer events, keyboard
  arrows, ARIA slider role) targets these exact class names.
- `#contact-form`, and field `name` attributes `name`, `phone`, `email`,
  `service`, `message`, `consent` — JS validators key off `field.name` for
  `name`/`email`/`message` specifically. Don't rename.
- `.form-status`, `.form-status--ok`, `.form-status--err`, `.is-visible` —
  JS toggles these for submit feedback.
- `[data-year]` — JS sets current year in the footer.
- Shared/global CSS is OFF LIMITS to edit directly: the `:root` token
  block, `.btn*`, `.section`, `.section-head`, `.container`, `.reveal`,
  `.grain`, and the base `html`/`body`/`h1-h4` reset rules at the top of
  `css/style.css`. If your redesign needs a new visual treatment, add a
  NEW class scoped to your own section (e.g. a modifier on your section's
  own `id`, like `#troeven .my-new-thing`) — never edit a shared rule that
  other sections also use. If you genuinely believe a global token must
  change, don't change it — describe what you need in your report and hand
  it back to the orchestrator.

## Preview / run
Static site, no build step. Preview with:
`python3 -m http.server <port>` from the project root, then visit
`http://localhost:<port>/`. The orchestrator assigns your port.

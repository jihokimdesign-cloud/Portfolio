# DESIGN.md — Ground Truth

## Brand: Apple-style (via oh-my-design.kr reference, verified 2026-07-11)

This file is the design ground truth for this repo. New and updated UI follows
these tokens. The existing portfolio pages (Alvin-template editorial language:
dark canvas, cyan-50 text, ring-current wireframe) are **legacy** — migrate
surfaces to this system as they get touched, don't mix the two languages inside
one surface.

Source reference: https://oh-my-design.kr/apple/design.md
Config: apple · components: button, input, table, card, badge, tabs, dialog

## Principles

- Let product content dominate; controls stay visually restrained.
- One clear chromatic action accent (`--color-primary`) per local composition.
- Generous whitespace, large soft type, few borders — separation via canvas
  shifts (`#ffffff` on `#f5f5f7`) rather than outlines.
- Marketing surfaces (pill buttons, hero type) and product/docs surfaces
  (8px/18px radii) are distinct registers — don't collapse them.

## Tokens

### Color

| Token | Value | Use |
|---|---|---|
| `primary` | `#0071e3` | The one action accent |
| `canvas-dark` | `#000000` | Brand/dark canvas |
| `canvas-light` | `#f5f5f7` | Light page canvas |
| `surface` | `#ffffff` | Cards, panels, inputs |
| `foreground` | `#1d1d1f` | Primary text on light |
| `secondary` | `#515154` | Secondary text |
| `muted` | `#6e6e73` | Captions, hints |
| `on-primary` | `#ffffff` | Text on primary |
| `link-light` | `#0066cc` | Links on light canvas |
| `link-dark` | `#2997ff` | Links on dark canvas |

### Typography

Family: SF Pro Display (display roles) / SF Pro Text (text roles).
Web implementation: system stack — `-apple-system, BlinkMacSystemFont,
"SF Pro Text", "Helvetica Neue", Arial, sans-serif` (SF Pro is not
web-licensable; the system stack resolves to SF on Apple devices).

| Role | Size | Weight | Line height | Tracking |
|---|---:|---:|---:|---:|
| Display Hero | 56px | 600 | 60px | -0.28px |
| Section | 40px | 600 | 44px | normal |
| Tile Heading | 28px | 400 | 32px | +0.196px |
| Body | 17px | 400 | 25px | -0.374px |
| Body Small | 14px | 400 | 18px | -0.224px |
| Caption | 12px | 400 | 16px | -0.12px |

### Spacing

| Token | Value |
|---|---:|
| compact | 8px |
| control-inline | 15px |
| pill-block | 11px |
| pill-inline | 21px |
| content | 20px |

### Radius

| Token | Value | Use |
|---|---:|---|
| control | 8px | Inputs, product-register buttons, small controls |
| card | 18px | Cards, panels, dialogs |
| pill | 980px | Marketing-register buttons, badges |

## Components

Specs marked **[verified]** come from the reference (apple.com / Apple Store /
HIG surfaces). Specs marked **[derived]** are composed from the tokens above
for components the reference doesn't verify — keep them token-pure and revisit
if a verified spec becomes available.

### Button

- **Primary (marketing) [verified]** — bg `primary`, text `on-primary`,
  radius `pill`, padding 11px 21px, height 44px, 17px/400.
- **Outline (marketing) [verified]** — bg transparent, text `link-light`,
  1px border `link-light`, radius `pill`, padding 11px 21px, height 44px.
- **Compact [verified]** — bg `primary`, text `on-primary`, radius `pill`,
  padding 8px 15px, height 36px, 14px/400.

### Tabs

- **Gallery tab [verified]** — text `foreground`, height 53px, 17px/400,
  selection by underline/emphasis, not filled chips.

### Card

- **[verified — docs register]** — bg `surface`, radius `card` (18px),
  no border; separation from canvas via color shift. Content padding
  `content` (20px+).

### Input **[derived]**

- bg `surface`, text `foreground`, placeholder `muted`,
  radius `control` (8px), padding 11px 15px, 17px/400, height 44px.
- Border: 1px `#d2d2d7`-class hairline; focus ring in `primary`.

### Table **[derived]**

- Canvas `surface`, row separators as hairlines, no vertical rules.
- Header: Body Small (14px) `secondary`; cells: Body (17px) `foreground`.
- Row padding: `content` inline, 15px block.

### Badge **[derived]**

- Radius `pill`, Caption type (12px), padding 4px 10px.
- Neutral: bg `canvas-light`, text `secondary`. Accent: bg `primary` at
  10% opacity, text `primary`. Never more than one accent badge per group.

### Dialog **[derived]**

- bg `surface`, radius `card` (18px), no border, elevation via large soft
  shadow; title Tile Heading (28px/400), body Body (17px); actions use
  marketing buttons; backdrop: black at ~40% with blur.

## Reference: xiangyidesign.com (pulled 2026-07-18)

Extracted from the live site's Google Fonts loads and compiled CSS. Adopted
pieces are marked; the rest is reference only — Apple tokens above remain
ground truth.

- **Title font: TikTok Sans 400** (Google Fonts) — ADOPTED for landing titles
  (headline + "Selected work(s)"). Verified from their live H1: 60px,
  line-height 1, letter-spacing −0.025em, weight 400, `#e6e6e6` on dark.
  Body stays on the SF system stack. (Their font stack:
  `"TikTok Sans", "Inter", -apple-system, …`. Doto:900 is also loaded by
  their site but is NOT the title font — small accent use only.)
- Neutral semantic surfaces (light / dark):
  `bg-page #FFFFFF / —` · `bg-primary #FFFFFF / #1A1A1A` ·
  `bg-secondary #F5F5F5 / #222222` · `bg-tertiary #EBEBEB / #2A2A2A` ·
  `bg-elevated #FFFFFF / #242424` · `bg-inverse` flips ·
  `bg-overlay rgba(20,20,20,.67)` · `bg-tint ~10% gray` ·
  `bg-header rgba(255,255,255,.1) / rgba(0,0,0,.12)`.
  Near-identical to our Apple canvas/surface pairs — no change needed.
- Nav: bottom-centered dock — `position: fixed; bottom: 8px; left: 50%;
  translateX(-50%)` — ADOPTED (our GlassNav sits bottom-2, Liquid Glass
  material). Their dock vars for reference: `--dock-glass #bbbbbc`,
  `--dock-light #fff`, `--dock-dark #000`, `--dock-saturation 150%`.
- Their semantic text ramp (light): `text-primary #333` · `secondary #555` ·
  `tertiary #777` · `muted #999` · `disabled #BBB` · `link #0099ff` ·
  borders `#DBDBDB/#DDD`.

## Materials

- **Frosted glass** (`--glass`, `--glass-highlight`): Apple menu-style milky
  material. Use for large panels.
- **Liquid Glass** (`.liquid-glass`, `--liquid-bg`, `--liquid-rim`): iOS 26-
  style near-clear material — thin blur + saturation, SVG displacement edge
  refraction (`#liquid-lens` filter, Chromium), strong specular rim. Use for
  small floating chrome (nav pill). Falls back to frosted blur where the SVG
  backdrop-filter isn't supported (Safari/Firefox).

## Codebase mapping

- Tailwind: extend `theme.colors` with the color tokens above
  (`primary: "#0071e3"`, etc.) in `tailwind.config.js` when migration begins.
- The legacy accents (`text-cyan-50`, `#63DCF8`, per-project `--accent`) remain
  in already-shipped portfolio surfaces until those surfaces are migrated.
- First migration candidates: ChatWidget, homepage chrome. Case-study pages
  keep their per-project palettes (they are content, branded per product).

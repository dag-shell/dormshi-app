# doordash.com: your pages: design rules

A dark interface on a near-black neutral background where a dark indigo accent marks the next step. Type is DD Norms set tight at large sizes, corners are fully rounded on controls, and depth comes from soft neutral shadows.

Measured from 1 links; values in `tokens.json` start from the first one:

1. https://www.doordash.com/home

## Principles

### Soft, neutral depth

Lift raised elements with the measured shadow (rgb(241, 241, 241) 0px 0px 0px 1px inset).

_Why:_ Shadows appear on about 2% of elements; they mark what floats above the page and are never tinted.

### Even, compact hierarchy

Keep type sizes close together, anchored on 14px body text.

_Why:_ The largest measured size is only 1.7× the body size; hierarchy comes from weight and spacing instead.

### A steady rhythm

Space everything on the 4px grid: 2, 4, 8, 12, 16, 32px.

_Why:_ 80% of measured spacing values fall on this grid, which is what makes the layout feel ordered.

### Rounded and approachable

Use pill shapes for buttons and chips, and 8px corners for containers.

_Why:_ Fully rounded shapes make up 66% of measured radii; they soften an otherwise structured page.

## Never

- **Never tint shadows with colour.** Every measured shadow is neutral; a coloured glow would read as a different product.
- **Never introduce a second accent colour.** Only one saturated colour (#0000ee) carries weight in the measured palette.
- **Never use positive letter-spacing on headings.** Large type is tightened, down to -0.021em on the biggest sizes.
- **Never square off buttons.** Measured buttons are fully rounded; square ones would break the shape language.
- **Never animate longer than 250ms.** Every measured transition finishes within 250ms; slower motion would feel heavy here.
- **Never set button labels in all capitals.** No measured button uses uppercase text.
- **Never mix in a second display typeface.** Headings and body share DD Norms; a second family would split the voice.
- **Never use spacing off the 4px grid.** 80% of measured spacing sits on it.

## Colour

- Dark theme: near-black neutral background (#00000000).
- Body text #b2b2b2 on the background reads at 9.9:1; secondary text uses #606060.
- Accent #0000ee (dark indigo) with #ffffff text on top of it.

## Typography

- DD Norms throughout.
- Scale: h1 24px, h2 20px, h3 16px, body 14px, small 12px.
- Weights in use: 500, 700.
- Headings are tightened (-0.021em at 24px); body text keeps normal tracking.

## Shape and depth

- Radii: 8px (21%), 12px (12%), pill (66%).
- Borders: 1px, 2px in #d6d6d6.
- Shadows: rgb(241, 241, 241) 0px 0px 0px 1px inset | rgb(228, 228, 228) 0px 0px 0px 2px inset | rgb(247, 247, 247) 0px 0px 0px 1px inset.

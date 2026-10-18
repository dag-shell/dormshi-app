# Motion and Interactions

Quick and quiet: transitions run 200ms, 150ms, 250ms, 225ms.

- Default to 200ms transitions (77% of measured ones).
- Ease with ease.
- Animate filter, opacity, background-color, box-shadow; avoid animating layout.
- Turn every loop and decorative animation off under prefers-reduced-motion, as the site does.

## Interactions

- **Hover** changes background colour (48% of hover rules), text colour (24% of hover rules), opacity (19% of hover rules), shadow (16% of hover rules), background (13% of hover rules), underline (5% of hover rules). Things rarely move on hover; they change colour.

## Measurements

- Durations: 200ms (77%), 150ms (17%), 250ms (5%), 225ms (2%)
- Easings: `ease`, `cubic-bezier(0.4, 0.4, 0, 1)`, `ease-in-out`, `cubic-bezier(0.83, 0, 0.17, 1)`
- Animated properties: filter, opacity, background-color, box-shadow, backdrop-filter, transform

The site turns its motion off under `prefers-reduced-motion: reduce`. Do the same: every looping or decorative animation stops, and state changes happen instantly.

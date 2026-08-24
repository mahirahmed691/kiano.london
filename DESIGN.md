# Cavendish House — design system

Extracted and implemented as a restrained British fashion house: ivory ground, espresso ink, serif display, generous measure, no decorative chrome.

## Character

Luxurious, refined, British, timeless, understated, editorial, craft-focused. Typography, proportion and photography carry the identity. Whitespace is structural, not empty.

## Colour

| Token | Hex | Use |
| --- | --- | --- |
| Ivory | `#F4EFE6` | Page ground, header after scroll |
| Ivory deep | `#E8DFD0` | Alternate bands, image holds |
| Cream | `#FAF7F1` | Highlights |
| Ink | `#1B1714` | Type, rules on light |
| Ink soft | `#3F3933` | Body copy |
| Stone | `#6F675C` | Kickers, captions |
| Bronze | `#9C8660` | Reserved; not used as a fill |
| Rule | `#D4CBB8` | Hairlines |
| Night | `#141210` | Footer, dark bands, hero scrim |

No gradients as decoration. Hero overlays are photographic scrims only.

## Typography

- **Display:** Cormorant Garamond, 300. Headlines, pull quotes.
- **Interface:** Jost, 300–400. Navigation, labels, body.

Labels are 11px, uppercase, tracking `0.22em–0.28em`. Headlines are light weight with tight tracking. Body is 15–16px, relaxed leading, `max-width: 65ch` in practice.

Pull quotes may be italic. Headlines are upright.

## Layout

- Horizontal pad: 24 / 48 / 64 / 96px (`px-6 md:px-12 lg:px-16 xl:px-24`)
- Section rhythm: 80 / 112 / 144px vertical
- Product cards: 3:4 image, no radius, no shadow
- Grids collapse to one column on small screens, two from `sm`, three from `lg`

## Header

Fixed. Over imagery: transparent, ivory type. After 24px of scroll, or on light pages: ivory field, hairline, ink type. Mobile: two-line mark that becomes a close, full-screen ivory navigation in display serif.

## Buttons

Small. Uppercase tracking. Outline, not fill. Hover inverts to ink. On heroes, invert against ivory. Ghost links use a hairline underline and a small arrow.

## Motion

Fade and a short rise on enter. Image scale `1.02 → 1.07` on hover, 1.6s. Page fade 0.55s. All motion is removed when `prefers-reduced-motion: reduce`.

## Do not

- Rounded cards, drop shadows, SaaS gradients
- Oversized controls
- Bounce, parallax, loaders
- Stock-template sections or generic icon rows

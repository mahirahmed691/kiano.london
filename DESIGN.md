# Kiano London — design system

Extracted and implemented as a restrained London house of the jubbah and the thobe: warm ivory ground, espresso ink, a three-line English lockup (KIANO / LONDON / EST. MMXXIV), serif display, generous measure, no decorative chrome.

## Character

Luxurious, refined, modest, timeless, understated, editorial, craft-focused. London is the name of the house, not a costume. Typography, proportion and photography carry the identity. Whitespace is structural, not empty. Arabic appears on garment names; it is not the house mark.

## Colour

| Token | Hex | Use |
| --- | --- | --- |
| Ivory | `#F2EBDC` | Page ground, header after scroll |
| Ivory deep | `#E6DCC8` | Alternate bands, image holds |
| Cream | `#FAF7F1` | Highlights |
| Ink | `#1B1714` | Type, rules on light |
| Ink soft | `#3F3933` | Body copy |
| Stone | `#6F675C` | Kickers, captions |
| Bronze | `#9C8660` | Reserved; not used as a fill |
| Rule | `#D4CBB8` | Hairlines |
| Night | `#141210` | Footer, dark bands, hero scrim |

No gradients as decoration. Hero overlays are photographic scrims only. No gold geometry, mosque silhouettes, or flag colour.

## Typography

- **Display:** Cormorant Garamond, 300. Headlines, pull quotes.
- **Interface:** Jost, 300–400. Navigation, labels, body.
- **Arabic:** Amiri, 400. Garment names and occasional bilingual lines only.

Labels are 11px, uppercase, tracking `0.22em–0.28em`. Headlines are light weight with tight tracking. Body is 15–16px, relaxed leading, `max-width: 65ch` in practice.

Pull quotes may be italic. Headlines are upright.

## Layout

- Horizontal pad: 24 / 48 / 64 / 96px (`px-6 md:px-12 lg:px-16 xl:px-24`)
- Section rhythm: 80 / 112 / 144px vertical
- Product cards: 3:4 image, no radius, no shadow
- Grids collapse to one column on small screens, two from `sm`, three from `lg`

## Header

Fixed. Over imagery: transparent, ivory type. After 24px of scroll, or on light pages: ivory field, hairline, ink type. The house mark is the three-line lockup: KIANO, LONDON, EST. MMXXIV. Home and the stills open on the plate of the week from the book. A hairline London clock sits beside the bag: no numerals, no chrome, the house's time. Mobile: the lockup sits above full-screen ivory navigation in display serif.

## Buttons

Small. Uppercase tracking. Outline, not fill. Hover inverts to ink. On heroes, invert against ivory. Ghost links use a hairline underline and a small arrow.

## Motion

Fade and a short rise on enter. Image scale `1.02 → 1.07` on hover, 1.6s. Page fade 0.55s. All motion is removed when `prefers-reduced-motion: reduce`.

## Do not

- Rounded cards, drop shadows, SaaS gradients
- Oversized controls
- Bounce, parallax, loaders
- Stock-template sections or generic icon rows

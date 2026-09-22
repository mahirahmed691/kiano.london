# Kiano London — design system

Extracted and implemented as a restrained London house of the jubbah and the thobe: warm ivory ground, espresso ink, the interlocking KK monogram over a three-line English lockup (KIANO / LONDON / EST. MMXXIV), serif display, generous measure, no decorative chrome.

## Character

Luxurious, refined, modest, timeless, understated, editorial, craft-focused. The house speaks three words: Discipline, Craftsmanship, Purpose. A higher standard; built to last, worn with purpose. London is the name of the house, not a costume. Typography, proportion and photography carry the identity. Whitespace is structural, not empty: more air than type, stills held as plates, motion slow enough to be ceremonial. Arabic sits with the English on garment names, size, packing, and a visit; it is not the house mark. Keep it `w-fit` so RTL does not stretch the line across the plate.

## Colour

| Token | Hex | Use |
| --- | --- | --- |
| Ivory | `#F2EBDC` | Page ground, header after scroll |
| Ivory deep | `#E6DCC8` | Alternate bands, image holds |
| Cream | `#FAF7F1` | Highlights |
| Ink | `#1B1714` | Type, rules on light |
| Ink soft | `#3F3933` | Body copy |
| Stone | `#6F675C` | Kickers, captions |
| Bronze | `#B8A081` | Lockup on night: the KK, KIANO, LONDON, EST. MMXXIV |
| Rule | `#D4CBB8` | Hairlines |
| Night | `#25282B` | Lockup ground, footer, dark bands, hang tag, woven label |

No gradients as decoration. Hero overlays are photographic scrims only. No gold geometry, mosque silhouettes, or flag colour. The lockup on night `#25282B` is bronze `#B8A081`, not ivory and not a gold fill.

## Typography

- **Display:** Cormorant Garamond. The house lockup (KIANO) is Regular, 400. Headlines and pull quotes are Light, 300.
- **Interface:** Jost, 300–400. Navigation, labels, body, and LONDON / EST. MMXXIV.
- **Arabic:** Amiri, 400. Garment names, and a second line on size, packing, and a visit. Not the house mark.

Labels are 10–11px, uppercase, tracking `0.28em–0.36em`. Headlines are light weight with tight tracking and discretionary ligatures. The lockup is Regular, widely tracked, upright. Body is 15–16px, weight 300, leading near `1.85`, `max-width: 65ch` in practice.

Pull quotes may be italic. Headlines are upright.

## Layout

- Horizontal pad: 24 / 48 / 64 / 96px (`px-6 md:px-12 lg:px-16 xl:px-24`)
- Section rhythm: 96 / 128 / 176px vertical
- Product cards: 3:4 image, no radius, no shadow
- Grids collapse to one column on small screens, two from `sm`, three from `lg`

## Header

Fixed. Over imagery: transparent, ivory navigation, bronze lockup. After 24px of scroll, or on light pages: ivory field, hairline, ink type. The house mark is the interlocking KK monogram over the three-line lockup: KIANO, LONDON, EST. MMXXIV. EST. sits centred between two hairlines. Home and the stills open on the plate of the week from the book. The shop, the collection, and a visit open on a house still, lockup inverted over the plate. The packing, the letters, and the making carry the same stills and the woven lockup. A hairline London clock sits beside the bag: no numerals, no chrome, the house's time. Mobile: the lockup sits above full-screen ivory navigation in display serif; this week's plate closes the menu.

## Footer

Night ground. The lockup sits centred on the band, bronze, the same stack as the header. Tagline and creed sit under it. Nav, a visit, and the list follow in columns. No gold fill.

## Buttons

Small. Uppercase tracking. Outline, not fill. Hover inverts to ink. On heroes, invert against ivory. Ghost links use a hairline underline and a small arrow.

## Motion

Fade and a short rise on enter. Image scale `1.018 → 1.045` on hover, 2.2s. Page fade 0.8s. Still fade 1.7s. All motion is removed when `prefers-reduced-motion: reduce`.

## Do not

- Rounded cards, drop shadows, SaaS gradients
- Oversized controls
- Bounce, parallax, loaders
- Stock-template sections or generic icon rows

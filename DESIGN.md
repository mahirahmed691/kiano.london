# Kiano London — design system

Extracted and implemented as a restrained London house of the garment and the thobe, with a scent line coming: night canvas `#25282B`, ivory reading rooms, espresso type on paper, bronze lockup on night plates, the interlocking KK monogram over a three-line English lockup (KIANO / LONDON / EST. MMXXIV), serif display, generous measure, no decorative chrome.

## Character

Luxurious, refined, modest, timeless, understated, editorial, craft-focused. The house speaks three words: Discipline, Craftsmanship, Purpose. A higher standard; built to last, worn with purpose. London is the name of the house, not a costume. The house cuts cloth; it does not write fatwas. Typography, proportion and photography carry the identity. Whitespace is structural, not empty: more air than type, stills held as plates, motion slow enough to be ceremonial. Arabic sits with the English on garment names, size, packing, a visit, and the scent room; it is not the house mark. Keep it `w-fit` so RTL does not stretch the line across the plate.

## Colour

| Token | Hex | Use |
| --- | --- | --- |
| Ivory | `#F2EBDC` | Reading rooms, scrolled header, menus, drawers, packing |
| Ivory deep | `#E6DCC8` | Image holds |
| Cream | `#FAF7F1` | Highlights |
| Ink | `#1B1714` | Type on ivory paper |
| Ink soft | `#3F3933` | Body on ivory paper |
| Stone | `#6F675C` | Kickers on ivory paper |
| Bronze | `#B8A081` | Lockup on night: the KK, KIANO, LONDON, EST. MMXXIV |
| Rule | `#D4CBB8` | Hairlines on ivory |
| Night | `#25282B` | Page canvas, quote bands, footer, hang tag, woven label |

No gradients as decoration. Hero overlays are photographic scrims only, tinted with night `#25282B`. No gold geometry, mosque silhouettes, or flag colour. The page canvas is night `#25282B`. Reading rooms sit on ivory paper with espresso type. Quote bands, the footer, the hang tag and the woven label stay night. The lockup is bronze `#B8A081` on night plates, espresso on ivory. Ivory is also paper for menus, drawers, and packing sheets. Home and the story hold the creed in italic ivory, attributed in bronze. The shop, the collection, the scent, the stills, a visit, a piece, and the making hold a quieter night plate: the bronze lockup and the three words, so the quote is not repeated in every room. Do not place a night plate immediately above the footer.

## Typography

- **Display:** Cormorant Garamond. The house lockup (KIANO) is Regular, 400. Headlines and pull quotes are Light, 300.
- **Interface:** Jost, 300–400. Navigation, labels, body, and LONDON / EST. MMXXIV.
- **Arabic:** Amiri, 400. Garment names, the scent room, and a second line on size, packing, and a visit. Not the house mark.

Labels are 10–11px, uppercase, tracking `0.28em–0.36em`. Headlines are light weight with tight tracking and discretionary ligatures. The lockup is Regular, widely tracked, upright. Body is 15–16px, weight 300, leading near `1.85`, `max-width: 65ch` in practice.

Pull quotes may be italic. Headlines are upright.

## Layout

- Horizontal pad: 24 / 48 / 64 / 96px (`px-6 md:px-12 lg:px-16 xl:px-24`)
- Section rhythm: 96 / 128 / 176px vertical
- Product cards: 3:4 image, no radius, no shadow
- Grids collapse to one column on small screens, two from `sm`, three from `lg`

## Header

Fixed. Over imagery: transparent, ivory navigation, bronze lockup. After 24px of scroll, or on rooms without a plate: ivory field, hairline, espresso type, espresso lockup. The house mark is the interlocking KK monogram over the three-line lockup: KIANO, LONDON, EST. MMXXIV. EST. sits centred between two hairlines. Home and the stills open on the plate of the week from the book. The shop, the collection, the scent, and a visit open on a house still, lockup inverted over the plate: a bronze kicker and a name, not a paragraph. Longer copy sits on paper. A piece opens the same way: the first still is the room, then the buy column. The packing, the letters, and the making carry the same stills and the woven lockup. A hairline London clock sits beside the bag: no numerals, no chrome, the house's time. Mobile: the lockup sits above full-screen ivory navigation in display serif; this week's plate closes the menu. Installed (Add to Home Screen and the Expo shell): the hamburger is the house menu at every width, the same rooms as the phone site; the desktop mega menu stays in the browser. Word, the London clock, and Bag sit on the right in both shells.

## Footer

Night ground. The lockup sits centred on the band, bronze, the same stack as the header. Tagline sits under it in ivory; the creed and column labels sit in bronze. Nav, a visit, and the list follow in columns. The list field uses a bronze hairline. No gold fill.

## Buttons

Small. Uppercase tracking. Outline, not fill. Hover inverts to ink. On heroes, invert against ivory. Ghost links use a hairline underline and a small arrow.

## Motion

Fade and a short rise on enter. Image scale `1.018 → 1.045` on hover, 2.6s. Page fade 0.8s. Still fade 2.2s. Hero and still overlays are night scrims, not espresso. Caption kickers on full-bleed stills sit in bronze. All motion is removed when `prefers-reduced-motion: reduce`.

## Do not

- Rounded cards, drop shadows, SaaS gradients
- Oversized controls
- Bounce, parallax, loaders
- Stock-template sections or generic icon rows
- Fatwas, religious rulings, or dress as law. The house cuts cloth.

---
name: Cavendish House
colors:
  surface: '#faf9f7'
  surface-dim: '#dadad8'
  surface-bright: '#faf9f7'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f3f1'
  surface-container: '#efeeec'
  surface-container-high: '#e9e8e6'
  surface-container-highest: '#e3e2e0'
  on-surface: '#1a1c1b'
  on-surface-variant: '#454842'
  inverse-surface: '#2f3130'
  inverse-on-surface: '#f1f1ef'
  outline: '#767872'
  outline-variant: '#c6c7c0'
  surface-tint: '#5d5f5a'
  primary: '#171916'
  on-primary: '#ffffff'
  primary-container: '#2c2e2a'
  on-primary-container: '#949590'
  inverse-primary: '#c6c7c1'
  secondary: '#5e5f55'
  on-secondary: '#ffffff'
  secondary-container: '#e0e0d4'
  on-secondary-container: '#626359'
  tertiary: '#1a1911'
  on-tertiary: '#ffffff'
  tertiary-container: '#2f2e24'
  on-tertiary-container: '#989589'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e3e3dd'
  primary-fixed-dim: '#c6c7c1'
  on-primary-fixed: '#1a1c19'
  on-primary-fixed-variant: '#454743'
  secondary-fixed: '#e3e3d7'
  secondary-fixed-dim: '#c7c7bb'
  on-secondary-fixed: '#1b1c15'
  on-secondary-fixed-variant: '#46483e'
  tertiary-fixed: '#e7e2d4'
  tertiary-fixed-dim: '#cac6b9'
  on-tertiary-fixed: '#1d1c13'
  on-tertiary-fixed-variant: '#49473d'
  background: '#faf9f7'
  on-background: '#1a1c1b'
  surface-variant: '#e3e2e0'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 64px
    fontWeight: '400'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 40px
    fontWeight: '400'
    lineHeight: '1.1'
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '400'
    lineHeight: '1.2'
  headline-sm:
    fontFamily: Playfair Display
    fontSize: 24px
    fontWeight: '400'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.1em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1440px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 20px
---

## Brand & Style
The design system embodies "Quiet Luxury"—a synthesis of traditional British heritage and contemporary minimalist streetwear. It targets a discerning, high-net-worth audience that values craftsmanship over logos and subtlety over noise. 

The visual language follows a **Minimalist** aesthetic with a focus on editorial composition. It prioritizes expansive whitespace (the "luxury of space"), high-quality imagery, and a restrained UI that recedes to let the product photography serve as the primary narrative driver. The emotional response should be one of calm, exclusivity, and architectural precision.

## Colors
The palette is derived from natural textiles and masonry. 
- **Off-White (#F9F8F6):** The primary canvas color, softer and more premium than pure white.
- **Stone (#D6D2C4):** Used for subtle backgrounds, secondary sections, and structural dividers.
- **Deep Olive (#2C2E2A):** The primary brand color, used for text and high-emphasis elements. It acts as a softer, more sophisticated alternative to black.
- **Charcoal/Muted Sage (#8C8D82):** Used for secondary text, metadata, and low-contrast UI borders.

## Typography
The typography relies on the tension between the classic, high-contrast **Playfair Display** and the functional, modern **Inter**. 

Headlines should be treated with editorial care, often utilizing large scale and negative letter spacing to create a "locked-in" look. Body text is optimized for readability with generous line heights. The `label-caps` style is used for navigation items, categories, and small utility text to provide a structured, architectural feel to the interface.

## Layout & Spacing
The layout follows a **Fixed Grid** philosophy on desktop to maintain a controlled, gallery-like experience. 
- **Desktop:** 12-column grid with a maximum width of 1440px. Gutters are kept at 24px, but margins are wide (64px) to frame the content.
- **Mobile:** 4-column grid with 20px margins.
- **Spacing Rhythm:** Use a strict 8px base unit. Vertical rhythm should be intentionally exaggerated between sections (e.g., 128px or 160px) to signify a shift in the editorial narrative. Elements within a group should use tight spacing (8px, 16px) to maintain proximity.

## Elevation & Depth
This design system avoids heavy drop shadows in favor of **Tonal Layers** and **Low-Contrast Outlines**.
- **Surface Depth:** Use subtle shifts in background color (Off-White to Stone) to denote hierarchy.
- **Outlines:** Use 1px borders in `secondary_color` at 20-30% opacity. This creates a "ghost border" effect that defines shape without adding visual weight.
- **Shadows:** Only used for high-level floating elements (like a shopping bag drawer or a modal). These should be ambient: very large blur radius (32px+), low opacity (4-6%), and tinted with the `primary_color` (Deep Olive) to ensure they feel organic to the environment.

## Shapes
The shape language is primarily **Soft (0.25rem)**. This slight rounding takes the "edge" off the brutalist tendencies of a grid-heavy design, making the UI feel approachable and bespoke rather than clinical. Large containers like hero images or product cards should use `rounded-lg` (0.5rem) to maintain a consistent visual rhythm.

## Components
- **Buttons:** Primary buttons are solid Deep Olive with Off-White text, using the `label-caps` typography. Secondary buttons are "Ghost" style with a 1px Stone border. No heavy gradients or 3D effects.
- **Input Fields:** Minimalist underlines or 4-sided borders in 10% opacity Deep Olive. Labels sit above the field in `label-caps`.
- **Cards:** Product cards are borderless with the product image taking up 100% of the width. Text metadata is left-aligned underneath, using `body-md` for the name and `label-caps` for the price.
- **Chips/Filters:** Use a "pill" shape but with the `Soft` rounding (not a full circle) to stay consistent with the brand's architectural feel.
- **Lists:** Separated by thin, 1px Stone horizontal rules. High vertical padding (24px+) to maintain the editorial feel.
- **Additional Components:** "Lookbook Hotspots"—small, subtle circular markers on images that reveal product details on hover/tap.
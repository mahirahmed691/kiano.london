# Cavendish House

Quiet-luxury modest menswear site. Screens, copy, palette, type, and photography come from the Google Stitch export (`stitch_cavendish_house_brand_landing`). See `DESIGN.md` for tokens.

## Develop

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

| Script | Purpose |
| --- | --- |
| `npm run lint` | ESLint (Next.js core-web-vitals + TypeScript) |
| `npm run build` | Production build |
| `npm start` | Serve the production build |

## Routes

- `/` — landing (hero, story teaser, Jubbah collection, craftsmanship, Inner Circle)
- `/collection` — The Jubbah Collection lookbook
- `/collection/[slug]` — piece detail and add-to-bag
- `/story` — Our Story
- `/craftsmanship` — The Art of the Stitch
- `/craftsmanship/details` — Physical branding / techniques
- `/membership` — Inner Circle invite
- `/contact` — enquiry
- `/privacy`, `/terms`, `/shipping`

Primary CTAs: **View All** / collection pieces (add to bag) and **Request Invite**.

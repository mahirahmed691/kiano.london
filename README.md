# Suhail

A bespoke React website for **Suhail**, a London atelier of the jubbah and the thobe.

This is not a theme, a WordPress site, or a generic landing page. It is a small, production-ready application: Vite, React, TypeScript and Tailwind CSS, structured so the house can be extended without rewriting pages.

## Pages

| URL | Page |
| --- | --- |
| `/` | Home |
| `/collection` | The Collection |
| `/story` | Our Story |
| `/craftsmanship` | Craftsmanship |
| `/craftsmanship-details` | The making, in detail |

The logotype returns to the homepage. Collection pieces are driven from `src/data/products.ts`.

## Stack

- React 19 and TypeScript
- Vite
- Tailwind CSS v4
- React Router
- Semantic HTML, CSS transitions, `prefers-reduced-motion`

## Local development

```bash
npm install
npm run dev
```

The app runs at [http://localhost:5173](http://localhost:5173).

```bash
npm run build
npm run preview
```

## Deploying to Vercel

This repository is ready for a standard Vite deployment.

1. Import the GitHub repository in Vercel.
2. Framework preset: **Vite**.
3. Build command: `npm run build`
4. Output directory: `dist`

`vercel.json` rewrites unknown routes to `index.html` so `/collection`, `/story` and the craftsmanship pages work on refresh.

Optional: set `VITE_SITE_URL` to the live origin (no trailing slash) so Open Graph tags and canonical URLs match production.

## Project structure

```
src/
  components/   layout, editorial, product and UI
  pages/        one module per route
  data/         typed content (products, craft, site)
  lib/          seo helpers
  styles/       design tokens and motion
public/
  images/       house photography
```

## Design

Visual language, type, colour and spacing are recorded in `DESIGN.md`.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Typecheck and production build |
| `npm run preview` | Serve the production build |
| `npm run lint` | Oxlint |

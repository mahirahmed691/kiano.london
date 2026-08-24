# AGENTS.md

## Cursor Cloud specific instructions

This repository is a Next.js App Router site (Cavendish House) implemented from the Google Stitch export. Tokens live in `DESIGN.md` and `app/globals.css`.

### Services

One service: the Next.js app on port 3000.

| Command | Purpose |
| --- | --- |
| `npm run dev` | Development server (hot reload) |
| `npm run lint` | ESLint |
| `npm run build` | Production build |
| `npm start` | Serve the production build |

Bind to all interfaces if the preview pane cannot reach localhost: `npx next dev --hostname 0.0.0.0 --port 3000`.

### Notes

- Package manager is npm (`package-lock.json`). Startup install is `npm install`.
- There is no database, auth, or third-party API. Inner Circle and contact forms succeed in-session only.
- Shopping bag state is client-side React context (not persisted).
- Do not invent a new visual system. Match Stitch HTML/CSS and `DESIGN.md` (Playfair Display + Inter, off-white / stone / deep olive).
- Standard routes and scripts are listed in `README.md`.

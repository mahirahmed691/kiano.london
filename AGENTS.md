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
- Contact is a client component; its document title is set in `app/contact/layout.tsx`.
- Material Symbols load from Google Fonts via `app/globals.css`. Icons will not render if that request is blocked.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

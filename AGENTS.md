# AGENTS.md

## Cursor Cloud specific instructions

This repository is a Vite, React, TypeScript and Tailwind site for Kiano London. Tokens live in `DESIGN.md` and `src/styles/index.css`.

### Services

One service: the Vite app on port 5173.

| Command | Purpose |
| --- | --- |
| `npm run dev` | Development server (hot reload) |
| `npm run lint` | Oxlint |
| `npm run build` | Typecheck and production build |
| `npm run preview` | Serve the production build |

Bind to all interfaces if the preview pane cannot reach localhost: `npx vite --host 0.0.0.0 --port 5173`. For a production-like preview (no HMR), `npm run build` then `npx vite preview --host 0.0.0.0 --port 5173`.

### Notes

- Package manager is npm (`package-lock.json`). Startup install is `npm install`.
- There is no database, auth, or third-party API.
- Do not invent a new visual system. Follow `DESIGN.md` (Cormorant Garamond / editorial ivory and espresso).
- Standard routes and scripts are listed in `README.md`. Routes are declared in `src/App.tsx` with React Router.
- Framework is Vite, not Next.js. Deploy as a SPA (`vercel.json` rewrites unknown routes to `index.html`).

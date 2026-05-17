# Tasjil — Inscription Séminaires

Next.js 16 + Supabase app for seminar registration. Public registration flow, admin dashboard for managing seminars and inscriptions.

## Stack

- Next.js 16 (App Router, Turbopack)
- React 19
- TypeScript
- Supabase (auth, Postgres) via `@supabase/ssr`
- Tailwind CSS 4
- React Hook Form + Zod
- shadcn-style components (Radix-free, local in `src/components/ui`)

## Routes

- `/` — landing
- `/inscription` — public registration form
- `/inscription/merci` — confirmation + payment instructions
- `/admin/login` — admin login
- `/admin` — dashboard
- `/admin/inscriptions` — registrations table
- `/admin/seminaires` — seminars management

## Local development

Requirements: Node 20+, npm.

```bash
npm install
cp .env.example .env.local   # fill values
npm run dev
```

Open <http://localhost:3000>.

## Environment variables

| Key | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase publishable (anon) key |

## Scripts

| Command | Action |
|---|---|
| `npm run dev` | Dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | ESLint |

## Deployment — DigitalOcean App Platform

1. Connect this GitHub repo to DigitalOcean App Platform.
2. Detected as Next.js. Set:
   - Build command: `npm run build`
   - Run command: `npm run start`
   - HTTP port: `3000`
3. Add the env vars listed above (mark them as runtime + build-time as needed).
4. Deploy.

## Project structure

```
src/
├── app/                 # routes (App Router)
├── components/          # UI + feature components
└── lib/
    ├── schemas/         # zod schemas
    ├── supabase/        # client / server / proxy helpers
    └── types/           # db types
```

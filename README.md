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

## Email System

The application sends automatic confirmation emails upon registration and allows manual resends from the admin dashboard.

### Environment variables (Server-only)

Add these to `.env.local` and your production environment:

| Key | Description |
|---|---|
| `GMAIL_USER` | Sending Gmail address (e.g. `inscriptions.seminaires@gmail.com`) |
| `GMAIL_APP_PASSWORD` | 16-char App Password (see below) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (for server-side DB updates) |
| `EMAIL_FROM_NAME` | (Optional) Sender display name (defaults to "Inscription Séminaire") |

### Setup

1. **Gmail App Password**:
   - Enable 2-Step Verification on your Gmail account.
   - Go to [App Passwords](https://myaccount.google.com/apppasswords).
   - Generate a new App Password for "Mail" on your device.
   - Copy the 16-character code and set it as `GMAIL_APP_PASSWORD`.
   - *Note: Gmail has a daily limit of 500 emails for free accounts.*

2. **Database Migration**:
   - Apply the migration in `supabase/migrations/20260522000000_add_email_tracking.sql` to your Supabase instance via the SQL Editor.

### Project structure

```
src/
├── app/                 # routes (App Router)
│   └── actions/         # Server Actions (e.g. email sending)
├── components/          # UI + feature components
└── lib/
    ├── email/           # Email templates (react-email) and transport
    ├── schemas/         # zod schemas
    ├── supabase/        # client / server / proxy helpers
    └── types/           # db types
```

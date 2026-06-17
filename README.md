# Bibliothèque des rapports et analyses — Service d'Études (SPF Finances)

A lightweight, cheap-to-run document library for the SPF Finances Service d'Études.
Public catalogue + email/password login (`@minfin.fed.be` only) + admin approval +
report submission form. Non-confidential PDFs are hosted on Cloudflare R2;
confidential documents are referenced by SharePoint link and never hosted.

## Stack

| Concern        | Choice                                  | Cost          |
| -------------- | --------------------------------------- | ------------- |
| App (UI + API) | Next.js 15 (App Router)                 | free          |
| Auth           | Auth.js v5 (Credentials, email+pwd)     | free          |
| Database       | PostgreSQL (Neon / Supabase free tier)  | free          |
| File storage   | Cloudflare R2 (10 GB free, zero egress) | ~free         |
| Hosting        | Vercel free tier                        | free          |
| ORM            | Prisma                                  | free          |

No Azure, no SQL Server, no separate backend. One deployable unit.

## How it works

- **Visibility** — anyone can browse the catalogue. `PUBLIC` reports are open to all;
  `INTERNAL` reports require an approved login; `RESTRICTED` reports are SharePoint-only.
- **Accounts** — anyone with an `@minfin.fed.be` address can self-register, but the
  account stays `PENDING` until an admin approves it. Only approved users can contribute.
- **Files** — the browser uploads PDFs straight to R2 via a presigned URL, so the
  server never proxies file bytes (keeps you on the free tier). A report is either a
  hosted file **or** a SharePoint link, never both. Restricted = link only.

## Local setup

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
#   → fill DATABASE_URL, AUTH_SECRET, R2_* and SEED_ADMIN_* (see comments in the file)
#   → generate a secret with:  npx auth secret

# 3. Create the database schema
npm run db:push

# 4. Seed the first admin + sample reports
npm run db:seed

# 5. Run
npm run dev          # http://localhost:3000
```

## Deploy to Vercel

1. Push this repo to GitHub.
2. On [vercel.com](https://vercel.com): **New Project → import the repo**.
3. Add the environment variables from `.env.example` in **Project Settings → Environment Variables**
   (set `AUTH_URL` to your real domain, e.g. `https://study-library.vercel.app`).
4. Deploy. The build runs `prisma generate && next build`.
5. After the first deploy, apply the schema and seed against the production DB:
   ```bash
   # locally, with production DATABASE_URL exported:
   npx prisma db push
   npm run db:seed
   ```
   (Or run `prisma migrate deploy` if you switch to migrations.)

### Setting up the free services

- **Database (Neon):** create a project at [neon.tech](https://neon.tech), copy the
  **pooled** connection string into `DATABASE_URL`.
- **Storage (Cloudflare R2):** create a bucket named `study-library`, then
  **Manage R2 API Tokens → Create** for the access keys. Enable a **Public Development URL**
  (or attach a custom domain) and put its host in `NEXT_PUBLIC_R2_PUBLIC_HOST`.
  Endpoint is `https://<ACCOUNT_ID>.r2.cloudflarestorage.com`.

## Project structure

```
prisma/
  schema.prisma          # User + Report models
  seed.ts                # first admin + sample data
src/
  app/
    (public)/            # home, catalogue, report detail  — open to all
    (auth)/              # login, register
    (app)/               # contribute, account            — login required
    admin/               # accounts approval, reports mgmt — admin only
    api/                 # nextauth, register, upload-url
  components/            # header, footer, form, cards, admin buttons
  lib/
    auth.ts              # Auth.js v5 instance (Node)
    auth.config.ts       # edge-safe config for middleware
    prisma.ts            # Prisma singleton
    r2.ts                # R2 presigned upload + public URL
    validation.ts        # zod schemas (incl. @minfin restriction)
    actions.ts           # server actions (create report, approve, etc.)
  middleware.ts          # route protection
```

## Design notes

The login uses **email**, not a separate username — it's the identity you validate
against the `@minfin.fed.be` rule and the approval workflow, so a second field would
be redundant.

## Roadmap (deferred from v1)

- Members directory and events/calendar (the right-hand columns of the original mockup)
- Password reset by email
- Per-report download counts
- Switch `db push` → versioned `prisma migrate` once the schema stabilises

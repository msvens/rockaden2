# SK Rockaden Website

A proof-of-concept for a new version of [rockaden.se](https://rockaden.se) — the website for SK Rockaden, one of Stockholm's oldest chess clubs.

Built with [PayloadCMS](https://payloadcms.com/) 3 + [Next.js](https://nextjs.org/) 15 + [Tailwind CSS](https://tailwindcss.com/) v4.

## Tech Stack

- **CMS**: PayloadCMS 3.76.1
- **Framework**: Next.js 15.4 (App Router)
- **Styling**: Tailwind CSS v4
- **Database**: PostgreSQL 14
- **Package Manager**: pnpm
- **Runtime**: Node.js 22

## Prerequisites

- Node.js 22+
- pnpm (`corepack enable`)
- PostgreSQL 14+

## Getting Started

### Database Setup

Create a PostgreSQL database and user:

```sql
CREATE USER rockadenadmin WITH PASSWORD 'your-password';
CREATE DATABASE rockaden OWNER rockadenadmin;
```

### Environment Variables

Copy `.env.example` to `.env` (or create `.env`) with:

```env
DATABASE_URI=postgresql://rockadenadmin:your-password@localhost:5432/rockaden
PAYLOAD_SECRET=your-secret-key
```

### Install & Run

```bash
pnpm install
pnpm seed        # Seed database with admin user + sample content
pnpm dev         # Start dev server on port 3002
```

### Available Scripts

| Command              | Description                            |
|----------------------|----------------------------------------|
| `pnpm dev`           | Start development server (port 3002)   |
| `pnpm build`         | Production build                       |
| `pnpm start`         | Start production server (port 3002)    |
| `pnpm seed`          | Seed database with sample content      |
| `pnpm check`         | Run typecheck + lint + build           |
| `pnpm typecheck`     | TypeScript type checking               |
| `pnpm lint`          | ESLint                                 |
| `pnpm generate:types`| Generate PayloadCMS types              |

## Docker

Build and run with Docker:

```bash
docker build -t rockaden2 .
docker run -p 3002:3002 --env-file .env rockaden2
```

A local Docker development setup with PostgreSQL is available via:

```bash
./scripts/docker-local.sh
```

## Project Structure

```
src/
  app/
    (payload)/        # PayloadCMS admin panel + API routes
    (frontend)/       # Public-facing website
      layout.tsx      # Frontend layout with Navbar/Footer
      page.tsx        # Home page
      nyheter/        # News pages
      om-rockaden/    # About page
      pages/[slug]/   # Dynamic CMS pages
  collections/        # PayloadCMS collection definitions
  components/         # Shared UI components
    navbar/           # Modular navbar components
  context/            # React context providers (Theme, Language)
  lib/                # Utilities, translations, API helpers
  migrations/         # Database migrations
```

## Nginx Proxy

For local development behind nginx (port 8062 -> 3002), ensure `X-Forwarded-Host` includes the port for Server Actions to work correctly.

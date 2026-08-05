# FINIT

FINIT is a personal-finance platform that combines a public landing experience, authentication, financial dashboards, and a NestJS API in one npm workspace monorepo.

This repository is the current integration milestone for three previously separate codebases:

- `apps/web`: the Next.js landing page, auth screens, user dashboard, and admin screens.
- `apps/api`: the NestJS backend, Prisma data layer, PostgreSQL integration, Redis integration, and API documentation.

The code is being integrated in stages. The current milestone focuses on bringing the applications into one repository and making the primary navigation/build flow work. Docker orchestration and production hardening are intentionally the next milestones.

## Current status

Completed in this milestone:

- Unified npm workspaces for the web and API applications.
- Landing page, auth, dashboard, and admin routes retained in one Next.js application.
- Landing-page score CTAs route users to `/signup`.
- Landing-page CSS is scoped so it does not overwrite auth/dashboard styling.
- Root build commands for the web and API packages.
- Prisma schema and migrations retained under `apps/api`.

Next steps:

1. Align every dashboard/API call and complete auth hardening.
2. Add root Dockerfiles and a root Compose setup.
3. Run the complete stack locally in Docker.
4. Add CI checks and choose a no-cost deployment target for testing.

See [APPROACH.md](./APPROACH.md) for the broader integration plan.

## Architecture

```text
Browser
  |
  v
Next.js web app (apps/web)
  |  currently calls the API using the merged dashboard client
  v
NestJS API (apps/api)  --->  PostgreSQL (Prisma)
          |
          +----------------> Redis (sessions/cache/background work)
```

The web and API are separate processes during development and deployment, but they are versioned and installed together from the repository root.

## Repository layout

```text
.
├── apps/
│   ├── web/                 # Next.js 16 web application
│   │   ├── app/             # landing, auth, dashboard, and admin routes
│   │   ├── components/      # shared UI and dashboard components
│   │   └── lib/             # API client and frontend utilities
│   └── api/                 # NestJS 11 API
│       ├── src/             # modules, controllers, services, and guards
│       ├── prisma/          # schema and migrations
│       └── docker-compose.yml # source backend services reference
├── package.json             # root workspaces and orchestration scripts
├── package-lock.json
└── APPROACH.md              # staged integration plan
```

## Prerequisites

- Node.js 20 or newer
- npm (the repository uses npm workspaces)
- PostgreSQL and Redis for running the API-backed flows
- Docker Desktop only when beginning the Docker milestone; it is not required to build the web package

Check versions:

```bash
node --version
npm --version
```

## Install and configure

Clone the repository and install all workspace dependencies from the root:

```bash
git clone https://github.com/prkhr-g/FINIT.git
cd FINIT
npm install
```

The API uses environment variables. Create `apps/api/.env` locally (never commit it) or export the variables in your shell. At minimum, Prisma needs a database URL:

```bash
export DATABASE_URL='postgresql://postgres:postgres@localhost:5432/fint_db?schema=public'
npm exec --workspace=@fint/api -- prisma generate
```

PowerShell equivalent:

```powershell
$env:DATABASE_URL="postgresql://postgres:postgres@localhost:5432/fint_db?schema=public"
npm.cmd exec --workspace=@fint/api -- prisma generate
```

For a complete API runtime, configure the values described in [API environment variables](#api-environment-variables).

## Development commands

Run commands from the repository root.

```bash
# Start the Next.js web app
npm run dev:web

# Start the NestJS API in watch mode
npm run dev:api

# Build both workspaces
npm run build

# Build only one workspace
npm run build:web
npm run build:api

# Run the currently configured checks
npm run lint:web
npm run test:api
```

The web app normally opens at [http://localhost:3000](http://localhost:3000). The API defaults to port `3000` as well, so run one of them on another port (for example, set the API `PORT=3001`) when both processes are running locally. The frontend API base URL should point to that API port.

## Main routes

The merged web application currently includes:

| Area | Routes |
| --- | --- |
| Public | `/`, `/contact`, `/faq`, `/features`, `/pricing`, `/stories` |
| Authentication | `/signup`, `/login`, `/forgot-password`, `/reset-password`, `/verify-email`, `/onboarding` |
| User dashboard | `/dashboard`, `/finance`, `/income`, `/expense`, `/assets`, `/loans`, `/investments`, `/insurance`, `/retirement`, `/goals`, `/accounts`, `/score`, `/analytics`, `/reports`, `/ai`, `/notifications`, `/profile`, `/settings` |
| Admin | `/admin/analytics`, `/admin/dashboard`, `/admin/reports`, `/admin/settings`, `/admin/subscriptions`, `/admin/users` |

The primary landing-page action, “Get my score”, takes a new user to `/signup`.

## API

- Base path: `/api/v1`
- Swagger documentation: [http://localhost:3000/api/docs](http://localhost:3000/api/docs) when the API is running
- Database: PostgreSQL through Prisma
- Supporting service: Redis

### API environment variables

Use local development values and keep secrets out of Git. The exact required set can grow as modules are enabled, but the backend currently recognizes variables in these groups:

```text
DATABASE_URL
JWT_SECRET, JWT_EXPIRES_IN
REFRESH_SECRET, REFRESH_EXPIRES_IN
BCRYPT_ROUNDS
REDIS_URL
FRONTEND_URL
GEMINI_API_KEY, OPENAI_API_KEY
SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, SMTP_FROM
GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL
```

## Docker plan

Docker is not yet the default local command in this milestone. The planned stack is:

```text
web container  --->  api container  --->  postgres container
                                      └-->  redis container
```

The Docker milestone will add root-level Compose configuration, health checks, environment templates, persistent database storage, and separate development/production settings. Until then, use the workspace commands above and run PostgreSQL/Redis locally or through the existing backend service definition.

## Verification checklist

After pulling or making changes:

1. Run `npm install`.
2. Generate Prisma Client with a valid `DATABASE_URL`.
3. Start the web app and confirm `/` loads.
4. Click “Get my score” and confirm it opens `/signup`.
5. Check the auth and dashboard routes listed above.
6. Run `npm run build` before committing.
7. Start the API and inspect Swagger at `/api/docs` when database/Redis values are available.

## Known limitations

- Root Docker orchestration and deployment configuration are not included yet.
- Some secondary dashboard integrations still need endpoint-by-endpoint alignment with the API.
- The current merged auth client retains the source dashboard token/local-storage flow; HTTP-only cookie/BFF hardening is planned before production use.
- The existing lint command reports pre-existing issues inherited from the dashboard source and should be treated as cleanup work, not as a passing gate yet.
- `npm install` may report dependency audit findings; review them with `npm audit` before applying upgrades.
- Next.js font optimization may need network access during a clean build.

## Contribution workflow

1. Create a focused branch from `main`.
2. Make changes inside the relevant workspace.
3. Run the smallest relevant checks, then `npm run build`.
4. Keep secrets in local `.env` files and never commit them.
5. Describe API, database, route, or environment changes in the pull request.

## Roadmap

- [x] Combine the landing, dashboard, and backend source trees.
- [x] Route landing score CTAs through the unified signup flow.
- [x] Prevent landing CSS from leaking into auth/dashboard screens.
- [ ] Resolve remaining frontend/API contract and auth issues.
- [ ] Add and test root Docker configuration.
- [ ] Add CI, health checks, and deployment documentation.

No production license has been selected for this project yet.

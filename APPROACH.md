# FINT Integration Approach

FINT is being consolidated into one repository with a single Next.js product application and a NestJS API.

## Target structure

```text
apps/
  web/             Landing pages, authentication, and dashboard
  api/             NestJS API, Prisma schema, and migrations
docker-compose.yml Local web, API, PostgreSQL, Redis, and MailHog stack
```

## Delivery stages

1. Establish the monorepo and retain the imported frontend and backend histories.
2. Merge the dashboard/auth routes into `apps/web`, keeping the landing page as the `/` route.
3. Replace browser-stored tokens with a Next.js BFF and HTTP-only cookie session.
4. Align the core API contract: auth, profile, finance records, dashboard, and score.
5. Stabilize the NestJS API, database migrations, and optional Gemini integration.
6. Run the full stack locally with Docker Compose and verify the end-to-end user flow.
7. Prepare a deployment configuration only after local Docker verification passes.

## First release boundary

The first working release includes landing, signup/login/logout, authenticated routing, profile, finance CRUD, dashboard data, and score calculation/history. Admin, reports, notifications, Google OAuth, and non-core analytics remain disabled until their API contracts are complete.

## Security defaults

- The browser communicates with same-origin Next.js `/api` routes only.
- Next.js forwards authenticated requests to the private NestJS service.
- Access and refresh tokens are stored in secure HTTP-only cookies, never browser storage or URL parameters.
- Gemini credentials are supplied only via uncommitted environment files.

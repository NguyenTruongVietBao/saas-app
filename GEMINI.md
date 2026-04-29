# GEMINI.md - SaaS App (Monorepo)

Foundational mandates for the SaaS App project.

## Project Overview

This is a modern, full-stack SaaS boilerplate implemented as a monorepo using **pnpm workspaces**. It is designed with a **modular monolith** architecture on the backend and a multi-tenant structure using **PostgreSQL separate schemas per tenant**.

### Core Stack

- **Frontend:** [Next.js](https://nextjs.org/) (App Router, Tailwind CSS 4, Framer Motion)
- **Backend:** [NestJS](https://nestjs.com/) (Modular Monolith)
- **Database:** [PostgreSQL](https://www.postgresql.org/) with [Drizzle ORM](https://orm.drizzle.team/)
- **Infrastructure:** [Redis](https://redis.io/) (Caching), [RabbitMQ](https://www.rabbitmq.com/) (Async Queues)
- **Monorepo Management:** [pnpm](https://pnpm.io/)

## Project Structure

- `apps/api`: NestJS backend application.
- `apps/web`: Next.js frontend application.
- `packages/database`: Drizzle schema, migrations, and database utility scripts.
- `packages/shared`: Shared constants and configurations.
- `packages/types`: Shared TypeScript interfaces and types.
- `packages/utils`: Common utility functions.
- `docs/`: Comprehensive technical documentation (ERD, Architecture, Workflows).

## Building and Running

Commands are executed from the root directory using `pnpm`.

- **Install Dependencies:** `pnpm install`
- **Development Mode:** `pnpm dev` (Runs both API and Web concurrently after checking DB connection)
- **Run Web only:** `pnpm dev:web`
- **Run API only:** `pnpm dev:api`
- **Build All:** `pnpm build`
- **Lint All:** `pnpm lint`
- **Format Code:** `pnpm format`

## Development Conventions

### Multi-Tenancy

- The system uses a **schema-per-tenant** strategy.
- Public data (blog, marketing, shared users) resides in the `public` schema.
- Tenant-specific data (tasks, projects, employees) resides in dedicated schemas named after the tenant.
- **Always ensure tenant context** is respected in database operations. Use the `TenantResolverMiddleware` and `TenantStorage` for context propagation.

### Modular Backend

- Backend features are organized into modules (e.g., `AuthModule`, `TodoModule`, `TenantModule`).
- Modules should act as **bounded contexts**. Avoid direct cross-module database access; use service interfaces or RabbitMQ events for communication.

### Shared Packages

- Shared logic and types should be placed in the `packages/` directory.
- Use `workspace:*` for internal dependencies within `package.json` files.

### Database

- All schema changes must be managed via Drizzle in `packages/database`.
- Run migrations and seed data using scripts provided in `packages/database/package.json`.

### Styling

- Use **Tailwind CSS 4** for styling.
- Prefer vanilla CSS patterns or Tailwind utility classes; avoid introducing heavy CSS-in-JS libraries unless necessary.

### Testing

- API tests use **Jest** (`apps/api/test`).
- Ensure new features include corresponding unit or E2E tests.

## Documentation References

- Architecture: `docs/system-architecture.md`
- Database Schema: `packages/database/src/db/schema.ts`
- Feature Checklists: `docs/impl-checklist/`

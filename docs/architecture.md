# SaaS Medium Scope Architecture

## 1. Overview

**Goal:**
Build a scalable, maintainable SaaS system with multi-tenancy, modular architecture, and async processing.

**Core Stack:**

- Frontend: Next.js
- Backend: NestJS (Modular Monolith)
- Database: PostgreSQL (Neon) – Separate Schema per Tenant
- Cache: Redis
- Queue: RabbitMQ
- Features: Multi-tenant, i18n, Email-driven, Public Content

---

## 2. High-Level Architecture

```
[ Next.js (Frontend) ]
        ↓
[ NestJS API (Modular Monolith) ]
        ↓
[ PostgreSQL (Neon) - Multi Schema ]

+ Redis (Cache)
+ RabbitMQ (Async Jobs / Events)
```

---

## 3. Domain Separation

### 3.1 Public Domain (Non-tenant)

- Blog (SSR / SEO)
- FAQ
- Marketing pages

**Characteristics:**

- No tenant isolation
- Stored in `public schema`
- Cached aggressively (CDN/ISR)

---

### 3.2 Tenant Domain (Multi-tenant)

- Project Management
- HR Management
- Settings
- Email system

**Characteristics:**

- Isolated per tenant (schema-based)
- Requires tenant context in all operations

---

## 4. Frontend Architecture (Next.js)

### 4.1 Structure

```
/app
 ├── (public)
 │     ├── blog/
 │     ├── faq/
 │
 ├── (tenant)
 │     ├── dashboard/
 │     ├── projects/
 │     ├── employees/
```

---

### 4.2 Rendering Strategy

| Feature   | Strategy  |
| --------- | --------- |
| Blog      | SSR / SSG |
| FAQ       | SSG       |
| Dashboard | CSR + SSR |

---

### 4.3 Rules

- Keep business logic in backend (NestJS)
- Use Next.js only for:
  - UI rendering
  - Auth/session handling (light)
  - i18n (UI level)

---

## 5. Backend Architecture (NestJS)

### 5.1 Modular Monolith Structure

```
src/
 ├── modules/
 │    ├── auth/
 │    ├── tenant/
 │    ├── user/
 │    ├── settings/
 │    ├── project/
 │    ├── hr/
 │    ├── blog/
 │    ├── faq/
 │
 ├── infrastructure/
 │    ├── database/
 │    ├── cache/
 │    ├── queue/
 │    ├── email/
 │
 ├── shared/
```

---

### 5.2 Design Principles

- Module = bounded context
- No direct cross-module DB access
- Communication via:
  - Service interfaces
  - Events (RabbitMQ)

---

## 6. Multi-Tenancy Strategy

### 6.1 Approach

- **Separate schema per tenant**
- Public data in `public schema`

---

### 6.2 Tenant Resolution Flow

```
tenantA.app.com
      ↓
Next.js middleware
      ↓
Resolve tenant_id
      ↓
Call NestJS
      ↓
Set DB schema (search_path)
```

---

### 6.3 Rules

- Tenant context must exist in:
  - Request
  - DB access
  - Cache keys
  - Queue messages

---

## 7. Data Architecture

### 7.1 Structure

- Public schema:
  - blog, faq, shared data

- Tenant schemas:
  - projects, employees, settings

---

### 7.2 Key Decisions

- Use `search_path` for schema switching
- Avoid hardcoding schema names
- Prepare migration tooling for multi-schema

---

## 8. Caching Layer (Redis)

### 8.1 Use Cases

- Session cache
- Rate limiting
- Query caching
- Feature flags

---

### 8.2 Key Design

- Prefix by tenant:

```
tenant_a:user:123
tenant_a:project:list
```

---

### 8.3 Risks

- Cache invalidation complexity
- Memory usage growth

---

## 9. Async & Event System (RabbitMQ)

### 9.1 Use Cases

- Email sending
- Background jobs
- Audit logs
- Integrations

---

### 9.2 Flow

```
User Action
    ↓
Emit Event (NestJS)
    ↓
RabbitMQ
    ↓
Worker
    ↓
Process (Email / Job)
```

---

### 9.3 Event Naming Convention

```
user.created
project.created
task.assigned
employee.invited
```

---

### 9.4 Rules

- All messages must include `tenantId`
- Consumers must be idempotent

---

## 10. Email System (Event-Driven)

### 10.1 Design

- Triggered via events
- Processed asynchronously

---

### 10.2 Template Strategy

- Option 1: File-based (stable)
- Option 2: DB-based (dynamic, tenant-aware)

---

### 10.3 Multi-tenant Support

- Templates can vary per tenant
- Support localization (locale-based)

---

## 11. i18n Strategy

### 11.1 UI Level

- Managed in Next.js (JSON files)

---

### 11.2 Data Level

- Use translation tables (DB)

---

### 11.3 Fallback Logic

```
user locale → tenant default → system default (en)
```

---

## 12. Settings Design

### 12.1 Types

- Global settings (system-wide)
- Tenant settings
- User settings

---

### 12.2 Principles

- Avoid dumping everything into JSON
- Keep structured fields where needed

---

## 13. Core Risks

### 13.1 Schema Scaling

- Large number of tenants → migration overhead

---

### 13.2 ORM Limitations

- Dynamic schema support may be limited

---

### 13.3 Queue Overload

- High event volume → backlog

---

### 13.4 Permission Complexity

- HR + Project → RBAC becomes complex

---

## 14. Key Design Principles

1. **Keep it modular (strict boundaries)**
2. **Avoid premature microservices**
3. **Everything must be tenant-aware**
4. **Use async for heavy operations**
5. **Design for future migration (DB + services)**

---

## 15. Future Evolution

### Phase 1 (Current)

- Modular monolith
- Schema-based multi-tenancy

### Phase 2

- Extract services:
  - Auth
  - Billing
  - Email worker

### Phase 3

- Hybrid data model:
  - Large tenants → dedicated DB

---

## 16. Final Notes

This architecture is:

- Scalable for medium SaaS
- Cost-efficient
- Flexible for future evolution

Success depends on:

- Strict module boundaries
- Proper tenant handling
- Migration tooling quality
- Observability (logs, metrics, tracing)

---

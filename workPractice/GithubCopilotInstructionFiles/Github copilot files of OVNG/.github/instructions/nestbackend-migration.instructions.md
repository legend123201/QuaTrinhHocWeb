---
description: "Use when planning, implementing, migrating, or reviewing OmniVista Cirrus backend work while the legacy Sails.js backend is being deprecated and moved step by step to NestBackend / NestJS. Covers migration prioritization, scalable API placement, high-memory API migration, Helm deployment, RBAC preparation, target security middleware parity, Winston logging, migration mode, JWT authentication parity, dynamic CORS, environment-variable coverage, Mongo read-only access, and stable runtime limits."
---

# Legacy Backend Deprecation And NestBackend Migration

Treat this repository as a legacy backend under controlled deprecation. The target backend is NestBackend / NestJS at `https://scm.netaos.us/ovng/sw/nestbackend`.

## 🚨 ALERT: Adding New APIs in Legacy Backend

**DO NOT ADD NEW APIs TO THIS LEGACY SAILS.JS REPOSITORY.** All new backend capabilities must be implemented in NestBackend first. This repository is in controlled deprecation and should only receive maintenance changes, bug fixes, and migrations of existing APIs. Adding new APIs here violates the migration strategy and increases technical debt.

- **For new features**: Implement in NestBackend (`https://scm.netaos.us/ovng/sw/nestbackend`).
- **For scalability requirements**: Migrate to NestBackend.
- **Exceptions**: Only if explicitly approved with migration blocker documentation.

If you are considering adding a new API here, stop and consult the migration plan. Contact the backend team for guidance on NestBackend implementation.

## Default Decision Rule

- Do not treat Sails.js as the long-term default for new backend capability.
- Prefer NestBackend first for new APIs introduced in a new release and for APIs that require scalability.
- If work must remain in Sails.js temporarily, keep the slice small, isolate framework-specific code, and document the migration blocker.
- Challenge changes that increase long-term maintainability, compliance, regulatory, interoperability, or integration risk in the legacy backend.
- Do not reject NestJS plus TypeScript based on assumed memory or performance drawbacks compared with ExpressJS unless task-specific benchmark evidence proves a problem.

## Migration Phases

### Phase 1

- Add new APIs in the new release to NestBackend by default.
- Migrate APIs that require scalability.
- Bootstrap an empty NestJS backend using the acceptance areas below and Reporting MS as the reference direction.
- Integrate Chatbot 10.5.2 APIs and support Helm-chart deployment.
- Test scalability in the dev cluster.
- Prepare RBAC integration for scalable APIs that are moving out of Sails.js.

### Phase 2

- Migrate APIs with high memory usage.

### Phase 3

- Migrate APIs that integrate with a third microservice.

## NestBackend Acceptance Baseline

The target NestBackend implementation must preserve the current backend protection baseline:

- `rateLimiter`
- `session`
- `dnsPrefetchControl`
- `frameguard`
- `hidePoweredBy`
- `ieNoOpen`
- `noSniff`
- `xssFilter`
- `csp`
- `strictTransportSecurity`

The target NestBackend implementation must also preserve these operational behaviors:

- Winston log format parity with the current backend.
- Migration mode support.
- Authentication policy based on the JWT secret.
- Dynamic CORS origin handling for APIs.
- All declared environment variables must be consumed by the server so missing integrations are exposed early.
- Mongo access mode must be read-only.
- Stable-mode Mongo connection limit must stay at or below `5`.
- Stable-mode memory usage must stay at or below `200 MB`.

## Implementation Guidance

- When a task touches a scalable or memory-heavy API, explicitly assess whether the work should land in NestBackend instead of extending Sails.js.
- Keep legacy Sails.js changes migration-friendly: stable contracts, thin controllers, isolated policies, isolated connectors, and no new framework lock-in unless unavoidable.
- When proposing a migration slice, name the destination module, auth and RBAC needs, deployment path, configuration dependencies, and validation plan.
- When reviewing a Sails.js change, call out when the same work would be lower risk or more scalable in NestBackend.
# OmniVista Cirrus Backend — Copilot Instructions

## Project Overview

Node.js backend for **OmniVista Cirrus** built on the [Sails.js](https://sailsjs.com/) framework with MongoDB (via a custom `sails-adaptermongo`). The API is documented with OpenAPI/Swagger definitions located in `apidoc/swagger/`.

## Architecture

| Layer | Location | Notes |
|-------|----------|-------|
| Controllers | `api/controllers/` | Sails actions; one file per resource |
| Services | `api/services/` | Business logic called from controllers |
| Models | `api/models/` | Sails/Waterline model definitions |
| Policies | `api/policies/` | Middleware guards; wired in `config/policies.js` |
| Routes | `config/routes.js` + `routes/` | REST route definitions |
| Constants | `api/constants/` | Shared enums / lookup tables |
| Connectors | `api/connectors/` | External system integrations |

## Policies Convention

- Every route **must** be registered in `config/policies.js`.
- Each action should include an org-scoping policy (a policy whose name contains `organization`, `orgId`, or similar).
- Run `node scripts/checkPolicies.js` after modifying routes or policies to validate coverage. Results are written to `errorReview.md`.
- Run `node extractRoute.js` first to keep `extractRoute.md` up-to-date.

## API Documentation (Swagger/OpenAPI)

Schemas live in `apidoc/swagger/resources/`:

### Response schemas (`responses/schemas/<resource>.js`)
- Define all fields in a single `commonProperties` object at the top.
- Use `_.cloneDeep(commonProperties)` per endpoint and `delete` fields not needed.

### Request schemas (`requests/schemas/<resource>.js`)
- Define `commonProperties` **without** `required` flags.
- Use `_.cloneDeep(commonProperties)` per endpoint, then set `required: true` only on the fields that are mandatory for that operation.
- Extract sub-schemas (e.g., `credentialSchema`, `schedulerSchema`) when used in 2+ places or when they are complex nested objects.
- Inline simple primitives used only once.

### Regenerating docs
```bash
npm run apidoc      # regenerate all Swagger/Redoc output
npm run checkdoc    # check response status codes
npm run redoc       # rebuild the standalone Redoc HTML page
```

## Build & Test

```bash
npm run local              # start with nodemon (local env)
npm run lint               # ESLint check
npm run lint:fix           # ESLint auto-fix
npm run unit-test          # Vitest unit tests
npm run unit-test:coverage # Vitest with coverage
npm run tests              # Mocha integration tests (production env)
npm run testslocal         # Mocha integration tests (local env)
```

## Key Conventions

- **Lodash** (`lodash` + `@sailshq/lodash`) is the standard utility library; prefer it over manual loops.
- **Joi** is used for request validation in controllers/services.
- **MongoDB migrations** live in `migrations/`; run via `migrate-mongo`.
- **i18n** translation keys are checked with `node checkTraductionStrings.js`.
- Keep controller actions thin — delegate business logic to services.
- Never store secrets in source; use `config/secrets.js` and environment variables (see `envsample`).

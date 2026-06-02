---
agent: agent
---
# Architecture Prompt (Condensed)

TLDR: Controllers thin, policies first (auth + validation), services hold logic, models persist. If any required context (route, model, policy chain, expected behavior) is missing → ask; never guess.

Authoritative rules live in instruction files:
- `.github/instructions/safetyGate.instructions.md`
- `.github/instructions/architecture.instructions.md`
- `.github/instructions/security.instructions.md`
- `.github/instructions/responses.instructions.md`
- `.github/instructions/performance.instructions.md`

Visual reference (optional, load only if explicitly requested): `./examples/architecture.layer.mermaid.md`.

Use this prompt only when generating or reviewing an architectural change (new endpoint, layer refactor, policy design). Prefer referencing rules over duplication.

## Core Layer Contracts
Controller: parse already‑validated input, call service, map result via `HttpResponseService`. Never query models just to decorate a response or audit payload; the service must return those fields.
Service: orchestrate business logic + connectors; no direct response writes.
Policy: auth (isAuthenticated + role/ownership), tenancy scoping, Joi validation, existence caching.
Model: persistence only; no outbound HTTP or complex branching.

Shared domain constants live in `api/constants/` and should be imported, not duplicated per controller or service.

## Canonical Policy Order
1. isAuthenticated
2. isJsonContentType (for body-bearing methods)
3. is{Entity}SchemaValidated (Joi)
4. is{Entity}Exist (cache entity)
5. Ownership / relationship (is{Child}Belong{Parent}, role checks)
6. Localize (only if sending localized output/email)

Deviation requires `// JUSTIFICATION:` comment.

## 403 Usage (Summary)
Return 403 when: user lacks rights; resource state forbids action; quota/limit reached; feature disabled via config. Use 400 for validation failures, 404 for missing.

## New API Minimal Checklist
[] Route added (`routes/api/*.js` or `routes/web/*.js` if UI-facing)
[] Policies mapped in `config/policies.js` (order above)
[] Thin controller action → calls service
[] Service method implemented
[] Model added/changed (migration if schema update)
[] Joi policy created/updated
[] Swagger / apidoc schema updated if public
[] Integration + failure tests added
[] Response uses `HttpResponseService`

## Ask-First Triggers
- Request to skip validation/auth
- Unclear tenant scoping (`orgId` / ownership missing)
- Mixing legacy + new error fields without versioning plan
- Large refactor with no acceptance criteria

## Out of Scope
Examples (see `architecture.examples.md` only if explicitly requested). Performance, security, response details—consult respective instruction files.

Abort if ambiguity persists after a clarification cycle. Keep output minimal; link to canonical instruction sources instead of duplicating them.


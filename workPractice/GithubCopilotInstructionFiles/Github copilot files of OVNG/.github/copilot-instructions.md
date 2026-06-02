# Copilot Core Instructions (Modular)

Language: All code comments, and text content must be English.
Never proceed if mandatory context (file role, route, model, expected behavior) is missing—ask first.
In this Sails.js backend, services under `api/services/` are globally exposed by the framework.
- Do not add `require(...)` imports for app services in files that run inside the Sails runtime.
- Use the global service name directly in `api/controllers`, `api/policies`, `api/models`, `api/services`, `api/connectors`, and other runtime-loaded backend files.
- Only import an app service when the file runs outside the Sails runtime, such as a standalone script, a test harness, or another explicit non-Sails execution context, or when the user explicitly asks for a local import pattern.
- Before finishing an edit, remove accidental service imports that match this cleanup regex.
	Find: `^\s*const\s+(?:\{[^}]+\}|[A-Za-z_$][\w$]*)\s*=\s*require\(["'][^"']*?/services/[^"']+["']\);\r?\n`
	Replace: empty string

Use only the minimal subset of instruction files relevant to the file you edit. When overlap exists re-ask the doubt.
**Always use Todo tool** for code change requests. 

Primary modular files (all under `.github/instructions/`):
1. `safetyGate.instructions.md` – request validation & guardrails (always load first).
2. `architecture.instructions.md` – layering, routing, policies mapping.
3. `security.instructions.md` – validation, authn/z, secrets, logging rules.
4. `responses.instructions.md` – success/error payload format.
5. `codeStyle.instructions.md` – naming, formatting, anti‑patterns.
6. `performance.instructions.md` – scalability, Pagination, query limits, batching, caching.
7. `testing.instructions.md` – unit testing strategy, Vitest conventions, mocking rules.

Minimal Workflow:
1. Apply Safety Gate checklist (halt on any failure; ask for clarity instead of guessing).
2. Confirm route → policies mapping (if touching routes/controllers).
3. Validate APIs in policy, before controller/service logic.
4. Keep controllers thin → delegate to services.
5. Return responses via `HttpResponseService` (see `responses.*`).
7. Run lint + run tests + update Developer Defense.

Validation (mandatory after every code change):
- Run `npm run lint:fix`.
- Run `npm run unit-test` to ensure no regression.
- Run `node --expose-gc ./app.js`.

Unit Testing Rule:
- Every new feature, bug fix, or refactored code must include colocated Vitest unit tests.
- When analyzing existing code that lacks tests, proactively propose and create them.
- Never skip this step. If unsure what to test, ask.

For Git commit messages:
What changed | Why | Manual test steps (success + failure) | Validation (lint, tests) | Risk notes.

If you don't know what to do: ask me question to clarify.
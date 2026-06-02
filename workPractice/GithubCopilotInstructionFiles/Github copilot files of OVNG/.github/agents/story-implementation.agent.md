---
name: Story Implementation
description: Implement a backend YouTrack story end-to-end from its URL, apply the correct repo skills and safety gates, validate the changes, update architecture/documentation if needed, then update YouTrack with the build number and code-completed status.
argument-hint: Provide the YouTrack story URL and the build number to set after implementation.
tools: ['execute', 'read', 'edit', 'search', 'todo']
---

Implement a YouTrack story in this backend (Sails.js / Node.js) repository from a user prompt that contains:
- a YouTrack story URL or readable issue ID
- a build number

## Required workflow

### Step 1 — Validate inputs

- If the prompt does not include a build number, ask for it before making any code changes.
- Accept either a full YouTrack story URL (`https://al-enterprise.youtrack.cloud/issue/OVNG-XXXXX`) or a readable issue ID (`OVNG-XXXXX`).

### Step 2 — Fetch the story

Run:
```
npm run youtrack:story:fetch -- "<story-url-or-id>"
```

Use the JSON output as the source of truth for:
- `idReadable` — the canonical story identifier
- `title` — the story summary
- `description` — requirements and acceptance criteria
- custom field values (type, sprint, component, fix build/s)

### Step 3 — Analyze before coding

Extract and classify from the description:
- **Functional requirements** — what the backend must do
- **Non-functional requirements (NFRs)** — performance, security, reliability, scalability targets
- **Acceptance criteria** — the done-definition
- **Dependencies / blockers** — other stories, services, or teams

Apply `#file:./../instructions/nfr.instructions.md` to validate NFR targets:
- p95 API response < 200 ms
- No unbounded DB queries (cap or paginate)
- JWT auth + RBAC policy on every new endpoint
- No PII or tokens in logs
- Error responses via `HttpResponseService` only

Apply `#file:./../instructions/safetyGate.instructions.md` FIRST — halt on any failure:
- Is the scope clear? If not, ask.
- Does the story require touching auth/permission logic? Review `#file:./../instructions/security.instructions.md`.
- Does the story add a new route? Confirm controller-thin + policy strategy using `#file:./../instructions/architecture.instructions.md`.

### Step 3.5 — Check for Architecture/Workflow/Requirement Updates

- Analyze the story title and description for indications of architecture, workflow, or requirement modifications.
- If the title contains "Arch" or the description mentions changes to architecture, workflow, or requirements:
  - Update the relevant files in `.github/documentation/` (e.g., `mongo_schema_relations.md`, `organization-site-creation.md`, `server-side-event-workflow.md`, `user-role-cache-implementation.md`).
  - Update `.github/instructions/architecture.instructions.md` for architecture changes.
  - Update `.github/instructions/performance.instructions.md` for performance-related changes.
- Document the changes briefly in the updated files.

### Step 5 — Plan the implementation

Before writing code, produce a brief plan covering:
- **Files to create** (controller, service, model, migration, route, policy, test)
- **Files to modify**
- **Backend-only scope** — if the story also requires frontend changes, note them as out-of-scope for this agent
- **APIDOC Swagger** — when there is a change or addition to an API endpoint, update the swagger schema in `./apidoc/swagger/**.*.js`.

Do NOT invent new external API contracts or DB schemas without the story explicitly requesting them.

### Step 6 — Implement the story

Follow the layering rules from `#file:./../instructions/architecture.instructions.md`:

```
Route → Policy → Controller (thin) → Service → Model
```

Key rules:
- Validate all inputs in the **policy** or at the controller boundary with Joi.
- Keep **controllers thin**: parse params, call service, return `HttpResponseService` response.
- Put business logic in **services**.
- If a new collection field is needed, create a migration in `migrations/`.
- Return success and error payloads per `#file:./../instructions/responses.instructions.md`.
- Apply `#file:./../instructions/codeStyle.instructions.md` naming and formatting throughout.
- Apply `#file:./../instructions/performance.instructions.md` — no N+1 queries, cap result sets.
- Apply `#file:./../instructions/security.instructions.md` — RBAC policy on every new route.

If the story involves a **audit log**:
Use the Skill `Log Audit for API` (`#file:./../skills/log-audit-for-api/SKILL.md`) to log the relevant actions with `newData` and `oldData` as needed.

If the story involves a **new API endpoint** or **modifying an existing one**:
1. Add the route in the appropriate `routes/web/routes.js` file.
2. Register the policy in `config/policies.js`.
3. Create/extend the controller and service.
4. Write unit tests (Vitest) per `#file:./../instructions/tests.instructions.md`.
5. Add the route with swagger schema in `routes/api/routes.js`

If the story involves a **DB schema change**:
1. Update the Waterline model in `api/models/`.
2. Create a migration file in `migrations/` (timestamped filename, `up` and `down`).

If the story depends on **another microservice API** that does not exist yet, implement the outbound call in the service but document it clearly. Do NOT implement the other service's own API — that belongs to the other team.

### Step 7 — Write or update unit tests

Every new feature, bug fix, or refactored code **must** include colocated Vitest unit tests.
- Place spec files next to the source: `api/services/tests/MyService.spec.js`.
- Mock Sails globals and waterline models per existing patterns.
- Cover at least: happy path, validation error, and notFound / permission-denied cases.

Never skip this step.

### Step 8 — Validate the implementation

Run the following commands in sequence:

```bash
npm run lint:fix
npm run unit-test
node --expose-gc ./app.js
```

- If `lint:fix` reports new errors (not pre-existing), fix them before continuing.
- If `unit-test` fails, fix regressions before continuing.
- Start `app.js` briefly to confirm no boot errors, then stop it.
- If the app fails to start due to a missing env variable, note it but do not block completion.

### Step 9 — Update YouTrack

After all validations pass, run:
```
npm run youtrack:story:complete -- "<story-url-or-id>" "<build-number>"
```

This sets the `Fix Build/s` custom field and advances the story through the state machine to `Code Completed (CC)`.

If the script fails:
- Report the exact error message.
- Do NOT claim the story was completed if the API call did not succeed.

## Output summary

Provide a short closing summary:
1. **Implemented scope** — list what was added/changed (files, routes, migrations).
2. **Out-of-scope items** — frontend changes, other microservice implementations, DB changes not in the story.
3. **Cross-team dependencies** — APIs or contracts that another team must implement.
4. **Validation results** — lint status, unit test count, app boot status.
5. **YouTrack update** — confirm `idReadable`, build number set, and final state reached.

## Key instruction references

- `#file:./../instructions/safetyGate.instructions.md`
- `#file:./../instructions/architecture.instructions.md`
- `#file:./../instructions/security.instructions.md`
- `#file:./../instructions/responses.instructions.md`
- `#file:./../instructions/codeStyle.instructions.md`
- `#file:./../instructions/codeRule.instructions.md`
- `#file:./../instructions/performance.instructions.md`
- `#file:./../instructions/nfr.instructions.md`
- `#file:./../instructions/tests.instructions.md`
- `#file:./../documentation/mongo_schema_relations.md`
- `#file:./../documentation/organization-site-creation.md`
- `#file:./../documentation/server-side-event-workflow.md`
- `#file:./../documentation/user-role-cache-implementation.md`

End.

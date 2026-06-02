---
name: Implement API Agent
description: Given one or more API descriptions, implements the full API end-to-end — routes, policies, controller, service, connector, body request validation (non-GET), audit log (mutating operations), and Swagger API documentation.
model: Claude Sonnet 4.6 (copilot)
---

# Input
Ask the user for all of the following at once, directly in the chat:

1. **API descriptions** — one per API (e.g. "Create a new CLI script", "Get all CLI scripts", "Delete a CLI script by ID").
2. **Microservice connector filename** — the connector file to call (e.g. `cliScriptingMicroServiceConnector.js`), or "none" if not applicable.
3. **Request body sample** — for each non-GET API (create, update, patch, etc.). Provide as JSON.
4. **Response body sample** — for each API. Provide as JSON.
5. **Any additional details** — special behaviour, optional fields, etc.

# Implementation Rules

Implement the full API end-to-end following the project architecture. Apply the rules below:

**Controller & Service**
- For APIs with both URL params and a body: use `req.params` and `req.body` explicitly in the controller (not the `params` argument from `processFunc`). The service accepts `(urlParams, bodyParams)` as two separate arguments.

**Connector** *(skip if not applicable)*
- The connector receives `orgId` from `urlParams` and forwards `bodyParams` as `{ data: bodyParams }`.

**Body Request Validation** *(non-GET APIs only)*
- Create or update `api/policies/is<Resource>SchemaValidated.js`.
- Follow the `isCliScriptSchemaValidated.js` format: declare common schema variables for reuse, use a `switch` on the HTTP method, apply `.required()` only within per-API schemas — never on the common variable declaration.
- Read `isCliScriptSchemaValidated.js` and 20 other random policy files for style reference before generating code.
- Append the new policy name to the end of each non-GET action's policy array in `config/policies.js`.

**Audit Log** *(create / update / edit / delete / remove / import / export only — skip get / find / list / check)*
- Read existing APIs that already have audit log for style reference before adding.
- For **update/edit**: fetch the existing record before updating, attach it as `oldData`, pass as the 5th argument to `HttpResponseService.json()`. Add guard `if (!oldData) { return oldDataResponse; }` before the update call.
- For **bulk delete** with possible 207: collect successfully deleted items (`e.status === 200`) into `auditLogData`; handle three cases:
  - `statusCode 200` + items present → `HttpResponseService.json(200, ..., userActivitiesArray)`
  - `statusCode 207` + items present → `HttpResponseService.json(207, ..., userActivitiesArray)`
  - `statusCode 207` + no items → `HttpResponseService.json(207, ...)` with no audit log
- Add i18n action keys to **all** locale files under `config/locales/`, translated appropriately per language.

**API Documentation**
- Follow the `cliScript.js` pattern for request/response schemas and samples.
- Define all fields in a single `commonProperties` object at the top; use `_.cloneDeep` per endpoint.
- Response schemas: use `delete` to remove unneeded fields.
- Request schemas: never set `required` in `commonProperties`; set `required: true` per-endpoint after cloning.
- Extract a field into a reusable sub-schema only when used in 2+ schemas or is a complex nested object. Inline simple single-use primitives directly.

# Rules
- Ask all input questions at once, directly in the chat. Do NOT use pop-up modals or the vscode_askQuestions tool.
- Before editing each file type, read ~10 similar existing entries within that file (if applicable) or ~10 sibling files of the same type to match style. Do not read the whole file.
- Do not add anything beyond what is listed in the steps above (no extra error handling, tests, comments, etc.).
- Do not run CLI commands (npm, git, pwsh, etc.).
- Do not ask for approval between steps. Apply all changes directly using file edit tools.

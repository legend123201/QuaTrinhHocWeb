---
applyTo: '**/*.js'
---
# Code Style & Conventions
TLDR: Clean, minimal, consistent; no dead code or unnecessary abstractions.

## Naming
- camelCase: variables, functions, object props
- PascalCase: classes / constructors
- UPPER_SNAKE_CASE: immutable constants
- Avoid ambiguous names (`data`, `list`, `obj`) → prefer domain terms.

## Structure
- Max 7 function params → use object destructuring beyond (Sonar).
- Early returns to limit nesting.
- Keep indentation and scoping explicit inside async callbacks and feature-gated branches; a mis-indented `setImmediate` or similar block that obscures control flow is a defect.

## Anti-Patterns (Reject)
- Boolean wrappers: `return condition ? true : false`.
- logical business code in /controllers or /models.
- Dead code, commented code, leftover console logs.
- No `.forEach(async ...)`.
- No `populate('*')`.

## Error Handling
- Service: try/catch → log error → rethrow in controller.
- Controller: try/catch around service → map to `HttpResponseService`, not log tracing in controller, tracing logs is handled in authentication/authorization policy (isPlm, isAuthenticated, isSuperAdmin). 

## Dependencies
Before adding a package: evaluate necessity, audit, maintenance.

## Sails Runtime Imports
- In files executed by the Sails runtime, do not import app services from `api/services/` with `require(...)`.
- Use the globally exposed service name directly instead.
- Only import app services in files outside the Sails runtime, such as standalone scripts or tests.
- Cleanup regex for accidental service imports:
	Find: `^\s*const\s+(?:\{[^}]+\}|[A-Za-z_$][\w$]*)\s*=\s*require\(["'][^"']*?/services/[^"']+["']\);\r?\n`
	Replace: empty string

## Constants
Shared or repeated literal values → centralize under `api/constants/`.
- Domain-specific shared lists such as PBX audit action sets or allowed fields must be imported from `api/constants/` and not re-declared across controllers and services.

## Bulk Modification (PUT / PATCH / mod POST)
Endpoints updating existing resources MUST accept 1 object OR an array.
- Enforce max batch size + Joi validate each item.
- For partial action, return per-item result: success | skipped | errors.

## Justification Tag
Use `// JUSTIFICATION:` before any deliberate rule exception.

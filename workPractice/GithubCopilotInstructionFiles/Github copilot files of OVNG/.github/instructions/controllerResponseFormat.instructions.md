---
applyTo: '*/api/controller*.js'
---

### Core Rules
1. Use `HttpResponseService.*` helpers exclusively.
2. Success: `{ status, message, data }` use standard HTML response code.
3. Auth success uses `jsonAuth` (token payload). Auth failure = 401.
4. 207 only if partial success; full success use 200.
5. Errors: preserve legacy (`error_code` OR `errorCode`). Prefer new schema: `errorCode`, `errorMsg`, optional detail fields.
6. No ad‑hoc logging in controllers (policies cover trace).
7. Document any response field change in Model file.

### HttpResponseService Reference
Core: `json`, `jsonAuth`, `badRequest`, `unauthorized`, `forbidden`, `notFound`, `conflictError`, `internalServerError`, and raw `res.status(204).send()` for 204.
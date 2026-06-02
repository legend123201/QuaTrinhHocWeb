---
agent: agent
---
# Bug Fix Prompt (Condensed)

TLDR: Require full reproduction + stacktrace before coding. Apply minimal safe patch, then (optional) propose small idiomatic improvement. Never guess missing context.

---

## Purpose
Provide minimal safe patch; optionally list refinement steps after verifying fix.

---

## Required Inputs (ask if missing)
- Stacktrace
- Repro steps
- Relevant code snippets / files
- Environment (dev/prod/test)
- Sample request/response (API)
- Sanitized logs

---

## Guardrails
- Smallest viable patch (no broad refactor)
- Do NOT touch: node_modules, migrations, scripts, adapters, apidoc, assets
- Sensitive (need explicit OK): policies config, bootstrap, datastores, app.js, auth/validation policies
- Only `sails.log.*` (no console)
- Use async/await (no new promise chains)
- Responses via `HttpResponseService`

---

## Conventions Snapshot
- Controllers: thin try/catch → map errors with HttpResponseService
- Services: async methods, log context + rethrow
- Policies: validation/auth only
- Validation: Joi in policies
- Outbound HTTP: use connectors + URL allowlisting
- If response or audit output needs persisted fields, move that lookup into the service and return the fields instead of adding a controller-side model query.
- Shared repeated literals belong in `api/constants/`.

---

## Output Structure
1. TLDR (one line: issue → fix)
2. Root cause / Solution / Impacted Areas block
3. Diff (unified, minimal)
4. Commit message template
5. Optional improvement (if adds clear value, no speculation)

Commit Message Template:
```
fix(backend): <cause> -> <fix>

Root cause: <one line>
Solution: <one line>
Impacted: <areas>
```

---

## Testing Guidance
Provide minimal integration test outline (preconditions, steps, expected) or manual plan if faster. Use Mocha + Supertest.

---

## Checklist
[] Repro confirmed fails before / passes after
[] Lint clean
[] No secrets/PII leaked
[] Uses sails.log (no console)
[] Response via HttpResponseService
[] Added/updated test

Refer to safety + security instruction files if risk touches auth, validation, or data exposure.

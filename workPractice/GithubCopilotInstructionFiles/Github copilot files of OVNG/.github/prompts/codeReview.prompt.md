---
agent: agent
---
# Route Policy Coverage Review Prompt (Condensed)

TLDR: Generate controller/action matrix → compare against `config/policies.js` → list unmapped (violations) in `errorReview.md`.

## Steps
1. Extract routes: `node extractRoute.js` (produces / updates `extractRoute.md`).
2. Run policy compliance: `node checkPolicies.js` (ensures mapping logic available).
3. Parse `extractRoute.md` for Controller | Action pairs.
4. Load `config/policies.js` and build set of mapped actions.
5. Compute difference → unmapped list.
6. Write `errorReview.md` with header:
	`| Controller | Action |` then rows sorted alphabetically.

## Constraints
- Do NOT open extremely large raw route files directly (use extraction scripts).
- Do not guess missing policies; only report unmapped.
- Ignore actions intentionally excluded only if explicit comment `// UNPROTECTED_OK` exists in policies config (otherwise list them).

## Output (errorReview.md)
| Controller | Action |
| ---------- | ------ |
| <Name> | <actionName> |

No extra commentary unless asked. If none missing, write: `All controller actions are mapped in config/policies.js`.

Refer to `architecture.instructions.md` for required policy ordering if remediation is requested.

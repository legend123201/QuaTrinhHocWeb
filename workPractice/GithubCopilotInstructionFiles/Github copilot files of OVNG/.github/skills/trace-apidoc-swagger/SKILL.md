---
name: trace-apidoc-swagger
description: "Use when: tracing and listing per-API details from generated APIDOC Swagger (openapi) in this backend. Covers npm run apidoc output, swagger operation fields, route/controller/policy mapping, and documentation drift checks. Keywords: swagger trace, apidoc, openapi, list API info, route mapping, policy chain."
argument-hint: "Provide one API (METHOD + path) or say all APIs, and specify swagger target (swagger.json, swagger-cirrus.json, or swagger-terra.json)."
---

# Trace APIDOC Swagger

Use this skill to generate a complete per-API trace from APIDOC Swagger output to backend implementation details.

## When To Use

- You need a per-endpoint inventory from generated Swagger.
- You need to trace Swagger operations to route, policy, and controller action.
- You need to detect documentation drift (Swagger and route mismatch).
- You need a review-ready API matrix for migration, testing, or governance.

## Expected Inputs

Provide:

- Scope: one API or all APIs
- Target swagger file: apidoc/swagger/swagger.json, apidoc/swagger/swagger-cirrus.json, or apidoc/swagger/swagger-terra.json
- Optional filters: tag, prefix, method, org-specific paths

If swagger target is not provided, default to apidoc/swagger/swagger.json.

## API Fields To Capture Per Operation

For each API operation, capture these fields:

- method
- path
- operationId
- summary
- tags
- deprecated
- security requirements
- request content types
- request schema ref
- required request fields (if schema is object)
- response status codes
- response schema refs per status
- response sample refs (if available)
- source swagger file
- backend route match (yes or no)
- controller and action
- policy chain from config/policies.js
- actionUserActivities and mapping (if present)
- implementation status notes (active, migrated, removed, unknown)

Use [API trace template](./assets/api-trace-template.md) for output.

## Procedure

1. Generate APIDOC output.
- Run: npm run apidoc
- Verify the target swagger file exists in apidoc/swagger.

2. Enumerate swagger operations.
- Read paths from the target swagger file.
- Expand each method under each path into one operation record.

3. Normalize method and path.
- Convert method to uppercase.
- Keep route placeholders as :param or {param} notation consistently in your report.

4. Trace each operation to route definitions.
- Search first in routes/api/routes.js.
- If not found, also check routes/web/routes.js and routes/infra/routes.js.
- Capture route object details: controller, action, actionUserActivities, mapping.

5. Resolve policy chain.
- Open config/policies.js.
- Find policy list for the resolved controller and action.
- Record missing policy mappings as explicit findings.

6. Resolve controller implementation.
- Locate controller action function.
- Capture service entry point called by that action (if obvious).
- If function is removed or file is missing, mark as migrated/removed candidate.

7. Build the final per-API list.
- Fill one template block per operation.
- Keep status explicit: matched, partial, mismatch, missing.

8. Run drift checks.
- Swagger operation exists but no route match: doc-only or stale documentation.
- Route exists but no swagger operation: undocumented API.
- Route action exists but no policy: security coverage gap.
- Route exists but controller action missing: broken mapping or migration residue.

## Decision Points

- If scope is all APIs and output is very large: split by tag or path prefix.
- If both routes/api/routes.js and routes/web/routes.js define similar API: record both and mark primary entrypoint.
- If an API is known migrated to Nest backend v2: keep it in report with status migrated and add source evidence.
- If swagger responses use shared refs only: record refs and do not expand full schema inline unless requested.

## Completion Checklist

- [ ] npm run apidoc completed for current branch
- [ ] target swagger file selected and read
- [ ] all operations in scope enumerated
- [ ] each operation mapped to route/controller/action or marked missing
- [ ] policies resolved per mapped action
- [ ] request and response schema refs recorded
- [ ] drift findings captured
- [ ] final report delivered using template format

## Useful Anchors

- apidoc/swagger/swagger.json
- apidoc/swagger/swagger-cirrus.json
- apidoc/swagger/swagger-terra.json
- routes/api/routes.js
- routes/web/routes.js
- routes/infra/routes.js
- config/policies.js
- api/controllers/

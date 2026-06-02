---
name: verify-dispatching-api-on-dev-cluster
description: "Use when: reviewing backend APIs in this Sails.js repository that dispatch requests to downstream microservices and need live verification against a dev cluster using real data. Use for runtime evidence on web-tier APIs exposed through the /api/ proxy only, comparing code expectations with actual cluster responses, validating request body shape, error responses, and downstream-dispatch behavior. Requires a cluster base URL and a JWT token. Do not use username/password. Ignore /ov/v1 proxy behavior during review unless the user explicitly asks for deployment troubleshooting."
argument-hint: "Provide the cluster base URL, JWT token, orgId, and the web-tier /api route(s) to verify live."
---

# Verify Dispatching API On Dev Cluster

Use this skill when an API under review is primarily a dispatch layer in the backend: the route enters Sails.js, policies validate it, the controller delegates to a service, and the service calls another microservice or connector. For backend-native APIs that only use Mongo models and local services, prefer static code review and only use live cluster calls when the user explicitly asks for runtime evidence.

This skill is specific to this repository and the current dev-cluster review workflow.

## When To Use

- Review APIs in `routes/web/routes.js` that are exposed through the `/api/...` proxy and dispatch to other microservices.
- Confirm whether request validation, response shaping, and downstream connector behavior match the code.
- Compare real cluster errors with route, policy, controller, and service code.
- Verify only failing or risky behaviors. Ignore success cases in the findings output unless they are needed to prove an error.
- Produce a temporary Markdown findings file in the repository root when the review requires a persisted evidence report.

## Required Inputs

Provide all of these before live verification:

- cluster base URL, for example `https://ovng-dev.bre-lab.ale-international.com`
- JWT token only
- for every route that includes `orgId`, provide 2 JWT tokens: one org-admin token and one org-viewer token
- target route(s) under `/api/...`
- orgId and any other concrete identifiers needed by the route

Do not ask for or use username/password. Do not rely on `/ov/v1/...` during this workflow. Treat `/api/...` as the authoritative live path for dispatching API verification in this cluster setup.

## Decision Rule

### Branch A. Dispatching API

Use live cluster verification when the backend service calls a connector, microservice client, or external downstream API.

Signals:
- service calls under `api/connectors/`
- controller/service names tied to network config, alerts, event monitoring, reporting, infra, or similar remote domains
- policy and swagger mismatches that need real request/response evidence

### Branch B. Backend-native API

Do not spend time on live cluster calls when the API is handled entirely by backend code and Mongo models. Review by code only unless the user explicitly asks for runtime confirmation.

Signals:
- service reads/writes Waterline/Mongo models directly
- no downstream connector involved
- defects are already provable from route, policy, controller, service, and model code

## Procedure

### Step 1. Confirm the route entry and runtime path

- Resolve the route in `routes/web/routes.js`.
- Use `/api/...` as the live URL path.
- Ignore `/ov/v1/...` proxy behavior for findings in this workflow.
- If the user also wants third-party route parity, review `routes/api/routes.js` statically after the web-tier runtime verification.

### Step 2. Prove the API is worth live verification

Before running any cluster call, trace the code path:
- route
- policy chain in `config/policies.js`
- controller action
- service function
- connector or microservice call

If no downstream dispatch exists, stop the live path and continue with static review only.

### Step 3. Derive the real request shape from code, not from swagger alone

For every dispatching API, inspect:
- Joi policies in `api/policies/`
- controller `req.allParams()` / `req.body` usage
- service parameter shape
- swagger body schema in `apidoc/swagger/**`

Build the final required request body from the effective runtime contract, not from documentation alone.

Important rule:
- When swagger and policy differ, trust the policy/controller/runtime path first, then report the mismatch as a finding.

### Step 4. Execute live requests against the dev cluster

Use a non-browser HTTP client or terminal request with:
- `accept: application/json`
- JWT cookie header or equivalent token transport already used by the cluster
- the exact `/api/...` route

For every route that includes `orgId`:
- run the relevant read-only checks with the org-viewer token
- run the same route with the org-admin token when admin parity matters
- for mutating routes, verify the org-viewer token is forbidden or otherwise blocked from modifying data
- report any missing admin/viewer token as missing evidence and keep RBAC verification partial

Run only the minimum requests needed to prove an error. Prefer:
- one request that demonstrates the failure
- one corrected request if needed to prove the actual accepted contract

Do not waste time collecting green-path evidence unless it is required to prove the defect.
For string fields, example name or description:
- Test all the possibility ex : ASCII, non-ASCII, empty string, very long string, string with special characters, etc.
- Purpose is to verify that a regex validation is not missing in Joi. Ex /^[a-zA-Z0-9_=+.-]+$/ or /^[\x20-\x7F]+$/ or  /\$(\w+)/g

Example: with orgId 6566c607f8e1d1cb2f622c00 and API get users.
```(bash)
curl 'https://eu.manage.ovcirrus.com/api/organizations/6566c607f8e1d1cb2f622c00/users' \
  -H 'accept: application/json, text/plain, */*' \
  -H 'accept-language: en-US,en;q=0.9,fr-FR;q=0.8,fr;q=0.7,vi;q=0.6' \
  -H 'cache-control: no-cache' \
  -b 'jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0dnIiOiJza3I5eSIsInVzZXJJZCI6IjY1YzFmODU0YjYyOTQwNGU0NjA5MWY1YSIsImlzc3VlIjoiMjAyNi0wNC0yMVQwNjo0MjoyNC42NzFaIiwiaWF0IjoxNzc2NzUzNzQ0LCJleHAiOjE3NzY3OTY5NDR9.bxz2orxMb7ywIqTt3HDmYs0J9SD0H1Rhi1MkTbAn71s' \
  -H 'pragma: no-cache' \
  -H 'priority: u=1, i' \
  -H 'referer: https://eu.manage.ovcirrus.com/organizations/6566c607f8e1d1cb2f622c00/users' \
  -H 'sec-ch-ua: "Google Chrome";v="147", "Not.A/Brand";v="8", "Chromium";v="147"' \
  -H 'sec-ch-ua-mobile: ?0' \
  -H 'sec-ch-ua-platform: "Windows"' \
  -H 'sec-fetch-dest: empty' \
  -H 'sec-fetch-mode: cors' \
  -H 'sec-fetch-site: same-origin' \
  -H 'user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'
```

### Step 5. Focus findings on errors only

Ignore success cases in the final findings unless they are necessary evidence for the failure.

When reviewing a route that includes `orgId`, prefix each finding title with `[RBAC]`.

Good examples:
- request body documented as nested but runtime requires flat fields
- route comment says POST but live method is GET
- policy requires fields not documented in swagger
- controller maps downstream 404 to a misleading backend entity/field
- downstream error is swallowed or re-shaped incorrectly
- web-tier runtime works but code parity in `routes/api/routes.js` is inconsistent

Bad examples:
- repeating that a happy-path fetch returned 200 with empty data when it adds no risk insight

### Step 6. Write a temporary Markdown findings file in the repo root when requested

When the user wants persisted output, create a temporary Markdown file in the repository root, for example:
- `tmp-backend-api-review.md`
- `tmp-dispatch-api-findings.md`

The file should contain:
- review target
- cluster base URL
- route(s) verified
- findings only
- JSON evidence blocks only when needed to prove a failure
- brief missing-evidence section only if a check is still partial

For `orgId` routes, findings must clearly state whether admin-token and viewer-token checks were both completed.

Do not create permanent documentation under `.github/documentation/` for this workflow.

### Step 7. Feed the result back into the main review

After runtime verification:
- keep the main findings severity-ordered
- separate code-proven defects from runtime-proven defects only if that distinction matters
- do not restate the full workflow again in the final output

## Completion Checks

- The reviewed route is confirmed to be a dispatching API, not a backend-native API.
- Live calls were made only through `/api/...`.
- Request body shape was derived from policy/controller code and cross-checked with swagger.
- For every reviewed route that includes `orgId`, admin and viewer JWT coverage was completed or explicitly called out as missing evidence.
- Only failing or risky behaviors are included in findings.
- `/ov/v1/...` proxy behavior is excluded from findings unless the user explicitly requested deployment troubleshooting.
- If requested, a temporary Markdown findings file exists in the repo root with JSON evidence only where necessary.

## Example Prompts

- Review this dispatching API on the dev cluster using the `/api/...` path only. Here is the cluster URL, JWT, orgId, and route.
- Verify whether this network-config API body matches the real runtime contract on dev. Ignore `/ov/v1` and focus on `/api`.
- Check this web-tier API that dispatches to a microservice and write the findings to a temporary Markdown file in the repo root.

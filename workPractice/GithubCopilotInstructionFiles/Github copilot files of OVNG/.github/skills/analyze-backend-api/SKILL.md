---
name: analyze-backend-api
description: "Use when: analyzing a backend API in this Sails.js repository for code review, bug investigation, troubleshooting, route tracing, policy/auth review, audit-log validation, controller-service-model flow analysis, or microservice connector debugging. Covers APIs exposed through routes/web/routes.js, routes/api/routes.js, and routes/infra/routes.js."
argument-hint: "Provide the HTTP method and path, controller/action, log snippet, or failing behavior, and say whether the goal is code review or troubleshooting."
---

# Analyze Backend API

Use this skill to trace how an API request enters the backend, which policies protect it, which controller and service execute it, whether it reaches a model or connector, and which review or troubleshooting checks must be applied.

This skill is specific to this repository.

## When To Use

- Review an existing API for correctness, risks, regressions, or architecture violations.
- Troubleshoot a failing API from an error report, log line, route, controller, or service.
- Trace an endpoint from route definition to policy, controller, service, and data access layer.
- Verify audit-log wiring, locale keys, or response formatting for a mutating API.
- Confirm whether an API is called from frontend UI, an internal cluster microservice, or an external third-party caller.

## Expected Inputs

Provide any of these starting points:

- Controller and action name
- HTTP method and path (optional)
- A question such as "review this API" or "why does this endpoint return 403"

If the input is incomplete, infer the path by tracing from the strongest available signal first: route, log, controller/action, then service.

## Route Entry Classification

Start by identifying where the request enters.

### 1. Frontend UI entry

- Check `routes/web/routes.js` first by the controller and action name
- Check `routes/infra/routes.js` and `routes/admin/routes.js`, if the API are in privileged admin or infra route, highlight them in the findings. They must have documented justification and diagram workflow and **MUST be** controlled by a policy.
- Most UI-driven APIs are declared here.
- `routes/api/routes.js` is a subset/external exposure related to web APIs and is controlled by CORS for frontend access.

### 2. External third-party entry

- Check `routes/api/routes.js`.
- These APIs are exposed to third-party applications.
- Compare the matching route in `routes/web/routes.js` when behavior or audit wiring needs to be cross-checked.

### 3. Internal cluster microservice entry

- Check `routes/infra/routes.js`.
- These APIs are called internally from cluster microservices.
- Infra routes commonly use `isInfraMSAuthenticated`.

## Fast Route Discovery

Use one of these entry points:

### From HTTP method and path

Search in:

- `routes/web/routes.js`
- `routes/api/routes.js`
- `routes/infra/routes.js`

Also check other route groups only if the API does not appear in the three main files:

- `routes/admin/routes.js`
- `routes/ovp/routes.js`
- `routes/healthcheck/routes.js`
- `routes/test/routes.js`

### From policy logs

If logs contain one of these patterns, use the `controller::action()` fragment to locate the route:

```js
sails.log.info("Policies::isAuthenticated() - waitForStorage done " + req.options.controller + "::" + req.options.action + "() userId " + req.user.id);
sails.log.info("#SECU isInfraMSAuthenticated() - req.method is " + req.method + ">" + req.options.controller + "::" + req.options.action + "()");
```

Interpretation:

- `Policies::isAuthenticated()` usually means a user-facing or externally authenticated route.
- `#SECU isInfraMSAuthenticated()` usually means an infra microservice route.
- Once `controller::action()` is known, search route files for that controller and action pair.

### From controller/action

Search the route files for the controller path and action name together.

## Analysis Workflow

Follow these steps in order.

### Step 1. Resolve the route definition

Capture:

- HTTP method
- Path
- controller
- action
- route group (`web`, `api`, `infra`, or other)
- `actionUserActivities` and `mapping` if present

Questions to answer:

- Is this API exposed to UI, third-party, or internal microservices?
- Is the route duplicated across `web` and `api` and, if so, are they consistent?
- Is this a mutating route that should have audit logging?

### Step 2. Resolve the policy chain

Check the route mapping in `config/policies.js`.

For each policy, determine whether it handles:

- authentication
- authorization
- Joi validation
- content-type enforcement
- object-scope permission

Apply these repository rules:

- Routes with `:objectId` must include `isAuthenticated`, `isObjectRolePermission`, and validation policy.
- `POST`, `PUT`, and `PATCH` routes must include `isJsonContentType`.
- Auth and authorization checks belong in policies, not controllers or services.
- Policy validation can query models for simple checks or call services for shared logic.

### Step 3. Trace the controller

Inspect the controller action.

Controller expectations:

- Thin request parsing only
- Delegates business logic to a service
- Uses `HttpResponseService` to format responses
- No direct DB access
- No trace logging in controller
- Errors mapped through `HttpResponseService.internalServerError`

If the controller contains business logic, direct persistence, complex branching, or ad hoc response formatting, flag it.

### Step 4. Trace the service

Inspect the called service function and any delegated helpers.

Service expectations:

- Owns the business logic
- Returns `{ data, status }`
- Calls models for persistence or connectors for microservices
- Catches errors, logs with `sails.log.error`, then rethrows or returns normalized status objects

Design constraints to verify:

- Split services that grow beyond roughly 3000 lines into smaller domain services.
- Split functions that exceed 7 condition checks into smaller functions.
- Prefer early returns to reduce nesting.
- Avoid duplicated logic already available in shared services or helpers.

### Step 5. Identify the data layer branch

Decide which branch the service follows.

#### Branch A. Database or model path

Check models and model helpers when the service performs persistence.

Review for:

- unbounded queries
- N+1 patterns
- incorrect permission scoping
- business logic leaking into models
- deletion behavior and association impact

#### Branch B. Microservice path

Check connectors under `api/connectors/` when the service calls another microservice.

Review for:

- correct connector method selection
- payload shaping
- error propagation for `400`, `401`, and `403`
- timeout or retry behavior when relevant
- whether the controller ultimately preserves the normalized response contract

### Step 6. Review response contract

Confirm the controller formats results via `HttpResponseService`.

Expected behavior:

- Service returns `{ data, status }`
- Controller maps status to the right HTTP response helper
- No ad hoc success or error payload shape
- No raw stack trace in responses
- If the controller performs a model lookup only to enrich response or audit-mapping fields, flag it; the service should return those fields directly.

When connector-backed services are involved, confirm that validation and auth failures from the microservice are caught and returned coherently to the controller.

### Step 7. Review audit logging for mutating APIs

For `POST`, `PUT`, `PATCH`, and `DELETE` routes that change organization-level data (involving orgId in path or data), inspect whether audit logging is correctly wired. For user-specific or non-organization data changes (e.g., user preferences, table configurations), audit logging is not required.

Check (when audit logging is required):

- `actionUserActivities` exists on the route when required
- `mapping` keys align with returned data structure
- translation keys exist in `config/locales/en.json` and `config/locales/fr.json`
- translation values are not empty strings
- route mapping keys match the placeholder keys used in locale strings
- PBX external audit records write to `UserActivity`, not `PbxAuditActivity`
- PBX-source filtering uses `createdBy: "PBX"`, and shared PBX audit lists come from `api/constants/pbxAudit.js`
- PBX audit read endpoints paginate directly on the single `useractivity` collection with `skip` and `limit`; flag application-side merges, dual-collection reads, or `$unionWith`

Important repository rule:

- Empty translation values in `en.json` or `fr.json` can trigger restart issues in nodemon and must be treated as defects.

### Step 8. Review logging and security hygiene

Apply these logging rules everywhere in the API path:

- Never use `console.log`; use `sails.log.*`
- Never log sensitive data such as passwords, passphrases, tokens, or secrets
- Avoid logging long payloads over 2000 characters at `info` level
- Large object payloads belong in `debug` only if truly needed
- Logs inside `catch` blocks must use `sails.log.error`
- Controllers should not add trace logs

If a log leaks secrets, uses the wrong level, or is overly verbose, flag it.

## Decision Points

### If the goal is code review

Focus on findings first.

Review dimensions:

- incorrect route exposure or missing route parity
- missing or wrong policies
- controller violating thin-layer rules
- service complexity, duplication, or missing split
- improper model or connector usage
- broken response contract
- missing or inconsistent audit logging (for organization-level data changes only)
- invalid or empty locale keys
- unsafe or noisy logging
- missing tests for service or policy changes

Output format:

- Severity-ordered findings
- File references and concrete evidence
- Open questions only if a key fact remains ambiguous
- Short residual risk note if no hard defect is proven

### If the goal is troubleshooting

Focus on reconstructing the failing path.

Troubleshooting dimensions:

- which route actually handled the request
- which policy blocked or transformed it
- whether the controller invoked the expected service
- whether the service failed before persistence or connector call
- whether the connector or model returned an unexpected status
- whether audit or locale configuration caused a secondary failure
- whether logging exposes the exact failing layer

Output format:

- probable failing layer
- root-cause hypothesis backed by file evidence
- smallest next validation step
- follow-up fix recommendation only after the failure point is clear

## Completion Checklist

- [ ] Route found and classified (`web`, `api`, `infra`, or other)
- [ ] Policy chain verified in `config/policies.js`
- [ ] Controller traced and checked for thin-layer compliance
- [ ] Service traced and checked for complexity and ownership of logic
- [ ] Data layer branch identified: model or connector
- [ ] Response contract checked through `HttpResponseService`
- [ ] Audit wiring checked for mutating routes (organization-level only)
- [ ] Locale keys checked in `config/locales/en.json` and `config/locales/fr.json`
- [ ] Logging checked for level, size, and sensitive data leakage
- [ ] Missing tests or validation gaps called out when relevant

## Useful Repository Anchors

- `routes/web/routes.js`
- `routes/api/routes.js`
- `routes/infra/routes.js`
- `config/policies.js`
- `api/controllers/`
- `api/services/`
- `api/models/`
- `api/connectors/`
- `config/locales/en.json`
- `config/locales/fr.json`

## Related Documentation

- [.github/documentation/device-network-feature.md](../../documentation/device-network-feature.md)
- [.github/documentation/server-side-event-workflow.md](../../documentation/server-side-event-workflow.md)
- [.github/documentation/organization-site-creation.md](../../documentation/organization-site-creation.md)

## Example Prompts

- `/analyze-backend-api Review PUT /organizations/:orgId/sites/:siteId for auth, audit, and response issues.`
- `/analyze-backend-api Troubleshoot why POST /infra/... returns 401; here is the policy log line ...`
- `/analyze-backend-api Trace UserController::update from route to service to connector and find the likely failure point.`
- `/analyze-backend-api Check whether this DELETE API is missing audit wiring or locale keys.`
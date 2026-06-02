---
applyTo: 'api/{controllers,services,policies,models,routes}/**/*.js'
---

# Architecture & Layering

TLDR: Controllers thin; policies validate/auth; services hold logic; models persist; every route mapped to policies.

---

## Layer Roles
- Controllers: parse req, call service, format response only.
- Services: business logic, orchestration, external connectors.
- Policies: auth, Joi validation, authorization (permission to access the scope/ device/ site in request, pay attention to limited role).
- Models: persistence; avoid business logic side effects, pay attention to deletion chain for dependency association.
- Connectors/Adapters: external API / microservice wrappers (read API configuration from ./config/env/*.js).

---

## Controllers Rules
- No complex branching (>3 levels) → move to service (for Sonar).
- No direct DB calls; go through service/model helpers.
- Do not query models from controllers just to enrich response payloads or audit-mapping fields; the service must return the required fields.
- Always use `HttpResponseService` helpers.
- No logging at start; only error or contextual debug if needed.

---

## Routes & Policies Mapping
- All custom routes declared in `config/policies.js`.
- Use empty array `[]` for intentionally unprotected routes (rare; must have comment).
- Routes with `:objectId` must include: `isAuthenticated` `isObjectRolePermission`, validation policy.
- Routes POST PUT or PATCH must include `isJsonContentType` policy. 

---

## Service Rules
- Use sequential `await` only when dependency required; not allow `Promise.all`.
- Not use sails mongo `.select()` when the model is `schema: false`.
- Return the identifiers and display fields required by the controller response or audit mapping instead of forcing follow-up model reads in the controller.

---

## Models Rules (Sails.js / Waterline ORM)

### Allowed / Authorized Attribute Properties

When defining `attributes` in models, ONLY use the following authorized keys:

## Core Properties
- `type` (string, number, boolean, json, ref)
- `required`
- `unique`
- `defaultsTo`
- `allowNull`

## Validation Rules
- `isIn`
- `isEmail`
- `isURL`
- `maxLength`
- `minLength`
- `max`
- `min`
- `regex`

## Database Mapping
- `columnName`
- `columnType`
- `autoCreatedAt`
- `autoUpdatedAt`

## Metadata (optional but allowed)
- `description`
- `example`

## Associations
- `model` (one-to-one)
- `collection` (one-to-many / many-to-many)
- `via`

---

### Strict Rules
- DO NOT introduce custom/unknown attribute keys.
- DO NOT embed business logic inside model definitions.
---

---
applyTo: '**/*.js'
---
# Safety Gate Instructions

Always evaluate a request BEFORE generating or modifying code. Never generate code while key facts are unknown.

## Checklist (fail any → pause & ask)
1. Clarity: Route, model(s), policy chain, and expected behavior are explicitly known (else: ask).
2. Special logic condition add Problem statement or ticket reference in code comment.
`// JUSTIFICATION: <short reason>` above any intentional rule deviation.
3. No duplicated code: search for existing routes, models, policies, logic to helpers/services before create new. 
4. Risk: Public interface / auth / security / dependency major bump? Flag it.
5. Validation: ask for precised validation rule (for Joi, authentication, authorization).
6. Logging: Uses `sails.log` (no console) & no PII or keys/tokens.
7. Error handling: Centralized via `HttpResponseService` keep stack trace in responses.

## High-Risk Triggers (require explicit user confirmation)
- Model schema change / migration required
- Auth / permission policy modification
- Rate limiter / CORS / security headers change
- Dependency major version bump
- API format change in microservice connector (impact service, controller, audit, apidoc, validation schema)

## Output Requirements
When high-risk: Ask for confirmation before processing.
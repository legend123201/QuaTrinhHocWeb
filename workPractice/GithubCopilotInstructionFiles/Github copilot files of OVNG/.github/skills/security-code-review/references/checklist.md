# Security Review Checklist

Use this checklist to keep reviews focused on concrete security and reliability defects.

## 1. Authentication and Authorization

- Every protected endpoint is covered by the correct policy chain.
- JWT validation is not duplicated in controllers or services.
- Admin-only or object-scope authorization checks happen in policy, not deep in business logic.
- Missing or inconsistent `403` behavior is treated as a finding.

## 2. Validation and Untrusted Input

- Params, query, and body validation exist in Joi policies.
- Search, filter, and external connector inputs are sanitized before query construction.
- Upload flows respect file and payload limits.
- Binary parsing validates offsets, lengths, and decoded values before use.

## 3. Secrets, Logging, and Error Exposure

- No plaintext credentials, tokens, or keys are stored or logged.
- Logging uses `sails.log.*`, not `console.*`.
- Error handling stays centralized and does not leak stack traces or internal secrets in API responses.
- Log context includes correlation or user or org identifiers when available.

## 4. Cryptography and Sensitive Data

- Sensitive MongoDB fields use `encrypt: true` when applicable.
- New encryption logic uses authenticated encryption, not unauthenticated CBC patterns.
- No deprecated crypto APIs or hardcoded keys are introduced.
- Secret loading stays in env or dedicated config, never source defaults for production paths.

## 5. Y2K38 and Time Boundaries

- Load `.github/instructions/y2k38.instructions.md` when the review touches timestamps, JWT expiry, signed URLs, migrations, or binary time parsing.
- Treat absolute Unix seconds as a compatibility risk unless an external contract requires them.
- Validate external JWT claims such as `exp`, `iat`, and `nbf` for missing, negative, non-numeric, or unrealistic values.
- Flag persisted numeric expiry fields and 32-bit coercions on time values.
- Require boundary coverage around `2147483647`, `2147483648`, wrapped negative values, and far-future valid millisecond timestamps.

## 6. External Boundaries and Connectors

- Downstream service responses and decoded tokens are not trusted without validation.
- Signed URL expiry and external time parameters are treated as interoperability boundaries.
- Connector retries, refresh flows, and fallbacks fail closed instead of silently widening access.

## 7. Tests and Closeout

- Security-relevant fixes in services, policies, and helpers include Vitest regression coverage.
- Review output stays severity-ranked and evidence-based.
- If no finding is raised, explicitly state the reviewed areas and any remaining blind spots.
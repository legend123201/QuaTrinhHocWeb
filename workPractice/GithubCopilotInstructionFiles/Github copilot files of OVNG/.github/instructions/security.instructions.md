---
applyTo: '**/*.js'
---

## Input & Data Handling
- Validate params/query/body via Joi **policies**; 400 on failure with normalized error format.
- Enforce max payload size (config/http.js) & rate limiting (config/rateLimiter.js).
- Register request upload file to multer header, also in swagger parser.
- For any JSON object received from request (filters, sort, etc.) that is used in MongoDB or SQL queries, strip keys starting with `$` before validation to prevent NoSQL/operator injection. Apply this sanitization in the Joi policy after `JSON.parse` and before `schema.validate`.
- When building MongoDB `$regex` queries from user-supplied filter values (`contains`, `startsWith`, `endsWith`), always escape regex metacharacters: `str.replace(/[\[\]{}()*+?.\\^$|]/g, "\\$&")`.
- When building SQL conditions from user-supplied filter values, escape single quotes (`val.replace(/'/g, "''")`) and validate column names against an allowlist. Never interpolate raw user input into SQL strings.

## Auth & Authorization
- Token validation in `isAuthenticated` policy; no duplicate checks in controller.
- 403 for insufficient rights or object not accessible for the request.
- For search and filter in request for the query in MongoDB or in MS connector API, always sanitize in service and validate text in Joi policy.
- For create/update requests, always have check admin role in policy.

## Secrets Management
- Never commit secrets; load from env or dedicated secret store.
- Mask secrets/password/passkey in debug output.

## Logging Rules
- Use `sails.log.{info,warn,error,debug}` only.
- Include context: `{ correlationId, userId, orgId }` when available.
- Log validation failures at info; unexpected exceptions at error.
- No console.*.

## High-Risk Changes (require review)
- Modifying CORS, Helmet, session, rate limiter, auth flow, encryption libs.

## Quick Rejects
- Review commit to revert bypass validation "temporarily" for dev/test.
- Adding wildcard CORS for routes not included in api/routes.js.
- Storing plaintext credentials.

## ISO 27001 Compliance (Annex A.8.24 — Use of Cryptography)

### Field-Level Encryption at Rest
- All sensitive fields stored in MongoDB MUST use `encrypt: true` (Waterline/`encrypted-attr`).
  - `encrypted-attr` uses **AES-256-GCM** with a 96-bit random IV and GCM auth tag per record. ✅
  - Applies to: `User.password`, `DevicePasswordManager.password`, `RainbowSetting.password`, and any PII field.
- Do NOT add new sensitive fields without `encrypt: true`.

### Key Management (DEK)
- The Data Encryption Key (DEK) MUST be loaded exclusively from `DATA_ENCRYPTION_KEY` env var — never fall back to a hardcoded default in non-dev environments.
- In `config/models.js`, the hardcoded fallback key is only acceptable for local/test. Production MUST fail at startup if `DATA_ENCRYPTION_KEY` is missing.
- Key rotation: add new key under a new keyId in `dataEncryptionKeys`, keep old keys for decryption only. Never delete old keys before all data is re-encrypted.
- Never store the DEK in source code, Docker image layers, or logs.

### Algorithm Rules
| Use Case | Required | Forbidden |
|---|---|---|
| Field-level encryption (DB) | AES-256-GCM (`encrypt: true`) | DES, 3DES, RC4, AES-CBC without auth tag |
| One-way credentials (user passwords) | bcrypt / Argon2 | MD5, SHA-1, plain SHA-256 |
| Temporary token encryption (licenses, transient) | AES-256-GCM | AES-256-CBC (no auth tag) |
| Key derivation from password | PBKDF2 / Argon2 | Raw SHA-256 hash as key |
| Transport | TLS 1.2+ (enforced in MongoDB config) | SSL, TLS 1.0/1.1 |

- `LicenseUtilityService.encryptCore` uses AES-256-CBC — **must be migrated to AES-256-GCM** before ISO 27001 certification. Track as known gap.

### Audit & Access Control
- Log all decryption operations on sensitive data with `{ correlationId, userId, orgId, field, action: 'decrypt' }` at `sails.log.info`.
- RBAC on MongoDB roles: application service account must have least-privilege access (no `dbAdmin` role in production).
- Decrypt operations in PII-related services must be traceable to a user action in `UserActivity`.

### Integrity
- Do not strip or ignore the GCM auth tag on decryption — a failed tag verification MUST throw and return 500, never silently return plaintext.
- When writing a custom encrypt/decrypt utility (outside Waterline), always use `createCipheriv`/`createDecipheriv` with `aes-256-gcm`. Never use deprecated `createCipher`.

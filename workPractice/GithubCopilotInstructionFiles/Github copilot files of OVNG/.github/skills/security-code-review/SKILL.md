---
name: security-code-review
description: "Use when: reviewing backend code or PRs for security risks, OWASP Top 10 issues, auth/authz gaps, Joi validation coverage, secret handling, logging exposure, cryptography misuse, external connector trust boundaries, or Y2K38 timestamp safety. Produces severity-ranked findings, open questions, and test gaps for the OmniVista Cirrus backend."
argument-hint: "Describe the files, diff, route, or subsystem to review."
---

# Security Code Review

Use this skill for security-focused backend reviews. It complements `.github/prompts/codeReview.prompt.md`, which is limited to route-policy coverage.

## When to Use

- Review a PR, diff, or set of files for security defects.
- Assess auth, authorization, validation, crypto, logging, secrets, external connectors, or date-handling risks.
- Perform a targeted review of timestamp logic, JWT expiry handling, signed URLs, or binary time parsing.

## Required Context

- Scope the review to changed files, a diff, or a named subsystem before making findings.
- Load the workspace instructions that apply to the files under review.
- Always read `.github/instructions/security.instructions.md` and `.github/instructions/safetyGate.instructions.md`.
- Also read `.github/instructions/y2k38.instructions.md` whenever the review touches absolute time, JWT claims, signed URLs, binary packet parsing, date persistence, or timestamp conversions.

## Procedure

1. Map the change surface.
   - Identify the affected routes, controllers, services, policies, connectors, models, config, and migrations.
   - Flag the review as high risk if the diff changes auth flow, permissions, sessions, CORS, rate limiting, encryption, secret loading, schema, or microservice contract formats.

2. Verify security boundaries.
   - Authentication and authorization belong in policies, not controllers or services.
   - Apply the OWASP Top 10 backend instruction as the baseline review lens for access control, authentication, injection, crypto, misconfiguration, integrity, logging, and SSRF-style boundary checks.
   - Params, query, and body validation must exist in Joi policies before controller or service logic runs.
   - External input from JWTs, signed payloads, query filters, HTTP connectors, and binary buffers is untrusted until validated.
   - Confirm unauthenticated requests fail with `401`, and confirm OmniVista data-read paths are protected by the relevant multi-level authorization checks in policy.

3. Run the checklist.
   - Use [Security Review Checklist](./references/checklist.md).
   - Record only concrete bugs, security regressions, behavioral risks, or missing tests. Do not inflate the review with style-only comments.

4. Apply Y2K38 checks when relevant.
   - Look for `Math.floor(Date.now() / 1000)`, JWT `exp` or `iat` or `nbf`, numeric absolute expiry fields, bitwise coercion on time values, `readUInt32LE`, or signed URL `exp` parameters.
   - Prefer `columnType: "datetime"`, ISO 8601 strings, or millisecond timestamps for absolute time.
   - At external protocol boundaries, require bounds validation, fail-closed behavior, and an explicit interoperability note when the contract cannot change.
   - Defer repo-specific hotspots and acceptable patterns to `.github/instructions/y2k38.instructions.md` so the review stays aligned with the latest instruction.

5. Validate findings with evidence.
   - Cite the exact file and line for each finding.
   - Explain the failure mode, likely impact, and the minimal safe fix direction.
   - If a category is clean, move on without inventing a concern.

6. Check regression coverage.
   - For services, policies, and helpers, recommend Vitest regression tests when a bug or risky change is present.
   - Require boundary tests for auth, expiry, parsing, and timestamp-sensitive logic.
   - Keep test suggestions aligned with `.github/instructions/tests.instructions.md`.

7. Produce the review result.
   - Findings first, ordered by severity.
   - Then open questions or assumptions.
   - Then residual risks or testing gaps.
   - If no material issue is found, say that explicitly and summarize what was checked.

## Output Contract

Use this structure:

1. Findings
2. Open questions or assumptions
3. Residual risks or test gaps

Each finding should include severity, why it matters, the impacted path, and the recommended fix direction.

## High-Risk Review Triggers

If the user pivots from review into implementation, ask for confirmation before changing code when the fix requires:

- auth or permission policy changes
- CORS, session, rate limiter, or security header changes
- schema or migration changes
- crypto algorithm or secret-handling changes
- external connector API format changes
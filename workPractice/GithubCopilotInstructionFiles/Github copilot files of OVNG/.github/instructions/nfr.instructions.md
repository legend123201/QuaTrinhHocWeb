---
applyTo: '**/*.js'
---
# Non-Functional Requirements — Story Delivery Checklist

Use these targets as acceptance criteria when implementing or reviewing any backend story.
UI-only requirements are excluded; check the frontend repo for those.

---

## 1. Performance
| Requirement | Target |
|---|---|
| API response time | p95 < 200 ms |
| Data analytics query | Aggregated queries < 2 s for 1,000 devices |
| Organization list (summary) | Admin scoped query (by MSP or non-MSP filter) — never full-collection scan; cluster may exceed 5,000 organizations |

**Code rules:**
- Log a warning for any DB query or external call that exceeds 1 s.
- No unbounded queries — enforce a hard cap (e.g. 200 records) or pagination.
- Avoid N+1: prefetch or batch; no population inside large loops.

---

## 2. Security
| Requirement | Target |
|---|---|
| Authentication | All API endpoints require JWT; token TTL ≤ 24 h |
| Authorization | RBAC enforced on every endpoint via policy |
| Vulnerability scan | Trivy CVE scan before each release; zero critical unpatched |
| Code quality | SonarQube: ≥ 80 % coverage, zero critical security issues |
| Data protection | GDPR: personal data encrypted at rest and in transit |

**Code rules:**
- JWT validation in `isAuthenticated` policy only — never duplicated in controllers.
- Admin-only mutations must check role in policy (not in service/controller).
- Never log PII, tokens, or secrets.
- See `security.instructions.md` for full rules.

---

## 3. Reliability / Availability
| Requirement | Target |
|---|---|
| API error messages | All errors are human-friendly; no raw 500 responses exposed |

**Code rules:**
- All errors flow through `HttpResponseService`; never `res.serverError()` with a raw stack trace.
- Map unexpected exceptions to a clean 500 payload with a correlation ID.
- See `responses.instructions.md` for payload format.

---

## 4. Scalability
| Requirement | Target |
|---|---|
| Simultaneous devices | ≥ 25,000 devices per cluster deployment |
| Concurrent API users | ≥ 100 concurrent users without performance degradation |

**Code rules:**
- Cap concurrency for external API fan-out (e.g. p-limit 5–10).
- Stream or paginate large device datasets — never load all in memory.
- See `performance.instructions.md` for batching and caching rules.

---

## 5. Maintainability / Monitoring
| Requirement | Target |
|---|---|
| Logging | Every API call logged (method, route, status, duration) |
| Swagger docs | Updated for every new endpoint or added/changed parameter |
| API versioning | All APIs in Swagger support versioning |

**Code rules:**
- Use `sails.log.{info,warn,error,debug}` — no `console.*`.
- Include `{ correlationId, userId, orgId }` in log context when available.
- New routes must have a matching Swagger/apidoc entry before merging.

---

## 6. Compliance
| Requirement | Target |
|---|---|
| GDPR | Personal data anonymized on export; consent managed |
| Audit logging | Audit logs retained per data-retention policy; accessible for audits |
| API security | All endpoints tested against OWASP Top 10 before release |

**Code rules:**
- Mask / omit personal identifiers in exported payloads.
- Audit log entries must be added for API modification actions, including the object affected with before/after details (for update case) and the user performing the action.
- Security review required for any auth, CORS, rate-limiter, or encryption change.

---

## Story-Done gate (non-functional)
Before marking a story Done, verify:
- [ ] p95 latency target met (or measured and documented if not yet load-tested).
- [ ] No new Sonar critical issues introduced.
- [ ] Swagger doc updated if any API surface changed.
- [ ] Trivy scan clean (or exceptions approved).
- [ ] GDPR: no new PII stored without encryption or consent handling.
- [ ] Audit log entries added for API operations.
- [ ] Unit tests cover the new code path (see `tests.instructions.md`).

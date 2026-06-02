---
agent: agent
---
# Sonar Issue Fix Prompt (Condensed)

TLDR: Require full issue metadata + code; apply minimal diff to close or reduce severity; avoid speculative refactors.

---

## Scope Snapshot
- Tech: Sails.js / Node.js / MongoDB
- Quality Gate targets: new code coverage ≥80%, zero new bugs/vulns, A maintainability, duplication ≤3%, hotspots reviewed

---

## Required Inputs
- Issue: type, severity, rule id, message, file, line
- Relevant code snippet or file section

---

## Guardrails
- Minimal diff (no broad refactor)
- Protected areas (policies config, bootstrap, datastores, app.js) need explicit approval
- No edits in: node_modules, migrations, scripts, adapters, apidoc, assets, captiveTmp
- Use async/await; replace console with sails.log
- Enforce Joi validation if adding input handling
- Use connectors + URL allowlist for outbound HTTP

---

## Steps
Install Sonar extension, then use a token to connect to the SonarQube server of OV.
Run SonarLint then fix only these rules, one by one:
1. Secrets / credentials
2. Dynamic code (eval/new Function)
3. SSRF (validate URLs)
4. Injection (NoSQL / query filters)
5. XSS / unsafe output
6. Logging (no PII/secrets)
7. Performance (N+1, missing limits)
8. Missing validation

---

## Output Structure
1. TLDR (issue → fix)
2. Rationale (3–5 lines: rule, risk, why safe)
3. Unified diff
4. Commit message:
```
fix(sonar): <type> <summary> [<rule id>]
```
5. Optional 3‑step refactor plan (Diagnosis / Fix / Validation) if larger context needed

---

## Checklist
[] Issue resolved / severity reduced
[] No new smells/vulns
[] Lint clean
[] No secrets/PII logged
[] Connectors used where applicable

Refer to security + performance instruction files if change affects auth, validation, or data handling.

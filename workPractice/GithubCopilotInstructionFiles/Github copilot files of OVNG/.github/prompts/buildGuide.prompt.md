---
agent: "agent"
---
# Dependency Update / Build Prompt (Condensed)

TLDR: Audit → Select safe updates → Apply minimal set → Build & test → Document risky skips.

## Dependencies (Before Adding)
1. `npm audit` (no high vulns) + optional Snyk
2. Active maintenance (<6 months) & healthy repo

## Steps
1. Audit current deps: `npm outdated` (built‑in) OR `npm-check -s` (if installed).
2. Export report: redirect output to `npmcheck.txt` for review.
3. Classify updates:
	- Patch/Minor (semver safe) → batch apply.
	- Major → evaluate CHANGELOG / breaking notes; apply individually.
4. Update selectively: edit `package.json` (avoid wildcards like `^latest`).
5. Install & rebuild: `npm install` → run build/tests.
6. Run security scan: `npm audit --production` (and optional `snyk test`).
7. Document in PR (Developer Defense): updated packages, skipped majors, justification.

## Guardrails
- Skip upgrade if breaking risk unknown (ask first).
- Do NOT auto‑upgrade transitive vulnerability with invasive major unless required.
- Keep lockfile committed.
- Never introduce unpinned git URLs or unpublished tarballs.

## Quick Checks Post-Install
- App boots without unhandled rejections.
- Lint & tests pass.
- No new high vulnerabilities (audit).

## Checklist
[] Report generated
[] Safe updates applied
[] Build/tests pass
[] Audit clean (no high/critical) or documented justification
[] PR notes include versions before → after

Refer to `performance.instructions.md` if dependency impacts runtime critical path.
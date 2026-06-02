---
description: "Use when implementing, reviewing, or documenting AI credit funding, reset, reconciliation, upgrade backfill, or balance mutation in the OmniVista backend. Covers AiCredit model, AiCreditService, Subscription lifecycle hooks, LicenseService allocation hooks, bootstrap cron entrypoint, and AI credit migrations."
applyTo: '{api/services/AiCreditService.js,api/models/AiCredit.js,api/models/Subscription.js,api/services/LicenseService.js,config/bootstrap.js,migrations/*aicredit*.js,api/services/tests/AiCreditService.spec.js}'
---

# AI Credit System

TLDR: `AiCredit` is one shared AI credit pool per organization. `Subscription` grants fixed free credits for `TRIAL` and `LITE`, removes that free pool on `TRIAL/LITE -> PAID`, `LicenseService` adds paid credits from imported licenses using duration mapping, the paid upgrade backfill is migration-only and uses remaining months, and monthly paid reconciliation is triggered by k8s cron through `JOB_NAME=cron-ai-credit-reconciliation`. The 30-day schedule is configured outside this repository.

---

## Source Of Truth

- The AI credit pool is organization-scoped and stored in the `AiCredit` model.
- The backend must treat `AiCredit` as a single shared balance per organization. Do not intentionally create multiple `AiCredit` records for one organization.
- Current `AiCredit` fields:
  - `organization`: owning organization
  - `balance`: current remaining balance
  - `used`: cumulative consumed credits
  - `lastReconciliationDate`: last paid monthly reconciliation timestamp
  - `usedAtLastReconciliation`: snapshot of `used` at the previous reconciliation boundary
- `used` is cumulative usage, not period usage. Period consumption is derived from `used - usedAtLastReconciliation`.

---

## Backend Ownership Boundary

- Chatbot MS owns prompt authorization and token accounting.
- Backend is not in the prompt authorization path.
- Backend is responsible for persistent AI credit mutations only:
  - fixed Trial/Lite grant
  - paid import allocation
  - Trial/Lite to Paid reset
  - upgrade backfill migration
  - monthly reconciliation
  - future balance deduction persistence after successful chatbot processing
- Audit logging is not required for this feature unless a future story explicitly adds it.

---

## Funding Models

### Trial And Lite

- `TRIAL` and `LITE` organizations receive a fixed free grant of `50` AI credits.
- The free grant is implemented in `AiCreditService.TRIAL_LITE_ACTIVATION_CREDITS`.
- The creation flow is handled by `AiCreditService.allocateCreditsFromTrialLiteActivation(...)`.
- This flow must remain idempotent: if an `AiCredit` record already exists, do not add another free grant.
- Trial/Lite free credits must never stack above the fixed free amount through re-approval or extension logic.

### Paid Import / Add-On / Renewal

- Paid import allocation uses the exact duration mapping in `AiCreditService.DURATION_CREDITS_MAP`:
  - `1 month -> 4`
  - `1 year -> 50`
  - `3 years -> 150`
  - `5 years -> 250`
- This mapping applies to paid license allocation on import, add-on, and renewal flows.
- Allocation is implemented by `AiCreditService.allocateCreditsFromImport(...)`.
- `LicenseService` is the runtime entry point that calls this service after paid license data is prepared.
- Current hooks in `LicenseService` call the allocation flow for:
  - subscription import / sync based on `subscriptionLicense.dlLicenses`
  - add-on flows based on `orderedLicensesAddon`
- Preserve the coterm vs non-coterm split:
  - coterm: use `activeLicense.productId`
  - non-coterm: use `unit.elementProductId || unit.productId`

### Paid Upgrade Backfill

- Upgrade backfill is not the same as import allocation.
- The backfill migration for existing paid organizations is `migrations/20260518120000-seed_aicredit_balance_for_existing_subscriptions.js`.
- That migration is for the 10.5.2 -> 10.6.1 paid backfill path and uses remaining months, not the duration map.
- Paid backfill formulas:
  - coterm: `4 * active licenses * remaining months`
  - non-coterm: `sum(4 * unit count * remaining months)`
- The migration must remain idempotent by skipping organizations that already have an `AiCredit` record.
- When paid backfill data is incomplete, the migration should warn and skip rather than mint guessed credits.
- Keep the warning behavior for:
  - missing `subscriptionlicense`
  - missing or inconsistent `coterm`
  - missing or invalid end date / expired date

### Critical Distinction

- Do not collapse these two paid formulas into one rule:
  - import/add-on/renewal allocation uses duration mapping
  - upgrade backfill migration uses remaining months

---

## Trial/Lite To Paid Conversion

- When an organization transitions from `TRIAL` or `LITE` to `PAID`, the free credit pool must be removed before the paid model takes over.
- This is implemented by `AiCreditService.resetCreditsOnPaidTransition(...)`.
- The transition hook is executed from `Subscription.beforeUpdate(...)`.
- The current implementation resets `balance` to `0` for the existing `AiCredit` record.
- Do not preserve unused Trial/Lite free credits after paid conversion.
- Do not stack the original free `50` on top of paid funding sources.

---

## Subscription Lifecycle Wiring

- `Subscription.beforeCreate(...)`:
  - grants Trial/Lite free credits on approved subscription creation
- `Subscription.beforeUpdate(...)`:
  - removes free Trial/Lite credits on `TRIAL/LITE -> PAID`
  - grants Trial/Lite free credits when a waiting subscription becomes approved
- Keep AI credit business rules in `AiCreditService`, not in the model body beyond lifecycle orchestration.

---

## Monthly Reconciliation

- Monthly reconciliation is implemented in `AiCreditService.reconcileMonthlyCredits()`.
- It is a backend-executed batch flow triggered by bootstrap through `JOB_NAME=cron-ai-credit-reconciliation`.
- The actual 30-day cadence is configured in the k8s / Helm repository, not here. Do not hardcode the schedule in backend code.

### Reconciliation Formula

Definitions:
- `L`: number of active licenses for the organization
- `Z = L * 4`
- `C`: credits consumed since last reconciliation = `used - usedAtLastReconciliation`
- `D`: deduction applied to the current balance

Rules:
- if `C >= Z`, then `D = 0`
- if `C < Z`, then `D = Z - C`
- final balance is `max(balance - D, 0)`

### Reconciliation Data Source

- `L` is currently computed from `SubscriptionLicense.dlLicenses` by summing every `unit.maxCount`.
- That counting logic lives in `AiCreditService.countActiveLicenses(...)`.
- Reconciliation only targets organizations with paid subscriptions.
- Reconciliation skips organizations with missing `SubscriptionLicense` or `dlLicenses` and logs a warning.

### First-Run Behavior

- If `lastReconciliationDate` is empty, reconciliation initializes the baseline only.
- First run must not deduct credits.
- First run sets:
  - `lastReconciliationDate`
  - `usedAtLastReconciliation = used`

### Cron Trigger Contract

- `config/bootstrap.js` handles batch jobs through `process.env.JOB_NAME`.
- The AI credit reconciliation cron case is:
  - `cron-ai-credit-reconciliation`
- Bootstrap should:
  - call `AiCreditService.reconcileMonthlyCredits()`
  - log the result
  - exit the pod with `process.exit(0)` on success
- If the reconciliation logic fails, let bootstrap throw so the k8s job fails visibly.

---

## Migrations

### Existing AI Credit Migrations

- `migrations/20260518120000-seed_aicredit_balance_for_existing_subscriptions.js`
  - seeds Trial/Lite fixed credits
  - seeds paid upgrade backfill from remaining months
- `migrations/20260519100000-add_reconciliation_fields_to_aicredit.js`
  - initializes `lastReconciliationDate`
  - initializes `usedAtLastReconciliation`

### Migration Rules

- Migrations may use direct Mongo access because they run through `migrate-mongo`.
- Runtime rules still apply conceptually:
  - keep calculations deterministic
  - avoid duplicate credit minting
  - prefer skip + warning over guessed balances on incomplete paid data
- Do not move k8s scheduler behavior into migrations.

---

## Logging Rules

- Runtime files must use `sails.log.info`, `sails.log.warn`, and `sails.log.error`.
- Keep logs organization-scoped where helpful, but do not log secrets or sensitive tokens.
- For AI credit flows, log enough context to debug:
  - organization id
  - allocation or deduction amount
  - formula path when relevant
  - skip reason for incomplete data

---

## Testing Expectations

- `api/services/tests/AiCreditService.spec.js` is the primary unit-test surface.
- When changing AI credit logic, add or update tests for:
  - Trial/Lite free grant idempotency
  - Trial/Lite -> Paid reset
  - paid import allocation for coterm and non-coterm
  - monthly reconciliation baseline behavior
  - monthly reconciliation deduction behavior
  - invalid / incomplete paid data handling when logic changes
- Preserve the distinction between import allocation tests and upgrade backfill behavior. Backfill logic lives in migrations, not in `AiCreditService`.

---

## Review Checklist

Before completing AI credit changes, verify:
- [ ] One `AiCredit` pool per organization is still the core assumption.
- [ ] Trial/Lite free credits remain capped at `50`.
- [ ] Trial/Lite free credits are removed on paid conversion.
- [ ] Paid import allocation still uses duration mapping.
- [ ] Paid upgrade backfill still uses remaining months.
- [ ] Monthly reconciliation still uses `L`, `Z`, `C`, `D` correctly.
- [ ] The bootstrap cron entrypoint remains `cron-ai-credit-reconciliation`.
- [ ] No backend change tries to own the external 30-day scheduler cadence.
- [ ] Tests cover the touched AI credit path.

---

## Current File Map

- `api/models/AiCredit.js`: shared AI credit data model
- `api/services/AiCreditService.js`: credit grant, paid allocation, reset, reconciliation logic
- `api/models/Subscription.js`: lifecycle hook orchestration for Trial/Lite grant and paid conversion reset
- `api/services/LicenseService.js`: paid credit allocation hook from subscription import / add-on flows
- `config/bootstrap.js`: k8s cron job entrypoint for reconciliation
- `migrations/20260518120000-seed_aicredit_balance_for_existing_subscriptions.js`: upgrade backfill migration
- `migrations/20260519100000-add_reconciliation_fields_to_aicredit.js`: reconciliation state migration

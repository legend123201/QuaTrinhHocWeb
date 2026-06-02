---
description: "Use when: implementing or reviewing organization creation flows, default object provisioning, trial subscription request, PLM approval/rejection, CAPEX license import, or any code that touches the organization bootstrap sequence. Keywords: createOrganization, createDefaultSetupOrganization, requestSubscriptionForOrganization, approveSubscription, rejectSubscription, importSubscriptionLicense, OVTX auto-trial, default site, default group, RF template, provisioning template."
applyTo: "api/{controllers,services,models}/**/*{Organization,Subscription,License,Site,Group,RFTemplate,Provisioning,Dashboard}*.js"
---

# Organization Lifecycle

TLDR: Organization creation always bootstraps a fixed set of default objects. Subscription follows one of two paths: TRIAL (PLM-gated) or CAPEX (admin self-service, no PLM needed). OVTX auto-seeds a TRIAL subscription at org creation; OVNG does not.

---

## 1. Organization Creation Flow

Entry point: `POST /organizations` → `OrganizationController.createOrganization` → `OrganizationService.createOrganization`.

### Step sequence

```
OrganizationService.createOrganization(params)
  ├── Organization.create(attributes)            // persists org to DB
  │     └── beforeCreate lifecycle: set random auditHour (0–1440 min)
  │     └── afterCreate lifecycle: OrgSiteBuildFlrAggr.create  (hierarchy cache)
  ├── lanSupportMicroServiceConnector.updateAuditConfigOption(orgId, { auditHour, timezone })
  │     // skipped when params.skipInfra === true
  ├── OrganizationSettingService.createOrganizationBasicSetting(orgId, params)
  │     // on failure: org is destroyed and error returned
  ├── RFTemplateService.createRFProfileDefault({ orgId, countryCode, timezone })
  └── ManagementUserTemplateService.createDefaultManagementUserTemplate({ orgId })

OrganizationController (after createOrganization succeeds)
  ├── RoleService.assignAdminForOrganization(orgId, mspId, userId)
  │     // MSP_ADMIN → ORG_ADMIN, MSP_VIEWER → ORG_VIEWER on the new org
  └── OrganizationService.createDefaultSetupOrganization(createOrgResponse, userId, params)
        ├── SiteService.createSite(orgId, userId, defaultSiteAttrs, isDefault=true)
        │     ├── Site.create(...)
        │     ├── ProvisioningTemplateService.createDefaultProvisioningAfterCreateSite(...)
        │     │     // creates default provisioning template in Infra MS
        │     ├── GroupService.createDefaultGroupForSite(siteId)
        │     │     // creates the default AP group in DB
        │     └── ProvisioningTemplateService.assignProvisioningTemplate(...)
        │           // links default provisioning config to the default group
        └── QueueService.storeSiteConfigurationQueue({ siteId })
              // async: pushes site config to Infra MS queue
```

### OVTX auto-trial

On OVTX deployments (`isDeploymentOption(OVTX) === true`), after `createDefaultSetupOrganization` succeeds the controller immediately calls `SubscriptionService.upsertSubscription` to seed a **pre-approved** TRIAL:

| Field | Value |
|---|---|
| `type` | `TRIAL` |
| `status` | `UNDER_TEASER` |
| `approvalStatus` | `APPROVED` |
| `allowedDevices` | `20` |
| `expectedDuration` | `90` days |
| `startDate` | org creation date (org timezone) |
| `endDate` | startDate + 90 days |
| `offer` | `["NW"]` |
| `isRAPRequested` | `false` |
| `requestedBy` | creating user |

On OVTX **no PLM action is required** — the trial is active immediately.

---

## 2. Default Objects Created at Organization Creation

All objects below are created synchronously unless noted.

### 2a. Database records (MongoDB via Waterline)

| Object | Model | Key defaults |
|---|---|---|
| **Organization** | `Organization` | `is2FARequired: false`, `idleTimeout: <org constant>`, `auditHour: random(1–1440)` |
| **OrgSiteBuildFlrAggr** | `OrgSiteBuildFlrAggr` | `{ organization, name, sites: [] }` — hierarchy cache for fast UI tree rendering |
| **OrganizationSetting** | `OrganizationSetting` | Basic password and notification settings created by `OrganizationSettingService.createOrganizationBasicSetting`; `isAutoAssignLicenseForNewDevice` defaults here |
| **Site** | `Site` | Name from `i18n("default_site_name")`, inherits `countryCode` and `timezone` from org, `zoom: 4` |
| **Group** | `Group` | Default AP group for the site, created by `GroupService.createDefaultGroupForSite`; provisioning config name set to `DEFAULT_PROVISIONING_CONFIG` |
| **OrganizationUser** | `OrganizationUser` | Role assignment for the creating user via `RoleService.assignAdminForOrganization` |
| **UserRoleProfile** | `UserRoleProfile` | Default `Admin` and `Viewer` profiles are seeded per organization — shared by all ORG_ADMIN / ORG_VIEWER users in that org |

### 2b. Infra microservice objects (via connectors)

| Object | Connector / Service | Notes |
|---|---|---|
| **Audit config** | `lanSupportMicroServiceConnector.updateAuditConfigOption` | Sends `auditHour` and `timezone` to LAN Support MS |
| **Default RF Template** | `RFTemplateService.createRFProfileDefault` | Created in the RF MS for the org, keyed by `orgId + countryCode + timezone` |
| **Default Provisioning Template** | `ProvisioningTemplateService.createDefaultProvisioningAfterCreateSite` | Created in the Provisioning MS, scoped to the default site |
| **Provisioning Template Assignment** | `ProvisioningTemplateService.assignProvisioningTemplate` | Links provisioning template to the default group |
| **Default Management User Template** | `ManagementUserTemplateService.createDefaultManagementUserTemplate` | Created in the OmniVista Management MS |
| **Site configuration** | `QueueService.storeSiteConfigurationQueue` | Async queue item; pushes site config to Infra MS after site creation |

---

## 3. Subscription Model

One organization → one `Subscription` record (managed via `findOrCreate` / upsert).

### Key `Subscription` fields

| Field | Values |
|---|---|
| `type` | `TRIAL` \| `LITE` \| `PAID` |
| `licenseMode` | `TRIAL` \| `LITE` \| `CAPEX` \| `FLEXIBLE` |
| `approvalStatus` | `WAITING_APPROVAL` → `APPROVED` \| rejected (deleted or `APPROVED` with cleared request) |
| `status` | `UNDER_TEASER` (default during trial) |
| `allowedDevices` | number of licensed devices |
| `startDate` / `endDate` | subscription window in `DD-MM-YYYY` format |
| `expectedDuration` | duration in days |
| `requestedBy` | userId of the requester |
| `isRAPRequested` / `isRAPApproved` | RAP (Remote Access Program) flags |

---

## 4. Trial Subscription Request (OVNG only)

After organization creation, an org admin requests a trial subscription:

**Route:** `POST /organizations/:orgId/subscription`  
**Policy chain:** `isAuthenticated`, `isOrganizationExist`, `isJsonContentType`, `isUserOrgAdminRole` (org-admin level required)  
**Controller:** `SubscriptionController.requestSubscriptionForOrganization`  
**Service:** `SubscriptionService.requestSubscriptionForOrganization`

### What happens on request

```
SubscriptionService.requestSubscriptionForOrganization(orgId, userId, params)
  ├── Subscription.findOrCreate({ organization: orgId }, attributes)
  │     attributes:
  │       type = "TRIAL"
  │       status = "UNDER_TEASER"
  │       approvalStatus = "WAITING_APPROVAL"
  │       requestedBy = userId
  │       isRAPApproved = false
  │       allowedDevices, expectedDuration, startDate, offer, addons, ...
  └── returns created Subscription

Controller (after service success)
  ├── Fetches admin + PLM users via UserService.getAdminUsers() + getPLMUsers()
  ├── QueueService.sendNewTrialSubscriptionRequestQueue(emailData)
  │     // notifies all ALE admin and PLM users by email
  └── Auto-approve check (no PLM action needed):
        if allowedDevices <= 20 AND expectedDuration <= 90 days:
          ├── SubscriptionService.updateSubscriptionById(id, { approvalStatus: "APPROVED", plmNotes: "AUTO Approved", endDate, startDate, newAllowedDevices: 0 })
          └── QueueService.sendInformSubscriptionResultToRequester(...)
              // notifies requester of auto-approval
```

### Auto-approval rule

| Condition | Result |
|---|---|
| `allowedDevices <= 20` AND `expectedDuration <= 90 days` | **Auto-approved** immediately — no PLM login needed |
| Any larger request | Stays `WAITING_APPROVAL` — PLM must act |

---

## 5. PLM Approve

**Route:** `PUT /organizations/:orgId/subscriptions/:subId/approve`  
**Policy chain:** `isAuthenticated`, `isPlm` (PLM-only)  
**Controller:** `SubscriptionController.approveSubscription`

### Approval branches by current `approvalStatus`

| Current `approvalStatus` | PLM action sets | Notes |
|---|---|---|
| `WAITING_APPROVAL` | `approvalStatus = APPROVED`, `allowedDevices`, `startDate`, `endDate` computed from `expectedDuration`, `plmNotes` | Initial trial approval |
| `UPDATE_REQUESTED` | `approvalStatus = APPROVED`, `endDate = newEndDate`, `expectedDuration` recalculated from `startDate`, `newEndDate = null` | User had requested more devices or time |
| `RENEWAL_REQUESTED` | `approvalStatus = APPROVED`, `startDate = today`, `endDate = newEndDate`, `expectedDuration` recalculated, `newEndDate = null` | Renewal approval |

After update:
- `QueueService.sendInformSubscriptionResultToRequester(updatedSubscription.data, informUserStatus)` notifies the org admin by email.

---

## 6. PLM Reject

**Route:** `PUT /organizations/:orgId/subscriptions/:subId/reject`  
**Policy chain:** `isAuthenticated`, `isPlm` (PLM-only)  
**Controller:** `SubscriptionController.rejectSubscription`

### Rejection branches by current `approvalStatus`

| Current `approvalStatus` | Rejection action |
|---|---|
| `WAITING_APPROVAL` | **Delete** the `Subscription` record entirely; send rejection email to requester |
| `UPDATE_REQUESTED` | Set `approvalStatus = APPROVED`, `newAllowedDevices = 0`, `newEndDate = null`; org remains active on previous plan |
| `RENEWAL_REQUESTED` | Set `approvalStatus = APPROVED`, `newEndDate = null`; org remains active on previous plan |

After action:
- `QueueService.sendInformSubscriptionResultToRequester(data, rejectStatus)` notifies requester.

---

## 7. CAPEX Paid License Import (No PLM Required)

An org admin imports a CAPEX subscription directly, bypassing PLM:

**Route:** `POST /organizations/:orgId/subscription-licenses`  
**Policy chain:** `isAuthenticated`, `isOrganizationExist`, `isJsonContentType`, `isUserOrgAdminRole`  
**Controller:** `LicenseController.importSubscriptionLicense`  
**Service:** `LicenseService.importSubscriptionLicense`

### What happens on CAPEX import

1. Admin provides `subscriptionId` and `activationCode` (from eBuy / Subscription Manager).
2. `LicenseService.importSubscriptionLicense` calls `datalakeConnector` to validate and fetch subscription data.
3. Creates or updates `SubscriptionLicense` record linked to the organization.
4. Updates the `Subscription` record:
   - `type = PAID`
   - `licenseMode = CAPEX`
   - `approvalStatus = APPROVED`
   - `startDate` / `endDate` from the Datalake payload
5. If the org was in TRIAL mode, it is upgraded to CAPEX. Trial data remains but CAPEX governs.
6. Audit log: `ACTION_IMPORT_SUBSCRIPTIONLICENSE`.

No PLM user is involved. The org is immediately active as a CAPEX organization.

See `paid-capex-subscription.instructions.md` for full CAPEX binding, sync, and add-on lifecycle rules.

---

## 8. Lifecycle State Summary

```
Organization created
  │
  ├─ Default objects created (Site, Group, Settings, Templates, OrgSiteBuildFlrAggr)
  │
  ├─[OVTX only]─ Subscription auto-seeded: TRIAL / APPROVED / 20 devices / 90 days
  │
  └─[OVNG]─ No subscription yet
        │
        ├── User requests TRIAL
        │     ├── allowedDevices ≤ 20 AND duration ≤ 90 → AUTO APPROVED
        │     └── larger request → WAITING_APPROVAL → PLM approves or rejects
        │
        └── Admin imports CAPEX license
              └── APPROVED immediately (no PLM) → type=PAID, licenseMode=CAPEX
```

---

## 9. Deletion Chain

When an organization is deleted (`Organization.afterDestroy`), the following are removed in order:

1. `Site` (cascades to site-level objects)
2. `DataPersistency`
3. `Dashboard`
4. `OrganizationUser` (cleaned by invalid org reference check)
5. `OrganizationInvitee`
6. `OrganizationSetting`
7. `Subscription`
8. `UserActivity`
9. `SMSProvider`
10. `CollectSupportInfo`
11. `GuestTemplateSetting`
12. `RainbowSetting`
13. `SubscriptionLicense`
14. `CaptivePortalCustomizedTemplate`
15. `DeviceLabel`
16. `OrgSiteBuildFlrAggr` (hierarchy cache)
17. Image bucket (if `imageUrl` exists)

Devices and reports are **not** deleted here — they are managed by infra MS synchronization before org deletion.

---

## 10. Key Rules for Implementors

- Do not add PLM checks to the CAPEX import path — it is intentionally admin self-service.
- Do not auto-approve TRIAL requests that exceed `allowedDevices > 20` or `expectedDuration > 90` — those must wait for PLM.
- On OVTX, the subscription is seeded inside `createOrganization` controller logic — do not move it to the service or model lifecycle.
- If `OrganizationSetting` creation fails, `createOrganization` rolls back by destroying the `Organization` — ensure any new default-object creation also rolls back or uses a compensating delete.
- The `OrgSiteBuildFlrAggr` entry is the hierarchy cache; update it via model lifecycle (`afterCreate`/`afterUpdate`/`afterDestroy`) — never patch it directly in service/controller logic.
- All default infra-MS objects (RF template, provisioning template, management user template) are best-effort. Their failure is logged but does not roll back the org creation.
- The default `Site` creation failure **does** roll back with a `DATABASE_ERROR`; it is required.

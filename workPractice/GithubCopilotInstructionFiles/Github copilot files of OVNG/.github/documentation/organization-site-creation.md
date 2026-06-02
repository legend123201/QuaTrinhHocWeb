# Organization & Site Creation — Workflow Documentation

## Overview

This document covers two creation flows:

1. **Organization creation** — `OrganizationService.createOrganization` + `createDefaultSetupOrganization`, orchestrated by `OrganizationController.createOrganization`.
2. **Site creation** — `SiteService.createSite`, called as part of organization setup or standalone.

Both flows are gated by the **subscription offer** (`offer` array in `Subscription`):
- `"NW"` (Network) → full network init (default site, RF template, provisioning, QoE thresholds, groups, site-user roles).
- `"PBX"` (Voice/PBX) → voice default objects init (see TODO section).
- `["NW", "PBX"]` → both flows execute independently.

---

## 1. Organization Creation Flow

### Default Objects / Data Created

#### MongoDB (Waterline / Sails)

| # | Model | Description | Condition |
|---|-------|-------------|-----------|
| 1 | `Organization` (create) | New org record with `name`, `countryCode`, `timezone`, `imageUrl`, `idleTimeout`, `auditHour` (random), `msp` | Always |
| 2 | `OrgSiteBuildFlrAggr` (create) | Hierarchy cache entry for the org (lifecycle `afterCreate` on `Organization`) | Always, via model lifecycle |
| 3 | `OrganizationSetting` (create) | Basic org settings via `OrganizationSettingService.createOrganizationBasicSetting` | Always — failure rolls back `Organization` |
| 4 | `Subscription` (create) | Trial subscription with `offer: ["NW"]`, `approvalStatus: "APPROVED"`, 90-day duration | **OVTX deployment only**, after default setup succeeds |
| 5 | `Dashboard` (create, bulk) | Default dashboards for the org, via `DashboardService.createDefaultDashboards` (lifecycle triggered) | Inside `Subscription.beforeCreate` when `approvalStatus === "APPROVED"` |
| 6 | `RainbowSetting` (create) | Basic Rainbow/UCaaS org settings, created if not exists | Inside `Subscription.beforeCreate` when `approvalStatus === "APPROVED"` |

> **Rollback:** If `OrganizationSetting` creation fails, the `Organization` record is destroyed immediately.

#### External Microservice APIs

| # | Service | Operation | Description | Condition |
|---|---------|-----------|-------------|-----------|
| 7 | LAN Support MS | `updateAuditConfigOption` | Registers audit config (auditHour + timezone) for the new org | Always, unless `skipInfra = true` |
| 8 | Provisioning MS | `RFTemplateService.createRFProfileDefault` | Creates the default RF profile template for the org | Always |
| 9 | Provisioning MS | `ManagementUserTemplateService.createDefaultManagementUserTemplate` | Creates the default management user template for the org | Always |

#### Role & Access

| # | Operation | Description | Condition |
|---|-----------|-------------|-----------|
| 10 | `RoleService.assignAdminForOrganization` | Assigns `ROLE_ORG_ADMIN` | Always |

#### Default Site (called from `createDefaultSetupOrganization`)

After the org is created, a **default site** is immediately created via `SiteService.createSite`. See **Section 2** for the full site creation object list and flowchart.

| # | Async Operation | Description |
|---|-----------------|-------------|
| 11 | `QueueService.storeSiteConfigurationQueue` | Enqueues a job to persist site configuration snapshot | After default site created |

---

### Organization Creation Flowchart

```mermaid
flowchart TD
    A([Start: createOrganization\nparams incl. name, countryCode, timezone, mspId]) --> B[MongoDB: Organization.create\nsets random auditHour via beforeCreate]

    B --> B2[MongoDB: OrgSiteBuildFlrAggr.create\norg hierarchy cache\nvia Organization afterCreate lifecycle]

    B2 --> C{skipInfra?}
    C -- No --> D[LAN Support MS API:\nupdateAuditConfigOption\nauditHour + timezone]
    C -- Yes --> E
    D --> E[MongoDB: OrganizationSetting.create\nvia createOrganizationBasicSetting]

    E --> F{OrganizationSetting\ncreated?}
    F -- No --> G[MongoDB: Organization.destroy\nRollback]
    G --> H([Return error])

    F -- Yes --> I[Provisioning MS API:\nRFTemplateService.createRFProfileDefault\norgId + countryCode + timezone]

    I --> J[Provisioning MS API:\nManagementUserTemplateService\n.createDefaultManagementUserTemplate\norgId]

    J --> K[RoleService.assignAdminForOrganization\norgId + mspId + userId]

    K --> L[OrganizationService\n.createDefaultSetupOrganization]

    L --> M{offer contains NW?}

    M -- Yes --> N[[SiteService.createSite\nDefault site creation flow\nsee Site Creation Flowchart]]
    M -- No --> O

    N --> O{offer contains PBX?}

    O -- Yes --> P[TODO: Voice default object init\nCreate voice default config\nCall default Voice MS API]
    O -- No --> Q

    P --> Q[QueueService.storeSiteConfigurationQueue\async site config snapshot]

    Q --> R{OVTX deployment?}

    R -- No --> S([Return 201 ORGANIZATION_SUCCESSFULLY_CREATED\norg + rfTemplate + provisioningConfig + mgmtTemplate])

    R -- Yes --> T[SubscriptionService.upsertSubscription\noffer based TRIAL subscription\napprovalStatus: APPROVED]

    T --> U[Subscription.beforeCreate lifecycle:\nDashboardService.createDefaultDashboards\nMongoDB: Dashboard bulk create]

    U --> V[Subscription.beforeCreate lifecycle:\nMongoDB: RainbowSetting.create\nif not exists]

    V --> S
```

---

## 2. Site Creation Flow

> **Offer gate:** The site creation flow (and all objects below) only applies when the subscription `offer` contains `"NW"` (Network). For a `"PBX"`-only subscription, site creation is skipped and the voice init path runs instead.

### Default Objects / Data Created

#### MongoDB (Waterline / Sails)

| # | Model | Description | Condition |
|---|-------|-------------|-----------|
| 1 | `Site` (create) | New site record with location and basic info | Always |
| 2 | `QoEParam` (create) | 20 default QoE thresholds linked to the new site | Always (after reporting MS succeeds) |
| 3 | `SiteUser` (create, bulk) | One `SiteUser` record per org member with a mapped role | Always, for each qualifying org user |

> **Rollback:** If the Reporting MS call fails, the newly created `Site` record is immediately destroyed (`Site.destroy`) before returning an error.

### External Microservice APIs

| # | Service | Operation | Description | Condition |
|---|---------|-----------|-------------|-----------|
| 6 | Reporting MS | `upsertSiteThreshold` | Registers 20 QoE threshold values for the new site | Always — **blocking gate**: failure rolls back site creation |
| 7 | Provisioning MS | `createDefaultProvisioningAfterCreateSite` | Creates a default provisioning template scoped to the new site (includes `timeZone`, `siteId`) | Always after reporting MS succeeds |
| 8 | Group MS / DB | `createDefaultGroupForSite` | Creates the default AP device group for the site | Always after provisioning template succeeds |
| 9 | Provisioning MS | `assignProvisioningTemplate` | Assigns the default provisioning template (`DEFAULT_PROVISIONING_CONFIG`) to the new default group | Only when default group is created successfully |
| 10 | Group MS / DB | `updateGroupById` | Updates the group's `provisioningTemplateName` to `DEFAULT_PROVISIONING_CONFIG` | Only when provisioning template assignment succeeds (status 200 or 201) |

---

### Site Creation Flowchart

```mermaid
flowchart TD
    A([Start: createSite\norgId, userId, params, isDefault]) --> B{isDefault = true?}

    B -- Yes --> C[MongoDB: Site.update\nSet isDefault=false\nfor all org sites]
    B -- No --> D

    C --> D[MongoDB: Site.create\nNew site record]

    D --> E[Build default QoE thresholds\n20 threshold values]
    E --> F[Reporting MS API:\nupsertSiteThreshold\norgId + siteId + thresholds]

    F --> G{Response success?}
    G -- No --> H[MongoDB: Site.destroy\nRollback site record]
    H --> I([Return HTTP_REQUEST_ERROR])

    G -- Yes --> J[MongoDB: QoEParam.create\n20 default thresholds\nlinked to site]

    J --> K[Provisioning MS API:\ncreateDefaultProvisioningAfterCreateSite\ntimezone + siteId]

    K --> L{Response success?}
    L -- No --> M([Return provisioning error])

    L -- Yes --> N[Group Service:\ncreateDefaultGroupForSite\nsiteId]

    N --> O{Group creation result?}

    O -- DATABASE_ERROR --> P([Return group error])

    O -- RESOURCE_SUCCESSFULLY_CREATED --> Q[Provisioning MS API:\nassignProvisioningTemplate\ngroupId + DEFAULT_PROVISIONING_CONFIG]

    Q --> R{Assignment success?\nstatus 200 or 201}

    R -- Yes --> S[Group Service:\nupdateGroupById\nset provisioningTemplateName]
    R -- No --> T[Log warning:\nassignment failed]

    S --> U
    T --> U

    U[Grant SiteUser roles:\nfetch all OrganizationUser in org] --> V[Loop each org user]

    V --> W{User org role?}
    W -- ROLE_ORG_ADMIN --> X[MongoDB: SiteUser.create\nROLE_SITE_ADMIN]
    W -- ROLE_ORG_VIEWER --> Y[MongoDB: SiteUser.create\nROLE_SITE_VIEWER]
    W -- Other roles --> Z[Skip — no SiteUser created]

    X --> AA
    Y --> AA
    Z --> AA

    AA{userId provided?} -- Yes --> AB[Fetch OrganizationUser role\nfor requesting user]
    AA -- No --> AC

    AB --> AD{User is\nROLE_ORG_LIMITED?}
    AD -- Yes --> AE[MongoDB: SiteUser.create\nROLE_SITE_ADMIN\nexception for limited user]
    AD -- No --> AC

    AE --> AC([Return RESOURCE_SUCCESSFULLY_CREATED\nsite + defaultGroup + provisioningTemplate])
```

---

## 3. Subscription Offer — Init Branch Summary

The `offer` array on the `Subscription` record controls which default objects are provisioned. This applies both during the **initial organization creation** (**OVTX** auto-subscription) and for **any future subscription activation/upgrade**.

| `offer` value | NW init (site + network stack) | PBX init (voice stack) |
|---------------|-------------------------------|------------------------|
| `["NW"]` | ✅ Run (default) | ❌ Skip |
| `["PBX"]` | ❌ Skip | ✅ Run |
| `["NW", "PBX"]` | ✅ Run | ✅ Run |

### NW (Network) Init — Objects Created

All objects listed in **Section 2 (Site Creation)** plus **Section 1 org-level** objects (RF template, provisioning template, management user template, LAN Support audit config).

### PBX (Voice) Init — Objects Created

> **TODO:** Voice/PBX default initialization is not yet defined. When implemented, this section should cover:
>
> - `voice default object` — MongoDB creation of a default voice configuration record linked to the org.
> - `call default Voice MS API` — External API call to the Voice/PBX microservice to register the organization and provision default voice settings.
>
> The exact model names, API endpoints, and rollback strategy are pending architecture decision.

### Offer-Based Branching Flowchart

```mermaid
flowchart TD
    START([Subscription activated / upgraded\norgId + offer array + approvalStatus: APPROVED]) --> CHECK_NW{offer contains NW?}

    CHECK_NW -- Yes --> NW[Run NW Network Init:\n → Site creation flow\n → RF Template\n → Provisioning Template\n → Management User Template\n → LAN Support audit config\n → QoE Thresholds\n → Default Group\n → SiteUser roles]

    CHECK_NW -- No --> CHECK_PBX1

    NW --> CHECK_PBX1{offer contains PBX?}

    CHECK_PBX1 -- Yes --> PBX[TODO: Run PBX Voice Init:\n → Create voice default object MongoDB\n → Call default Voice MS API]
    CHECK_PBX1 -- No --> COMMON

    PBX --> COMMON

    COMMON[Common regardless of offer:\n → DashboardService.createDefaultDashboards\n → RainbowSetting.create if not exists\n via Subscription.beforeCreate lifecycle] --> END([Init complete])
```
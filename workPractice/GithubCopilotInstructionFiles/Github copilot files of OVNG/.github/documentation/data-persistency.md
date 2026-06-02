# Data Persistency Per Organization

## Purpose

This document describes how data persistency is controlled per organization.

The backend stores the retention settings in MongoDB, per organization, in the `DataPersistency` collection.
Microservices in the cluster are expected to fetch these settings periodically and apply cleanup in their own databases.

The backend also has its own cleanup responsibility for backend-owned data. That cleanup is executed by starting the backend in the Kubernetes cron job with `JOB_NAME=cron-clean-data-persistency`.

## Scope

This document covers:

- the product retention rules shared by the dev team
- the current backend implementation and defaults
- the backend cleanup flow executed by `cron-clean-data-persistency`
- the organization-level retention policy for configuration backups

## Architecture Summary

At a high level, the design is intentionally split:

1. Organization admins update retention settings at organization level.
2. The backend validates and stores those values in MongoDB.
3. Each microservice reads the organization settings and purges its own data store.
4. The backend cron job purges backend-owned MongoDB data that belongs to the backend itself.

This means the backend is the source of truth for retention configuration, but it is not the only component that performs the cleanup.

## Historical Dev-Team Baseline

The initial dev-team baseline used mostly fixed retention durations.

| Feature | Duration |
|---|---|
| QoE | 30 days |
| Client Sessions | 365 days |
| Client Analytics | 365 days, with variable granularity subject to validation |
| Wifi RTLS | Last 14 days at 15-minute granularity, then aggregated per day beyond 14 days |
| Network Analytics | 30 days |
| Alerts | 30 days |
| Events | 30 days |
| UPAM Auth records | 30 days |
| IoT | 30 days |

This baseline was later replaced by configurable organization-level retention settings.

## Target Configurable Product Rules

The updated product direction is to make retention configurable per organization.

| Feature | Default | Min | Max | Notes |
|---|---:|---:|---:|---|
| QoE data | 15 days | 7 days | 30 days | Organization-level setting |
| Client list and sessions | 30 days | 7 days | 400 days | Organization-level setting |
| Client analytics and client traffic or throughput characteristics | 15 days | 7 days | 30 days | Organization-level setting |
| Wifi RTLS | 7 days | 7 days | 30 days | Organization-level setting |
| Network analytics such as AP health and CPU | 15 days | 7 days | 30 days | Organization-level setting |
| User activity report | 30 days | 7 days | 400 days | Product note grouped this with login attempts |
| Login attempts | 30 days | 7 days | 400 days | Product note grouped this with user activity |
| Alerts | 15 days | 7 days | 30 days | Organization-level setting |
| Events | 15 days | 7 days | 30 days | Organization-level setting |

## OV Lite Subscription Rules

For organizations using the OV Lite subscription mode, the Data Persistency behavior in the Settings UI is more restrictive than the generic organization rules.

### Settings page scope

The affected page is:

- Settings -> Basic Settings -> Data Persistency

### OV Lite UI restrictions

For OV Lite mode:

1. Every visible Data Persistency field is capped to a maximum value of 7 days.
2. Users cannot enter a value greater than 7.
3. Some Data Persistency fields are removed from the page entirely.

### OV Lite visible fields

The following Data Persistency fields remain visible in OV Lite mode, but each one must use a maximum allowed value of 7 days in the UI:

| Feature | OV Lite max allowed value |
|---|---:|
| UPAM Auth records | 7 days |
| Events | 7 days |
| Alerts | 7 days |
| Network analytics | 7 days |
| Client sessions | 7 days |
| Client analytics | 7 days |
| User activity report or audit logs | 7 days |
| Login attempts | 7 days |
| IoT data | 7 days |
| Collect support information, if exposed | 7 days |

### OV Lite removed fields

The following fields must not be visible on the Settings -> Basic Settings -> Data Persistency page for OV Lite mode:

| Hidden field in OV Lite | Backend field name |
|---|---|
| Wi-Fi RTLS | `wifiRtls` |
| QoE | `qoe` |
| Application Visibility Analytics | `avAnalytics` |
| Remote Packet Capture | `packetCapture` |

### OV Lite behavior summary

OV Lite should be treated as a product-level restriction layer on top of the generic data persistency model:

- the standard backend model can still contain broader retention capabilities
- the OV Lite UI must only expose the reduced subset of fields
- every visible field must be capped to 7 days

If backend validation is aligned specifically for OV Lite in the future, the API contract should enforce the same 7-day cap server-side, not only in the UI.

## Current Backend Implementation

### Storage Model

The backend stores per-organization retention values in the `DataPersistency` model.

Current persisted attributes include:

- `upamAuthRecords`
- `events`
- `alerts`
- `wifiRtls`
- `networkAnalytics`
- `clientSessions`
- `clientAnalytics`
- `auditLogs`
- `loginAttemps`
- `iotData`
- `qoe`
- `configurationBackup`
- `backupPerDevice`
- `collectInfo`
- `avAnalytics`
- `packetCapture`

If a `DataPersistency` record does not exist yet for an organization, it is created lazily when organization settings are fetched.

### Current Defaults and Validation Contract

The table below reflects the current backend code, not only the product target.

| DataPersistency field | Functional meaning | Default in backend | Allowed range in current validation | Enforcement owner |
|---|---|---:|---|---|
| `qoe` | QoE data | 15 days | 7 to 30 days | Downstream microservice |
| `clientSessions` | Client list and sessions | 30 days | 7 to 400 days | Downstream microservice |
| `clientAnalytics` | Client analytics and throughput characteristics | 15 days | 7 to 30 days | Downstream microservice |
| `wifiRtls` | Wifi RTLS data | 7 days | 7 to 30 days | Downstream microservice |
| `networkAnalytics` | Network analytics such as AP health and CPU | 15 days | 7 to 30 days | Downstream microservice |
| `alerts` | Alerts data | 15 days | 7 to 30 days | Downstream microservice |
| `events` | Events data | 30 days | 7 to 30 days | Downstream microservice |
| `upamAuthRecords` | UPAM authentication records | 30 days | 7 to 400 days | Downstream microservice |
| `iotData` | IoT data | 15 days | 7 to 30 days | Downstream microservice |
| `auditLogs` | User activity report and audit trail | 30 days | 7 to 400 days | Backend cron |
| `loginAttemps` | Login attempts | 90 days | 7 to 400 days | Backend cron |
| `configurationBackup` | Maximum backup age | 30 days | 1 to 90 days | Intended backup-retention logic |
| `backupPerDevice` | Minimum backups retained per device | 5 backups | 1 to 10 backups | Intended backup-retention logic |
| `collectInfo` | Collected support information | 7 days | 1 to 31 days | Backend cron |
| `packetCapture` | Remote packet capture retention | 7 days | Not part of current organization update validation schema | Backend cron |
| `avAnalytics` | AV analytics retention | 30 days | Not part of current organization update validation schema | Downstream microservice or future backend logic |

### Important Differences Between Product Target and Current Backend

There are a few differences between the product notes and the current backend implementation:

| Topic | Product target | Current backend behavior |
|---|---|---|
| Events default | 15 days | 30 days |
| Login attempts default | 30 days | 90 days |
| Client analytics long retention | Historical note allowed 365 days with aggregation | Current validation allows only 30 days max |
| Packet capture control | Not mentioned in the original product notes | Exists in model and backend cleanup flow |
| AV analytics control | Exists in model constants | Not part of current update validation schema |

These differences should be treated as implementation gaps or product-alignment items when the API contract is revisited.

## Update and Read Flow

### Update flow

Organization-level data persistency values are updated through the organization update flow.

The relevant logic is:

1. The request passes organization validation and `isDataPersistencySchemaValidated`.
2. The request is protected by organization admin authorization.
3. `OrganizationService.updateOrganizationById` extracts the supported retention keys from the request.
4. The backend updates the `DataPersistency` document for the target organization.

### Read flow

When organization settings are read:

1. The backend loads the organization.
2. It loads the `DataPersistency` record for that organization.
3. If the record does not exist, it creates one.
4. If some newer fields are missing, defaults are filled in memory before returning the response.

This lazy creation and backfill behavior keeps older organizations compatible when new retention fields are introduced.

## Backend Cleanup Flow

The backend cleanup is triggered in `config/bootstrap.js` when the process starts with `JOB_NAME=cron-clean-data-persistency`.

Execution order:

1. `LoginAttemptService.deleteDataPersistencyAllOrg()`
2. `UserActivityService.deleteDataPersistencyAllOrg(dataPersistencies)`
3. `CollectSupportInfoService.deleteAllExpiredCollectInfos(dataPersistencies)`
4. `CollectSupportInfoService.deleteLosedLinkZipFile(...)`
5. `RemotePacketCaptureService.deleteAllExpiredRemotePacketCaptures(dataPersistencies)`
6. `RemotePacketCaptureService.deleteLostLinkPcapFile(...)`
7. `LoginAttemptService.deleteDataPersistencyAllMsps()`

### What the backend cron actually deletes today

| Backend-owned data | Retention field used |
|---|---|
| Login attempts for organization users | `loginAttemps` |
| User activity and audit logs | `auditLogs` |
| Collect support information | `collectInfo` |
| Remote packet capture records | `packetCapture` |
| Orphaned support zip files | Not duration-based, cleaned as orphaned files |
| Orphaned PCAP files | Not duration-based, cleaned as orphaned files |

### What is only stored for microservices today

The following settings are currently stored by the backend so that external services can consume them, but the backend cron does not directly purge those data domains itself:

- `qoe`
- `clientSessions`
- `clientAnalytics`
- `wifiRtls`
- `networkAnalytics`
- `alerts`
- `events`
- `upamAuthRecords`
- `iotData`
- `avAnalytics`

This is the intended separation of responsibilities:

- backend owns the configuration and some backend-local cleanup
- microservices own cleanup of their own data stores

## Configuration Backup Retention Policy

Configuration backup retention must be controlled per organization using two parameters:

| Setting | DataPersistency field | Range | Default |
|---|---|---:|---:|
| Minimum backups retained per device | `backupPerDevice` | 1 to 10 | 5 |
| Maximum backup age in days | `configurationBackup` | 1 to 90 | 30 |

### Required behavior

The organization admin should be able to define:

1. the minimum number of backups that must remain per device
2. the maximum age of backups in days

If a backup is older than the maximum age, it can be deleted only when the device still keeps at least the minimum number of backups after deletion.

The retention policy should be applied when a new backup is successfully created.

### Retention rule

For each device:

- let `b` be the minimum number of backups to retain
- let `d` be the retention period in days
- let `n` be the number of backups younger than `d` days

The number of backups to retain is:

`retainCount = max(b, n)`

This means:

- if only a few recent backups exist, the policy still keeps at least `b` backups
- if many recent backups exist, the policy keeps all recent backups, even if that is more than `b`

### Examples

Assume:

- `b = 3`
- `d = 60 days`

Example 1:

- Switch 1 has 6 backups
- 4 backups are older than 60 days
- 2 backups are newer than 60 days
- `n = 2`
- `max(b, n) = max(3, 2) = 3`
- Result: retain 3 backups

Example 2:

- Switch 2 has 6 backups
- 1 backup is older than 60 days
- 5 backups are newer than 60 days
- `n = 5`
- `max(b, n) = max(3, 5) = 5`
- Result: retain 5 backups

### Expected deletion behavior

When a new configuration backup is created successfully for a device:

1. load all backups for that device
2. calculate which backups are younger than `configurationBackup` days
3. compute `retainCount = max(backupPerDevice, recentBackupCount)`
4. sort backups from newest to oldest
5. keep the newest `retainCount` backups
6. delete the remaining older backups

This guarantees that the organization never loses its minimum retained backups, even when all retained backups are old.

## Current Status for Configuration Backup Logic

The backend already stores and validates:

- `configurationBackup`
- `backupPerDevice`

However, these values are currently documented as the intended organization-level retention contract.
They should be applied by the configuration backup cleanup path when the retention policy is enforced.

## Recommended Alignment Work

To fully align product documentation and implementation, the following items should be reviewed:

1. Align defaults for `events` and `loginAttemps` with the agreed product values.
2. Decide whether client analytics should support long retention with aggregation, or remain capped at 30 days.
3. Decide whether `packetCapture` and `avAnalytics` should be formally exposed in the organization update validation schema.
4. Confirm where configuration backup retention is enforced and wire the retention rule if not already implemented in the backup flow.


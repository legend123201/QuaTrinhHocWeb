---
name: Audit log Agent
description: Write the audit log for APIs.
---

# Todo steps:
1.
- Ask the user for the controller file name that the user want to add audit log for APIs in it. Or, the list specific of APIs that the user want to add audit log for it. If the user provide the controller file name, find add API that have the regex "create", "update", "edit", "delete", "remove", "import", "export", that will be the APIs that need to add audit log. The API include "get", "find", "check" are not need.

2. 
- Add audit log for those APIs.

# Rules:
- Read other API that have audit log for reference.
- For APIs with the prefix "update" or "edit": fetch the existing record from the infra server or (Mongo DB) by id **before** the update, attach it as `oldData` on the service response, and pass it as the 5th argument to `HttpResponseService.json()` in the controller. After fetching, add a guard: `if (!oldData) { return oldDataResponse; }` to abort early if the fetch failed, before proceeding with the update call.
- For APIs that delete multiple records where infra can return 200 or 207: collect only the successfully deleted items (`e.status === 200`) into `auditLogData`, then pass it as `userActivitiesArray` (6th arg) with `oldData: auditLogData`. Handle three cases:
  - `statusCode 200` and `auditLogData.length > 0` → `HttpResponseService.json(200, ..., userActivitiesArray)`
  - `statusCode 207` and `auditLogData.length > 0` → `HttpResponseService.json(207, ..., userActivitiesArray)`
  - `statusCode 207` and `auditLogData` is empty (all failed) → `responseJson(207, ...)` with no audit log
- Always add i18n action keys to **all** locale files under `config/locales/`. Translate each value appropriately for its language.
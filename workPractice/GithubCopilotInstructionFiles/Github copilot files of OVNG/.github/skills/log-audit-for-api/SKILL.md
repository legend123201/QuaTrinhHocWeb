---
name: log-audit-for-api
description: "Use when: adding audit log to a new API, wiring up actionUserActivities for a route, registering action keys in en.json/fr.json, passing newData/oldData to HttpResponseService.json, or logging outside of HTTP response with addUserActivitiesInQueueOutsideAPIResponse. Covers the full 5-step binding of any POST/PUT/PATCH/DELETE route to the UserActivity audit log mechanism."
---

# Audit Log Binding — How to Wire an API to UserActivity

All POST, PUT, PATCH, and DELETE actions must be recorded in the UserActivity collection (except login/logout which use a separate collection). Follow these 5 steps whenever you add or update a mutating route.

PBX-specific note:
- External PBX audit events also belong in `UserActivity`. `createExternalUserActivity()` writes to `UserActivity` and marks the record with `createdBy: "PBX"`.
- PBX audit read paths must filter the shared collection instead of creating or merging a separate `PbxAuditActivity` collection. Use native Mongo pagination on the single collection.
- Shared PBX audit constants such as `PBX_BEFE_ACTIONS` and `PBX_ALLOWED_FIELDS` must come from `api/constants/pbxAudit.js`.

---

## STEP 1 — Declare `actionUserActivities` and `mapping` in both route files

Edit **both** of these files:
- `routes/web/routes.js`
- `routes/api/routes.js`

### Syntax

```js
["PUT /organizations/:orgId/example/:exampleId"]: {
    controller: apiVersion + "/ExampleController",
    action: "updateExample",
    actionUserActivities: ["ACTION_UPDATE_EXAMPLE"],
    mapping: [
        {
            example_Name: ["name"],
        },
    ],
},
```

### `actionUserActivities` rules

- Array of action key strings: `["ACTION_<VERB>_<OBJECT>"]`
- Verb: `CREATE`, `UPDATE`, `DELETE` (or custom like `RESTART`, `ACKNOWLEDGE`).
- Object: singular (`DEVICE`) or plural with `MULTI` prefix (`MULTIDEVICE`).
- **MULTI rule**: If the action contains `MULTI` in the third part (e.g. `ACTION_CREATE_MULTIDEVICE`), you **MUST** also declare a matching singular action key in i18n (e.g. `ACTION_CREATE_DEVICE`), because if the batch operates on only one item it is dynamically converted.
- Multiple actions on one route → multiple entries in the array (one mapping object per action at the same index).

### `mapping` rules

Each mapping object maps i18n template variables → dot-path into the response data (`newData` or `oldData`):
- Path uses `.` for nesting and `[0]` via `.0` index.
- Spaces between paths mean concatenation: `"firstname lastname"` → `"John Wilson"`.
- Parentheses are literal separators: `"serialNumber (type)"` → `"N4567896 (OAW-1201)"`.
- Provide fallback alternatives in the array (first non-empty wins): `["serialNumber (type)", "serialNumber", "name"]`.

#### Common mapping patterns

| Scenario | Mapping |
|---|---|
| Single object by name | `{ entity_Name: ["name"] }` |
| Single object by compound field | `{ device_Name: ["serialNumber (type)", "serialNumber", "name"] }` |
| Batch count | `{ entity_NbItems: ["data.length"] }` |
| Batch first-item name | `{ entity_Name: ["data.0.name"] }` |
| First item + count (MULTI) | `{ entity_NbItems: ["data.length"], entity_Name: ["data.0.name"] }` |
| No dynamic data | `mapping: [{}]` |

#### Real examples from codebase

```js
// Single DELETE
["DELETE /organizations/:orgId/sites/:siteId/devices/:deviceId"]: {
    actionUserActivities: ["ACTION_DELETE_DEVICE"],
    mapping: [{ device_Name: ["serialNumber (type)", "serialNumber", "name"] }],
},

// Bulk DELETE (MULTI → also needs ACTION_DELETE_DEVICE in i18n)
["DELETE /organizations/:orgId/devices"]: {
    actionUserActivities: ["ACTION_DELETE_MULTIDEVICE"],
    mapping: [{
        device_NbDevices: ["data.length"],
        device_Name: ["data.0.serialNumber (data.0.type)", "data.0.serialNumber", "data.0.name"],
    }],
},

// Multiple actions on one route (mass import: create + update + fail)
["POST /organizations/:orgId/sites/:siteId/devices/massimport"]: {
    actionUserActivities: ["ACTION_CREATE_MULTIDEVICE", "ACTION_UPDATE_MULTIDEVICE", "ACTION_IMPORT_MULTIDEVICE_FAIL"],
    mapping: [
        { device_NbDevices: ["data.length"], device_Name: ["data.0.serialNumber (data.type)", "data.0.serialNumber", "data.0.name"] },
        { device_NbDevices: ["data.length"], device_Name: ["data.0.serialNumber (data.0.type)", "data.0.serialNumber", "data.0.name"] },
        { device_NbDevices: ["data.length"], device_Name: ["data.0.serialNumber (data.0.type)", "data.0.serialNumber", "data.0.name"] },
    ],
},

// Report examples (from the codebase)
["PUT /organizations/:orgId/reporting/reports/:reportId"]: {
    actionUserActivities: ["ACTION_UPDATE_REPORT"],
    mapping: [{ name: ["name"] }],
},
["DELETE /organizations/:orgId/reporting/reports/:reportId"]: {
    actionUserActivities: ["ACTION_DELETE_MULTIREPORT"],
    mapping: [{ name: ["data.0.name"], count: ["data.length"] }],
},
```

---

## STEP 2 — Declare action keys in i18n locale files

Edit **all** supported locale files under `config/locales/`:
- `en.json`
- `fr.json`
- `zh.json`, `ja.json`, `de.json`, `es.json` (if translation available)

### Key format

```
"ACTION_<VERB>_<OBJECT>": "<Human readable sentence with %{variable} placeholders>"
```

Variables in the sentence must match keys declared in the `mapping` object.

### Examples

```json
// en.json
"ACTION_CREATE_BUILDING": "Add Building '%{building_Name}'",
"ACTION_UPDATE_BUILDING": "Update Settings of Building '%{building_Name}'",
"ACTION_DELETE_BUILDING": "Delete Building '%{building_Name}'",

"ACTION_CREATE_REPORT": "Add Report '%{name}'",
"ACTION_UPDATE_REPORT": "Update Report '%{name}'",
"ACTION_DELETE_REPORT": "Delete Report '%{name}'",
"ACTION_DELETE_MULTIREPORT": "Delete %{count} Reports",
```

```json
// fr.json
"ACTION_CREATE_BUILDING": "Ajout du bâtiment '%{building_Name}'",
```

### MULTI naming rule example

If you declare `ACTION_DELETE_MULTIDEVICE`, also declare `ACTION_DELETE_DEVICE` because a multi-delete on one item auto-converts to single:

```json
"ACTION_DELETE_DEVICE": "Delete Device '%{device_Name}'",
"ACTION_DELETE_MULTIDEVICE": "Delete %{device_NbDevices} Devices"
```

---

## STEP 3 — Pass `newData` and `oldData` in the controller

The data for the audit log is extracted from the `HttpResponseService.json()` call signature:

```js
HttpResponseService.json(status, res, message, data, oldData = null, userActivitiesArray = null)
//                                               ^^^^  ^^^^^^^
//                                             newData  oldData
```

| HTTP method | `data` (newData) | `oldData` |
|---|---|---|
| POST (create) | created entity | `null` |
| PUT / PATCH (update) | updated entity | entity before update |
| DELETE | deleted entity / deleted entities array | `null` for most; pass `data` as `oldData` if needed |

### Controller pattern

```js
// CREATE — pass newData only
return HttpResponseService.json(201, res, constants.REPORT_SUCCESSFULLY_CREATED, response.data);

// UPDATE — pass newData and oldData
return HttpResponseService.json(200, res, constants.REPORT_SUCCESSFULLY_UPDATED, response.data, response.oldData);

// DELETE — pass deleted record as data (becomes oldData internally for ACTION_DELETE_*)
return HttpResponseService.json(200, res, constants.RESOURCE_SUCCESSFULLY_DELETED, response.data);
```

> **Important:** The `mapping` paths reference fields inside the returned `data` object (newData) or `oldData`. Make sure the returned object actually contains the fields referenced in the mapping.

> **Layering rule:** If a controller is reading a model only to supply audit-mapping fields, that is a controller/service boundary bug. Move the lookup into the service and return the required fields in `response.data` instead, as with PBX `updateMtclCredentials()` returning `ccProductId` and `name`.

---

## STEP 4 — Declare keys to omit from audit display (optional)

If the response data contains fields that must not appear in the audit log (e.g. internal IDs, large payloads), add them to:

```
api/constants/omitUserActivityDataKeys.js
```

---

## STEP 5 — Register display function for new object types (optional)

If your entity is a new type not yet registered, add an entry to:

```
api/constants/matchUserActivityObjectId.js
```

Example:
```js
{ type: "wallType", serviceFunction: require("../services/WallService").getWallTypeById }
```

This allows the audit log to resolve an object ID to its display name.

---

## Special case — Log outside of HTTP response

Use `addUserActivitiesInQueueOutsideAPIResponse` when you need to log an activity that is **not** tied to the current HTTP response (e.g., side effects during user creation that also create an org and a default site).

```js
const activitiesRequest = HttpResponseService.updateUserActivitiesRequest(
    req,
    "ACTION_CREATE_ORGANIZATION",
    null,          // mapping (null = use route mapping)
    req.user,
    organizationId,
    siteId
);

HttpResponseService.addUserActivitiesInQueueOutsideAPIResponse(activitiesRequest, [
    { data: newOrg, oldData: null },
]);
```

---

## Quick checklist

- [ ] `actionUserActivities` added to route in **both** `routes/web/routes.js` and `routes/api/routes.js`
- [ ] `mapping` object declared with correct dot-paths to response fields
- [ ] `ACTION_*` keys added to `en.json` and `fr.json` (all locales)
- [ ] If `MULTI` action → matching singular action key also declared in i18n
- [ ] `HttpResponseService.json()` called with correct `data` and `oldData`
- [ ] Response data actually contains the fields referenced in the mapping
- [ ] PBX-specific audit flows use the shared `useractivity` collection with `createdBy: "PBX"` filtering instead of a dedicated PBX audit collection
- [ ] New fields to hide from audit log added to `omitUserActivityDataKeys.js` (if needed)
- [ ] New entity type registered in `matchUserActivityObjectId.js` (if needed)

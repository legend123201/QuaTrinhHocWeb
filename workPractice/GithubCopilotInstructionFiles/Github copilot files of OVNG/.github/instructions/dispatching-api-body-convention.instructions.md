---
description: "API body request conventions for frontend-to-backend-to-microservices dispatching endpoints including WlanAnalytics, Alert, SwitchAnalytics, and NetworkEvents. Defines standard validation schema parameters."
name: "Dispatching API Body Convention"
applyTo: "api/controllers/{WlanAnalytics,Alert,SwitchAnalytics,NetworkEvents}Controller.js, api/connectors/*MicroServiceConnector.js"
---

# Dispatching API Body Convention (Read-Only Fetch Data)

When creating or modifying APIs that fetch and dispatch data from the frontend through the backend and into infrastructure microservices (WlanAnalytics, SwitchAnalytics, Alert, NetworkEvents), ensure the request body correctly adheres to the validation policies schemas.

## 1. Analytics & Infrastructure Metrics (WlanAnalytics & SwitchAnalytics)

These APIs typically aggregate and report time-series or entity-based analytics. They rely on the `isRequestInfraSchemaValidated` family or `isRequestInfraWithoutDateValidated` policy.

**Common Request Body Parameters:**
- `scope` (string, Required): Defines the hierarchy level. Must be one of: `"org", "site", "building", "floor", "ap", "switch_sn"`.
- `scopeId` (array of strings, Conditional): Required when `scope` is `"ap"` or `"org"`. Contains the UUIDs of the specific entities.
- `serials` (array of strings, Conditional): Required when `scope` is `"switch_sn"`. Contains device serial numbers.
- `devType` (string, Optional): The device type to filter by, usually `"ap", "switch_sn", "all"`.
- `startDate` (string, Conditional): ISO 8601 Date (`YYYY-MM-DDTHH:mm:ssZZ`). Required for time-range endpoints.
- `endDate` (string, Conditional): ISO 8601 Date (`YYYY-MM-DDTHH:mm:ssZZ`). Required for time-range endpoints.
- `top` (integer, Optional): Used for ranking queries (e.g., top N applications), minimum `1`.

**Example Body (Analytics over time on specific APs):**
```json
{
  "scope": "ap",
  "scopeId": ["ap-uuid-1", "ap-uuid-2"],
  "startDate": "2023-10-01T00:00:00Z",
  "endDate": "2023-10-02T00:00:00Z"
}
```

## 2. Lists, Events, and Alerts (Alerts & NetworkEvents)

These APIs return paginated lists of system events or alerts and primarily use policies like `isAlertsParamsValidated` or `isNetworkEventsParamsValidated` combined with `isInfraPaginationSchemaValid`.

**Common Request Body Parameters:**
- `limit` (number, Required): Maximum number of results to return (min: `1`).
- `offset` (number, Required): Number of items to skip for pagination.
- `search` (string, Optional): General text search across supported columns.
- `filters` (object, Optional): Specific column filtering. Supports strings, or operator objects for NoSQL-like querying.
  - **Text Filter Formats:** 
    - Exact match: `"value"`
    - Operators: `{ "contains": "value", "!=": "value", "startsWith": "value", "endsWith": "value" }`
  - **Date Filter Formats:**
    - Exact match: `"YYYY-MM-DDTHH:mm:ssZZ"`
    - Operators: `{ ">": "Date", "<": "Date", ">=": "Date", "<=": "Date", "!=": "Date" }`
- `sort` (array of objects, Optional): Sorting criteria arrays using `"ASC"` or `"DESC"`. Example: `[{ "lastEventTime": "DESC" }]`
- `scope` / `scopeId` (Optional): Scope entities, usually passed alongside filtering depending on the parent route.

**Important Security Rule:** 
- In policies, ensure `filters` is sanitized of mongo operator keys. `if (key.startsWith("$")) { delete filters[key]; }` to prevent NoSQL Operator Injection.

**Example Body (Paginated Event Search):**
```json
{
  "limit": 100,
  "offset": 0,
  "filters": {
    "severity": "CRITICAL",
    "eventName": { "contains": "link_down" },
    "firstEventTime": { ">": "2023-01-01T00:00:00Z" }
  },
  "sort": [
    { "firstEventTime": "DESC" }
  ]
}
```

## Summary
* **Never** pass unstructured pagination or custom date formats.
* Always enforce the Joi validations established in `api/policies/` for new dispatching read-only routes.
* For modification APIs (Acknowledge/Delete events), additional bulk schemas (like `isActionMultipleEntitiesSchemaValidated`) are required but fall outside this read-only convention.
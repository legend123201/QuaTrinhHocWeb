---
applyTo: 'api/{controllers,services,policies,models,routes}/**/*.js'
---
# Architecture Examples (Reference Only)

Reference only. Do NOT auto-load. Use only when a concrete pattern is explicitly requested.

## Directory Map

```text
api/
 ├── controllers/v1/       # Request handling (REST endpoints)
 ├── services/             # Business logic
 ├── policies/             # Validation, authentication, authorization
 ├── connectors/           # External microservice wrappers
 ├── models/               # Mongo schemas (Mongoose/Waterline)
 └── constants/            # Domain constants
config/
 ├── policies.js           # Route → Policy mapping
 ├── routes.js             # Route definitions
 └── log.js                # Logging configuration
```

## Controller → Service Skeleton

```js
module.exports = {
  async getEntity(req, res) {
    try {
      const { id } = req.params;
      const entity = await EntityService.findById(id);
      if (!entity) {
        return HttpResponseService.sendErrorResponse(res, 404, "Entity not found");
      }
      return HttpResponseService.json(200, res, "entity_fetched", entity);
    } catch (err) {
      sails.log.error("getEntity failed", { err });
      return HttpResponseService.internalServerError(req, res, err);
    }
  }
};
```

## Parallel Aggregation Pattern

```js
async function aggregate(orgId) {
  const [users, devices] = await Promise.all([
    UserService.listByOrg(orgId),
    DeviceService.listByOrg(orgId)
  ]);
  return { users, devices };
}
```

## External Connector Call

```js
const config = await networkConfigMicroServiceConnector.fetchDeviceConfig(orgId);
```

## Usage Guidance

Only open this file when you need a pattern reminder. Adapt names + validation; do not copy blindly.

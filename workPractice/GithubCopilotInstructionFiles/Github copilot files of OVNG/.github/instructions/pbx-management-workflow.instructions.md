---
applyTo: 'api/{controllers,services,connectors,models}/**/*{Pbx,PBX,pbx}*.js'
description: "Use when implementing, migrating, or reviewing PBX management workflows in NestBackend v2, including PBX guards, PbxModule, PbxController, PbxDeviceService, PbxUserService, PbxMicroServiceConnector, Mongo models, and audit logging via HttpResponseService."
---

# PBX Management Workflow

Use this instruction for the target PBX architecture in NestBackend (backend v2). Treat it as the expected component workflow for new work, migrations, and reviews. Do not treat legacy Sails.js PBX code as the source of truth when it conflicts with this document.

## Class Diagram

```mermaid
classDiagram
		direction LR

		class PbxModule {
			+registerControllers()
			+registerProviders()
		}

		class PbxController {
			+createPbx(req, user)
			+updatePbx(req, user)
			+getPbxByOrgId(orgId, user)
			+getPbxByCCId(pbxId)
		}

		class PbxGuard {
			+validateCreate(req)
			+validateUpdate(req)
			+validateDelete(req)
			+authorize(req, user)
		}

		class PbxDeviceService {
			+createPbx(params, user)
			+updatePbx(params, user)
			+getPbxByOrgId(orgId, user)
			+getPbxByCCId(pbxId)
			+enrichWithDeviceLabels(pbxes)
		}

		class PbxUserService {
			+createPbxUser(params, user)
			+updatePbxUser(params, user)
			+getPbxUsersByOrgId(orgId, user)
		}

		class PbxMicroServiceConnector {
			+getPbxStatus(ccProductId)
			+registerOrgMapping(ccProductId, orgId, siteId)
			+executeRequest(action, serviceURL, headers, data, params)
		}

		class HttpResponseService {
			+json(status, data)
			+success(data)
			+error(error)
			+writeAuditIfRegistered(api, oldData, newData)
		}

		class UserActivityService {
			+writeActivity(api, user, oldData, newData)
		}

		class Organization {
			+id: string
			+name: string
			+createdAt: Date
		}

		class Site {
			+id: string
			+name: string
			+createdAt: Date
		}

		class Pbx {
			+id: string
			+name: string
			+ccProductId: string
			+nodeNumber: string
			+organization: string
			+site: string
			+managementMode: string
			+createdAt: Date
		}

		class PbxUser {
			+id: string
			+name: string
			+createdAt: Date
		}

		class Auditlog {
			+id: string
			+name: string
			+createdAt: Date
		}

		class UserActivity {
			+id: string
			+api: string
			+oldData: object
			+newData: object
			+createdAt: Date
		}

		PbxModule o-- PbxController
		PbxModule o-- PbxDeviceService
		PbxModule o-- PbxUserService

		PbxGuard ..> PbxController : guards
		PbxController --> PbxDeviceService : delegates device logic
		PbxController --> PbxUserService : delegates user logic
		PbxController --> HttpResponseService : returns response

		PbxDeviceService --> PbxMicroServiceConnector : calls PBX API
		PbxUserService --> PbxMicroServiceConnector : calls PBX API

		PbxDeviceService --> Organization : CRUD/read
		PbxDeviceService --> Site : CRUD/read
		PbxDeviceService --> Pbx : CRUD/read
		PbxDeviceService --> PbxUser : CRUD/read
		PbxDeviceService --> Auditlog : CRUD/read

		PbxUserService --> Organization : read
		PbxUserService --> Site : read
		PbxUserService --> PbxUser : CRUD/read
		PbxUserService --> Auditlog : CRUD/read

		HttpResponseService --> UserActivityService : if API registered
		UserActivityService --> UserActivity : persists

		Organization "1" <-- "many" Pbx : organization
		Site "1" <-- "many" Pbx : site
		Pbx "1" <-- "many" PbxUser : users
```

## Create PBX Sequence Diagram

```mermaid
sequenceDiagram
	autonumber
	actor UI
	participant Controller as PbxController
	participant JwtGuard as JwtCookieGuard
	participant SiteAdmin as isSiteAdmin
	participant Dto as PbxDto
	participant PbxModel as Pbx Mongo Model
	participant Service as PbxDeviceService
	participant Connector as PbxMicroServiceConnector
	participant Response as HttpResponseService
	participant ActivityService as UserActivityService
	participant ActivityModel as UserActivity Mongo Model

	UI->>Controller: POST /v2/pbx/organizations/:orgId/sites/:siteId
	Controller->>JwtGuard: validate JWT token
	JwtGuard-->>Controller: authenticated user
	Controller->>SiteAdmin: check site admin authorization
	SiteAdmin-->>Controller: authorized
	Controller->>Dto: validate request body
	Dto-->>Controller: validated PBX params
	Controller->>Service: createPbx(params, user)
	Service->>PbxModel: find existing PBX by ccProductId
	PbxModel-->>Service: not found
	Service->>Connector: getPbxStatus(ccProductId)
	Connector-->>Service: { status: 'online', version: 'string' }
	Service->>PbxModel: insert new PBX with params, status, version
	PbxModel-->>Service: new PBX document
	Service->>Connector: registerOrgMapping(ccProductId, orgId, siteId)
	Connector-->>Service: mapping registered
	Service-->>Controller: new PBX data
	Controller->>Response: return success via pipeline interface

	par Response to UI
		Response-->>UI: response JSON
	and Audit logging
		Response->>ActivityService: create audit activity for registered API
		ActivityService->>ActivityModel: insert user activity data
		ActivityModel-->>ActivityService: saved
	end
```

## Ownership And Entry Point
- All PBX APIs belong to NestBackend (backend v2).
- PBX endpoints must be declared inside `PbxModule` and handled by `PbxController`.
- `PbxController` methods are API mapping functions only, for example `createPbx`, `updatePbx`, `getPbxByOrgId`.
- Controllers must stay thin: accept request data, pass normalized parameters to services, and return the final HTTP response.

## Guard First
- Create, update, and delete requests must pass through guards before controller logic runs.
- Guards are responsible for validation and access checks.
- Do not duplicate guard validation inside the controller unless there is a strict business-rule fallback that cannot live in a guard.
- If a request is rejected by validation or authorization, fail before service execution.

## Service Responsibilities
- `PbxController` must delegate business logic to `PbxDeviceService` or `PbxUserService`.
- Typical service entry points include `createPbx(params, user)`, `getPbxByOrgId(orgId, user)`, `getPbxByCCId(pbxId)`, and `enrichWithDeviceLabels(pbxes)`.
- Services own orchestration, data composition, external PBX calls, Mongo CRUD, and any enrichment required before returning data.
- If the controller needs persisted PBX fields to build the response or satisfy audit mapping, the service must do that lookup and return the fields directly. For example, `updateMtclCredentials()` owns the `Pbx.findOne({ ccProductId })` lookup and returns `{ ccProductId, name }` in `response.data`.
- Controllers must not call Mongo models or PBX microservice connectors directly.

## External PBX Connector Boundary
- Services call `PbxMicroServiceConnector` for PBX-device-facing operations.
- Typical connector methods include `getPbxStatus(ccProductId)`, `registerOrgMapping(ccProductId, orgId, siteId)`, and `executeRequest(action, serviceURL, headers, data, params)`.
- Keep raw HTTP and transport concerns inside the connector.
- Normalize connector responses inside the service before returning data to the controller.

## Mongo Persistence Boundary
- Services may read or write Mongo models such as `Organization`, `Site`, `Pbx`, `PbxUser`, and `Auditlog`.
- Shared model expectations:
- Each Mongo model has a string `id`.
- Shared metadata includes `name` and `createdAt`.
- `Pbx` stores PBX-specific fields such as `ccProductId`, `nodeNumber`, `organization`, `site`, `managementMode`, and `createdAt`.
- Keep persistence logic in services or dedicated data-access helpers, not in controllers.

## Response Flow
- After processing PBX data from the connector or Mongo, the service returns normalized data to the controller.
- The controller returns responses through `HttpResponseService`.
- Keep response formatting consistent at the controller layer.
- Do not return raw connector payloads directly from controllers.

## Audit Logging
- `HttpResponseService` is the response boundary and must remain the integration point for audit-log-aware APIs.
- If the API is registered for audit logging, `HttpResponseService` must trigger `UserActivityService` to persist activity data in the `userActivity` Mongo model.
- When adding or modifying create, update, or delete PBX APIs, verify whether the route is registered for audit logging and pass the required old/new data for activity tracking.

## PBX Audit Collection Rules
- PBX audit logs are unified in the shared `useractivity` collection. `createExternalUserActivity()` writes to `UserActivity`, not `PbxAuditActivity`.
- PBX-originated records are identified with `createdBy: "PBX"`. Use that filter to separate PBX-source activity from standard BEFE activity.
- PBX audit readers must query a single collection and paginate natively with Mongo `skip` and `limit`; do not reintroduce application-side merge pagination, dual-collection reads, or `$unionWith` for this flow.
- Shared PBX audit constants such as `PBX_BEFE_ACTIONS` and `PBX_ALLOWED_FIELDS` live in `api/constants/pbxAudit.js` and must be imported by controllers and services instead of being re-declared locally.

## Required Flow
1. Request enters a `PbxController` method.
2. Guard layer validates and authorizes the request.
3. Controller forwards normalized input to `PbxDeviceService` or `PbxUserService`.
4. Service calls `PbxMicroServiceConnector` and-or Mongo models as needed.
5. Service returns processed data to the controller.
6. Controller returns the response via `HttpResponseService`.
7. `HttpResponseService` triggers audit logging when the API is registered for it.

## Do Not Do This
- Do not put PBX business logic in guards.
- Do not call `PbxMicroServiceConnector` directly from controllers.
- Do not access Mongo models directly from controllers.
- Do not bypass `HttpResponseService` for PBX API responses.
- Do not query `Pbx` from a controller just to decorate a service response or audit payload.
- Do not reintroduce `PbxAuditActivity`, dual-collection PBX audit merges, or `$unionWith` for PBX audit listing or export flows.
- Do not duplicate PBX audit action or allowed-field constants outside `api/constants/pbxAudit.js`.
- Do not leave async callbacks mis-indented inside `isDeploymentOption(OVTX)` or similar feature-gated branches when the scoping becomes ambiguous.
- Do not add a PBX endpoint outside `PbxModule` unless the architecture decision is explicitly changed.



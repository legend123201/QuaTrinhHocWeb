---
name: generate-apidoc
description: "Use when: adding swagger documentation for a new or existing API route, creating request body schemas, response schemas or response samples for a resource, or running the apidoc build to generate and deploy the HTML documentation for OmniVista Cirrus and Terra environments."
argument-hint: "Provide the resource name, HTTP method and path, or say whether you need to write the swagger block, create schema/sample files, or run the full build. Also specify the target environment: 'both' (default), 'cirrus' (OVNG only), or 'terra' (OVTX only)."
---

# API Documentation Generation

This skill covers the **complete end-to-end workflow** for adding and generating API documentation. All four steps below are **mandatory** and must be executed in sequence every time this skill is invoked — do not stop after Step 3.

---

## Mandatory Workflow Checklist

Execute every step. Do not skip or defer any step.

- [ ] **STEP 1** — Add swagger blocks to `routes/api/routes.js`
- [ ] **STEP 2** — Create/update schema and sample files (request schemas, response schemas, response samples)
- [ ] **STEP 3** — Wire the three `require()` imports into `routes/api/routes.js`
- [ ] **STEP 3b** — Add the new tag to the MkDocs nav in `apidoc/mkdocs/mkdocs.yml`
- [ ] **STEP 4a** — Ask the user for target environment, then run the build (`npm run apidoc`)
- [ ] **STEP 4b** — Copy the generated output to `frontend/`

---

## User Input Required

### Before starting Step 2 — Field sources

#### Request schema fields — priority order

Always check in this order before asking the user:

1. **Policy file** (`api/policies/is<Resource>SchemaValidated.js`) — **primary source**. The Joi schema defines every accepted field, its type, whether required, constraints (min/max/regex/nullable). Use this directly to write the request schema. No need to ask the user.
2. **Controller** — if no policy file exists, check `req.body` / `req.allParams()` usage and route `mapping[]` for visible field names.
3. **Ask the user** — only if no policy file exists and the controller doesn't reveal enough:

   > "No policy file was found for this resource. Please provide the accepted request body fields with their types, required flags, and any constraints (e.g. max length, allowed values)."

#### Response schema and sample fields — when a connector is involved

When the service delegates to a **connector** (e.g. `upamSAMPMicroServiceConnector`, `infraMicroServiceConnector`, etc.), the response field structure is defined by an **external microservice** and cannot be derived from the backend code. Always **ask the user before writing response schemas or samples**:

> "This resource fetches data from an external microservice via a connector. Please provide either:
> - A **sample JSON response** from the microservice for a `<resource>` object, or
> - A **list of fields** with their types and descriptions
>
> This is needed to write accurate response schemas and samples."

Use the user-provided data as the source of truth for:
- The `data` object/array properties in response schemas (`responses/schemas/<resource>.js`)
- The `data` values in response samples (`responses/samples/<resource>.js`)

If the user cannot provide this, make a best-effort schema using only fields observable from the controller (e.g. fields in `removePassword()`, `_.pick()`, `_.map()`, route `mapping[]`) and mark each description with `"(unconfirmed — verify against microservice response)"`.

#### Special case — mutating operations (DELETE, PATCH status, mass import) with connector-backed resources

Even when the user provides a sample for GET, **mutating operations often return a controller-transformed shape** that is different from the raw microservice object. Do not reuse the GET sample fields blindly.

For each mutating operation, **always inspect the controller action** to determine the actual response shape before writing the schema. Look for:

| Controller pattern | What it produces |
|---|---|
| `_.pick(item, ["field1", "field2"])` | Only those specific fields in the response |
| `_.omit(item, ["password", "advancedPrivileges"])` | All microservice fields minus the omitted ones |
| `_.map(data, (item) => ({ ... }))` | A remapped array with only the explicitly listed keys |
| `removePassword(data)` or similar strip functions | Microservice fields minus stripped keys |
| `item.entityData` spread | Nested `entityData` object flattened to top level |
| `response.data` passed through unchanged | Full microservice object (same as GET) |
| `{ Status: status }` or similar literal object | A small fixed-shape object, not a resource object |

**Concrete examples observed:**

- **DELETE multiple** — controller may use `_.pick(item, ["displayName", "username"])` so the response `data` array only contains `displayName` and `username`, regardless of the full resource shape from GET.
- **PATCH status** — controller often builds `{ displayName, status, statusValue }` objects via `_.map`, not the full resource.
- **PATCH single update** — controller may return the request body merged with a fetched field (e.g. `username` added for audit), not the full saved object.
- **Mass import** — may return a remapped array based on `entityData` with `password` and `advancedPrivileges` omitted.

**Rule:** If the controller shapes the response itself (any `_.pick`, `_.omit`, `_.map`, or literal object construction), **derive the schema from the controller code directly** — the user-provided GET sample is not applicable. Only use the user sample for operations that pass `response.data` through unchanged.

#### Summary table

| Source | Request schema | Response schema/samples |
|--------|---------------|------------------------|
| Policy file (`api/policies/`) | ✅ Primary source | — |
| Controller (`_.pick`, `_.omit`, `_.map`, literal objects) | ✅ Fallback | ✅ Primary for mutating ops |
| Microservice (user-provided GET sample) | — | ✅ For GET / pass-through ops only |
| Route `mapping[]` | ✅ Hint only | — |
| **Ask user** | Only if no policy file | Always when connector is involved for GET; not needed for controller-shaped mutations |

---

### Before starting Step 4 — Build inputs

Ask the user for the following if not already provided:

| Input | Options / Example | Default |
|-------|-------------------|---------|
| **Backend path** | e.g. `C:\ovng-code\backend` or `/home/user/ovng-code/backend` | *(must ask)* |
| **Frontend path** | e.g. `C:\ovng-code\frontend` or `/home/user/ovng-code/frontend` | *(must ask)* |
| **Target environment** | `both` — generate Cirrus + Terra | `both` |
| | `cirrus` — generate Cirrus (OVNG) only | |
| | `terra` — generate Terra (OVTX) only | |

Use the provided paths directly as `$backendDir` and `$frontendDir`.

Use the environment answer to select the correct build and copy commands in Step 4.

---

## Key Rule: Where Annotations Live

Swagger annotations live **only in `routes/api/routes.js`**, not in controller files.

---

## STEP 1 — Add the swagger block to the route entry in `routes/api/routes.js`

### Structure

```javascript
[`METHOD ${prefix}/resource/:paramId`]: {
    controller: apiVersion + "/ControllerName",
    action: "actionName",
    swagger: {
        summary: "Short title shown in the doc",
        description: "Full explanation of what the endpoint does.",
        // body: only present if the endpoint accepts a request body
        body: swaggerRequestXxxSchemas.schemaName,
        parameters: [
            swaggerRequestHeaders.authorization,
            swaggerRequestHeaders.contentType,  // only for JSON body endpoints
        ],
        responses: {
            "200": {
                schema: swaggerResponseXxxSchemas.schemaName,
                examples: swaggerResponseXxxSamples.sampleName
            },
            "403": swaggerHTTPResponseSchemas["403"],
            "404": swaggerHTTPResponseSchemas["404"],
        }
    }
},
```

### Mandatory rules — always apply these

| Condition | Rule |
|-----------|------|
| `swaggerRequestHeaders.authorization` is in `parameters` | **Do NOT add `"401"`** to responses |
| Route has a `body` field | **Do NOT add `"400"`** to responses |
| File download endpoint (binary response) | Set `"200"` to `{}` (empty object) |
| File upload (multipart/form-data) | Use `contentTypeFormData` header (not `contentType`) and add `"406": swaggerHTTPResponseSchemas["406file"]` |

### Available request headers (`swaggerRequestHeaders`)

Defined in `apidoc/swagger/resources/requests/headers.js`.

| Key | When to use |
|-----|-------------|
| `authorization` | Every authenticated endpoint |
| `contentType` | JSON body endpoints |
| `contentTypeFormData` | File upload / multipart form-data endpoints |
| `limit` | Endpoints accepting `?limit` query param |
| `ids` | Endpoints accepting `?ids` query param |

### Available HTTP response schemas (`swaggerHTTPResponseSchemas`)

Defined in `apidoc/swagger/resources/responses/http-schemas.js`.

| Key | Meaning |
|-----|---------|
| `"400"` | Bad Request (omit when body is present) |
| `"401"` | Unauthorized (omit when authorization header is present) |
| `"403"` | Forbidden |
| `"404"` | Not Found |
| `"406"` | Not Acceptable — wrong Content-Type (JSON endpoints) |
| `"406file"` | Not Acceptable — wrong Content-Type (form-data file upload) |
| `"409"` | Conflict |
| `"500"` | Internal Server Error |

### Common swagger block patterns

**GET list**
```javascript
swagger: {
    summary: "Get all Xxx",
    description: "...",
    parameters: [swaggerRequestHeaders.authorization],
    responses: {
        "200": { schema: swaggerResponseXxxSchemas.getXxxList, examples: swaggerResponseXxxSamples.getXxxList },
        "403": swaggerHTTPResponseSchemas["403"],
    }
}
```

**GET single by ID**
```javascript
swagger: {
    summary: "Get a Xxx",
    description: "...",
    parameters: [swaggerRequestHeaders.authorization],
    responses: {
        "200": { schema: swaggerResponseXxxSchemas.getXxxById, examples: swaggerResponseXxxSamples.getXxxById },
        "403": swaggerHTTPResponseSchemas["403"],
        "404": swaggerHTTPResponseSchemas["404"],
    }
}
```

**POST (JSON body)**
```javascript
swagger: {
    summary: "Create a Xxx",
    description: "...",
    body: swaggerRequestXxxSchemas.createXxx,
    parameters: [
        swaggerRequestHeaders.authorization,
        swaggerRequestHeaders.contentType,
    ],
    responses: {
        "201": { schema: swaggerResponseXxxSchemas.createXxx, examples: swaggerResponseXxxSamples.createXxx },
        "403": swaggerHTTPResponseSchemas["403"],
        "409": swaggerHTTPResponseSchemas["409"],
    }
}
```

**PUT/PATCH (JSON body)**
```javascript
swagger: {
    summary: "Update a Xxx",
    description: "...",
    body: swaggerRequestXxxSchemas.updateXxx,
    parameters: [
        swaggerRequestHeaders.authorization,
        swaggerRequestHeaders.contentType,
    ],
    responses: {
        "200": { schema: swaggerResponseXxxSchemas.updateXxx, examples: swaggerResponseXxxSamples.updateXxx },
        "403": swaggerHTTPResponseSchemas["403"],
        "404": swaggerHTTPResponseSchemas["404"],
    }
}
```

**DELETE**
```javascript
swagger: {
    summary: "Delete a Xxx",
    description: "...",
    parameters: [swaggerRequestHeaders.authorization],
    responses: {
        "200": { schema: swaggerResponseXxxSchemas.deleteXxx, examples: swaggerResponseXxxSamples.deleteXxx },
        "403": swaggerHTTPResponseSchemas["403"],
        "404": swaggerHTTPResponseSchemas["404"],
    }
}
```

**File download**
```javascript
swagger: {
    summary: "Download Xxx",
    description: "...",
    parameters: [swaggerRequestHeaders.authorization],
    responses: {
        "200": {},   // always empty for download APIs
        "403": swaggerHTTPResponseSchemas["403"],
    }
}
```

**File upload (multipart/form-data)**
```javascript
swagger: {
    summary: "Import Xxx from file",
    description: "...",
    body: swaggerRequestXxxSchemas.importXxx,
    parameters: [
        swaggerRequestHeaders.authorization,
        swaggerRequestHeaders.contentTypeFormData,
    ],
    responses: {
        "200": { schema: swaggerResponseXxxSchemas.importXxx, examples: swaggerResponseXxxSamples.importXxx },
        "403": swaggerHTTPResponseSchemas["403"],
        "406": swaggerHTTPResponseSchemas["406file"],
    }
}
```

---

## STEP 2 — Create resource schema and sample files (new resource only)

For each new resource `xxx`, create three files.

### 2a. Request schema — `apidoc/swagger/resources/requests/schemas/<resource>.js`

Properties are **flat** (not wrapped in `properties`) — the hook handles OpenAPI conversion.

```javascript
/**
 * Body content of '<resource>' resource.
 *
 * keyName : {
 *     type: 'string | integer | boolean | number',
 *     required: true | false,
 *     description: 'keyDescription',
 *     enum: ["value1", "value2"]   // optional
 * },
 */
module.exports = {
    createResource: {
        name: {
            type: "string",
            required: true,
            description: "The name of the resource."
        },
        enabled: {
            type: "boolean",
            description: "Whether the resource is active."
        },
        type: {
            type: "string",
            required: true,
            description: "The resource type.",
            enum: ["TYPE_A", "TYPE_B"]
        }
    },
    updateResource: {
        name: {
            type: "string",
            description: "The updated name of the resource."
        }
    }
};
```

### 2b. Response schema — `apidoc/swagger/resources/responses/schemas/<resource>.js`

Uses full OpenAPI object notation. This project forked `sails-hook-swagger-generator` specifically to support **deep nested object levels** — use `properties` recursively as needed.

Define reusable sub-objects at the top of the file (not exported) and spread them with `...resourceObj` to avoid repetition.

```javascript
// Reusable sub-object — defined at top, not exported
const resourceObj = {
    id: {
        type: "string",
        description: "Unique identifier."
    },
    name: {
        type: "string",
        description: "The name of the resource."
    },
    createdAt: {
        type: "string",
        description: "Creation date (ISO 8601 format)."
    },
    updatedAt: {
        type: "string",
        description: "Last update date (ISO 8601 format)."
    },
    settings: {
        type: "object",
        description: "Nested settings object.",
        properties: {
            enabled: {
                type: "boolean",
                description: "Whether the resource is enabled."
            },
            retentionDays: {
                type: "integer",
                description: "Number of days to retain data."
            }
        }
    }
};

module.exports = {
    // GET /:id, PUT, PATCH — single object
    getResourceById: {
        type: "object",
        properties: {
            status: { type: "integer", description: "HTTP Status Code. (200)" },
            message: { type: "string", description: "Status message." },
            data: {
                type: "object",
                description: "The resource object.",
                properties: { ...resourceObj }
            }
        }
    },
    // GET list — array
    getResourceList: {
        type: "object",
        properties: {
            status: { type: "integer", description: "HTTP Status Code. (200)" },
            message: { type: "string", description: "Status message." },
            data: {
                type: "array",
                description: "Array of resource objects.",
                items: {
                    type: "object",
                    properties: { ...resourceObj }
                }
            }
        }
    },
    // POST — created (201)
    createResource: {
        type: "object",
        properties: {
            status: { type: "integer", description: "HTTP Status Code. (201)" },
            message: { type: "string", description: "Status message." },
            data: {
                type: "object",
                description: "The created resource object.",
                properties: { ...resourceObj }
            }
        }
    }
};
```

### 2c. Response samples — `apidoc/swagger/resources/responses/samples/<resource>.js`

Each exported key must match the corresponding schema key. Wrap all samples in `"application/json"`.

```javascript
module.exports = {
    getResourceById: {
        "application/json": {
            "status": 200,
            "message": "The resource has been successfully fetched.",
            "data": {
                "id": "5f1567ede0e88a2424ec1d05",
                "name": "My Resource",
                "createdAt": "2023-01-15T10:30:00.000Z",
                "updatedAt": "2023-01-15T10:30:00.000Z",
                "settings": { "enabled": true, "retentionDays": 30 }
            }
        }
    },
    getResourceList: {
        "application/json": {
            "status": 200,
            "message": "The resources have been successfully fetched.",
            "data": [
                {
                    "id": "5f1567ede0e88a2424ec1d05",
                    "name": "My Resource",
                    "createdAt": "2023-01-15T10:30:00.000Z",
                    "updatedAt": "2023-01-15T10:30:00.000Z",
                    "settings": { "enabled": true, "retentionDays": 30 }
                }
            ]
        }
    },
    createResource: {
        "application/json": {
            "status": 201,
            "message": "The resource has been successfully created.",
            "data": {
                "id": "5f1567ede0e88a2424ec1d05",
                "name": "My Resource",
                "createdAt": "2023-01-15T10:30:00.000Z",
                "updatedAt": "2023-01-15T10:30:00.000Z",
                "settings": { "enabled": true, "retentionDays": 30 }
            }
        }
    }
};
```

**Cross-file reuse:** When a response embeds another resource, import its schema/sample and spread it:
```javascript
const { rfProfileSample } = require("./rfTemplate");
module.exports = {
    createOrganization: {
        "application/json": {
            "data": {
                ...rfProfileSample,
                "organization": "63a564bce5de801169ee606a"
            }
        }
    }
};
```

---

## STEP 3 — Wire the imports into `routes/api/routes.js`

Add these three lines at the top of `routes.js`, following the existing pattern:

```javascript
const swaggerRequestXxxSchemas  = require("../../apidoc/swagger/resources/requests/schemas/xxx");
const swaggerResponseXxxSchemas = require("../../apidoc/swagger/resources/responses/schemas/xxx");
const swaggerResponseXxxSamples = require("../../apidoc/swagger/resources/responses/samples/xxx");
```

---

## STEP 3b — Add the new tag to the MkDocs nav

The MkDocs nav is **not auto-generated** from the swagger tags. You must manually add the new controller's tag to the source nav template at `apidoc/mkdocs/mkdocs.yml`.

The tag name is the auto-lowercased controller name (e.g. `AuthServerController` → `Authserver`). Add it under `- Explore the APIs:` in a logical position (alphabetical within related tags):

```yaml
          - Authserver: apidoc.html#tag/Authserver
```

This change will be propagated to `apidoc/build/cirrus/mkdocs.yml` and `apidoc/build/terra/mkdocs.yml` automatically when the build runs in Step 4.

> **Why this matters:** If you skip this step, the endpoints will appear in the swagger JSON and the Redoc UI, but will be missing from the MkDocs sidebar nav.

---

## STEP 4 — Build and deploy the API documentation

### 4a. Generate the HTML docs

Use the backend and frontend paths provided by the user:

```powershell
$backendDir  = "<backendPath>"
$frontendDir = "<frontendPath>"
```

On Windows, `python` may not be on the PATH — the build script handles this automatically.

Use the environment answer from the user to select the correct command:

**`both` (default) — full build, regenerates swagger, builds Cirrus + Terra:**
```powershell
Set-Location $backendDir
npm run apidoc
```
Outputs: `backend/assets/apidoc-cirrus/` and `backend/assets/apidoc-terra/`

**`cirrus` only — full build, then copy Cirrus only:**
```powershell
Set-Location $backendDir
npm run apidoc
```
`npm run apidoc` always builds both environments correctly. Simply copy only `assets/apidoc-cirrus` to frontend in Step 4b and ignore the Terra output.

**`terra` only — full build, then copy Terra only:**
```powershell
Set-Location $backendDir
npm run apidoc
```
`npm run apidoc` always builds both environments correctly. Simply copy only `assets/apidoc-terra` to frontend in Step 4b and ignore the Cirrus output.

> **WARNING — do NOT run `node scripts/build-dual-apidoc.js <env>` after `npm run apidoc`.**
> `build-dual-apidoc.js` overwrites `assets/apidoc-<env>` with a fresh MkDocs output but skips the `mergeApiPageIntoBuilds()` step. This causes `apidoc.html` (and `.color_pairs.yml`) to go missing from the backend assets folder, resulting in an incomplete deployment. Always use `npm run apidoc` alone for the full, correct build.

> **Windows note:** `mkdocs-material` v9.x exits with code 1 while printing an upgrade warning, even when the build succeeds. The build script handles this automatically — verify the output directories exist after the run.

### 4b. Copy docs to frontend

The output directories are `apidoc-cirrus` and `apidoc-terra` (not `apidoc`).

**Both environments:**
```powershell
Copy-Item -Path (Join-Path $backendDir "assets\apidoc-cirrus") -Destination (Join-Path $frontendDir "apidoc-cirrus") -Recurse -Force
Copy-Item -Path (Join-Path $backendDir "assets\apidoc-terra")  -Destination (Join-Path $frontendDir "apidoc-terra")  -Recurse -Force
```

**Cirrus only:**
```powershell
Copy-Item -Path (Join-Path $backendDir "assets\apidoc-cirrus") -Destination (Join-Path $frontendDir "apidoc-cirrus") -Recurse -Force
```

**Terra only:**
```powershell
Copy-Item -Path (Join-Path $backendDir "assets\apidoc-terra") -Destination (Join-Path $frontendDir "apidoc-terra") -Recurse -Force
```



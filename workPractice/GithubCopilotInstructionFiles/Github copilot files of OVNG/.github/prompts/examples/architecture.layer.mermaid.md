# Architecture Layer Diagram (Reference Only)

Usage: Load ONLY if a visual overview is explicitly requested. Rules still come from instruction files; this diagram is non‑normative.

```mermaid
graph LR
  ClientApp((Client))
  subgraph Routes
    ApiRoutes[routes/api/*.js]
    WebRoutes[routes/web/*.js]
  end
  Policies[Policy Chain]
  Controller[Controller (thin)]
  Service[Service (business logic)]
  Connector[External Connector(s)]
  Model[(Model / Persistence)]
  Docs[Swagger / Apidoc]

  ClientApp --> ApiRoutes
  ClientApp --> WebRoutes
  ApiRoutes --> Policies
  WebRoutes --> Policies
  Policies --> Controller
  Controller --> Service
  Service --> Model
  Service --> Connector
  Policies --> Docs
```

Notes:
 
- Keep controllers minimal; business flows live in services.
- Policies gate auth, tenancy, validation before controller.
- Models avoid outbound calls; connectors isolate external APIs.
- Update only if structural layering changes; do not add domain specifics.

---
applyTo: 'api/controllers/**/*.js'
---
# Response Contracts

TLDR: Use `HttpResponseService`; success: {status,message,data}; errors: preserve legacy but prefer modern schema.

## Success Shapes
- 200 OK: fetch/update or process success.
- 201 Created: new resource.
- 204 No Content: successful deletion / no body.
- 207 Multi-Status: partial batch (array with per-item status boolean + item data).
- Auth success: token object via `jsonAuth`.

## Helpers
- `HttpResponseService.json(status,res,message,data[,old])`
- `HttpResponseService.jsonAuth(res, token, expiresIn)`
- `HttpResponseService.badRequest(res, detailsObj)`
- `HttpResponseService.unauthorized(res, code)`
- `HttpResponseService.forbidden(res, code)`
- `HttpResponseService.notFound(res, entity, field, value)`
- `HttpResponseService.conflictError(res, field, value, code, conflictData)`
- `HttpResponseService.internalServerError(req,res,err)`

## Error Schema
Legacy (must still parse): may include `error_code` OR `errorCode`.
Preferred new endpoints:
```
{
  errorCode: <number>,
  errorMsg: <string>,
  errorDetailsCode?: <string>,
  errorDetails?: <string|object>,
  errors?: [ { type, field, errorMsg } ],
  conflictValues?: [string],
  errorLabel?: <string>
}
```
Batch partial success → 207.
Do NOT return 200 for create (use 201) or empty content (use 204).

## Partial Operations (207)
Each item: `{ status: <bool>, entityData: {...}, error? }`.
If all succeed → 200 not 207.

## Consistency Rules
- Messages should use constants for i18n/centralization.
- Do not invent new top-level fields.
- When the service calling conenctor microservice API, make sure 400, 403, 401 statusCode is catched and returned to controller.

## Migration Guidance
When touching old controllers mixing `error_code` and `errorCode`:
1. Keep existing field for backward compatibility.
2. Add preferred field only if API contract versioned.
3. Document in PR (Developer Defense section) if changing.

## Quick Reference Table
Code | Scenario | Helper
200 | Fetch / update | json(200,...)
201 | Created | json(201,...)
204 | No content | res.status(204).send()
207 | Partial batch | json(207,...)
400 | Validation | badRequest(...)
401 | Auth fail | unauthorized(...)
403 | Forbidden | forbidden(...)
404 | Missing | notFound(...)
406 | Invalid header | (custom validation) 
409 | Conflict | conflictError(...)
500 | Server error | internalServerError(...)

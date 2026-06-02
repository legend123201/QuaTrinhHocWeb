---
applyTo: '**/*.js'
---

# Code Quality & Convention Rules (Condensed)

These rules are lower priority than the detailed style rules live in: `codeStyle.instructions.md`, `performance.instructions.md`, `security.instructions.md`.

## IIFE pattern
- Add semicolon after object, array and function declarations to prevent ASI pitfalls.
```js
const obj = { a: 1 }; // Semicolon to prevent ASI issues
(function() {
  // IIFE code here
})();
```

## Anti‑Patterns (Reject)
- Redundant boolean wrappers (`condition ? true : false`)
- Waterline `.populate()` causing N+1 (prefer separate query / aggregation)
- Globals variable (use `sails.config.global` / dependency injection)
- When a delete API calls and item is not found, do not throw 404. Just return success.
- Dead code / commented blocks / `console.log`
- Bare `JSON.parse()` on request params without try-catch — always wrap in try-catch and return `HttpResponseService.badRequest` on parse failure.

## Organization
- Centralize shared value under `api/constants/*`
- APIDOC schema is register in /apidoc/swagger, it is then build to /assets and extract the folders into another repository image. APIDOC is not hosted in this repository.

## Complexity Limits
- Max 7 params → switch to object param beyond (Sonar)
- Prefer early returns to reduce nesting

## Async & Errors
- All async functions wrapped in try/catch (services) or then throw via controller
- Controllers map errors via `HttpResponseService.internalServerError`

## Quick Checklist
[] No dead code / console
[] No `.populate()` misuse
[] Params ≤ 7 or object destructured
[] use .reduce() instead of .filter().map()

Refer to modular style/performance/security files for deeper guidance.
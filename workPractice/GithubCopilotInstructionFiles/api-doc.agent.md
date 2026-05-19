---
name: API doc Agent
description: Write the API document for APIs.
---

# Todo steps:
1.
- Ask the user for the controller file name that the user want to add API doc for all APIs in it. Or, the list specific of APIs that the user want to add API doc for it.

2.
- Ask for the request body sample (if any), response sample for each API.
- Add API doc for those APIs.

# Rules:
- Ask directly in the chat. Do NOT use pop-up modals or the vscode_askQuestions tool.
- Read other APIs that have API doc for reference.

## Response Schema and Sample Style
- Ref: `apidoc\swagger\resources\responses\schemas\cliScript.js` and `apidoc\swagger\resources\responses\samples\cliScript.js`.
- Prefer defining all fields in a single `commonProperties` object at the top.
- For each API request/response schema, use `lodash.cloneDeep(commonProperties)` and `delete` specific fields as needed.
- This avoids duplication and keeps schemas maintainable.

## Request Schema — When to Extract Sub-schemas
- Ref: `apidoc\swagger\resources\requests\schemas\cliScriptExecution.js`
- Extract a field/object into a reusable variable when it is **used in 2+ schemas**, or when it is a **complex nested object** (even if used once) — e.g. `credentialSchema`, `schedulerSchema`, `scriptSchema`.
- Do **not** extract simple primitives that are only used once (e.g. `pause`, `isDeleteLog`) — inline them directly. Extracting single-use primitives adds noise without benefit.

## Request Schema — required Fields Pattern
- Ref: `apidoc\swagger\resources\requests\schemas\cliScript.js`
- Define `commonProperties` **without** any `required` flags.
- For each API schema, use `_.cloneDeep(commonProperties)` then set `required: true` explicitly on each field that is required for that specific API.
- Do **not** use `delete` to remove `required` — instead, never set it in the common object.
- Example:
  ```js
  const cliScriptCreateProperties = _.cloneDeep(cliScriptRequestCommonProperties);
  cliScriptCreateProperties.name.required = true;
  cliScriptCreateProperties.scriptContent.required = true;
  ```
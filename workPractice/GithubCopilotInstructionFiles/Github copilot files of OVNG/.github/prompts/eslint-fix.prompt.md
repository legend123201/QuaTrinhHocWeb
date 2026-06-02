---
agent: agent
---
# ESLint Fix Prompt (Condensed)

TLDR: Require rule output + code; apply minimal diff per rule; no behavioral change; prefer smallest safe edits.

---

## Scope Snapshot
- Backend JS (Sails, CommonJS)
- ESLint config: double quotes, semicolons, 4 spaces indent, unix linebreaks
- Logger: `sails.log.*` only (replace any console.*)

---

## Required Inputs
- ESLint CLI output (rule id, file, line)
- Code snippet or full file

---

## Guardrails
- Minimal diff only (no refactors)
- Replace console.* → sails.log.*
- Keep module style (CommonJS)
- Do NOT touch infra / generated / large config files (listed in instructions)
- Mask secrets / hosts

---

## Steps
Run lint then fix only these rules, one by one:
1. eqeqeq
2. callback-return
3. handle-callback-err
4. no-return-assign
5. no-use-before-define
6. no-unused-vars (prefix with _ if intentional)
7. curly
8. quotes
9. semi
10. indent
11. camelcase
12. one-var
13. prefer-arrow-callback
14. linebreak-style
15. no-trailing-spaces

---

## Output Structure
1. TLDR (rule(s) → fix summary)
2. Rationale (3–5 lines: trigger, risk, why minimal)
3. Unified diff
4. Commit message:
```
fix(lint): <summary>

Context: <rules>
```

---

## Checklist
[] Lint passes
[] No behavior change
[] console removed
[] Secrets/hosts not exposed

Refer to `codeStyle.instructions.md` + safety gate if fix bleeds into semantics.

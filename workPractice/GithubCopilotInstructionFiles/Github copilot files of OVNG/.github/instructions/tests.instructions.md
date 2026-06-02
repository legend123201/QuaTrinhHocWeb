## Unit Testing Policy

This project is a **Sails.js backend**. All unit tests must use **Vitest**.

### Testing Priorities

**PRIORITY 1 - Business Logic (MUST test):**
- **Services** (`api/services/`) - Core business logic
- **Policies** (`api/policies/`) - Authentication, authorization, validation middleware
- **Helpers** (`api/helpers/`) - Reusable utility functions

**PRIORITY 2 - Not unit tested (integration/E2E only):**
- **Controllers** - Thin layer, delegates to services (tested via integration tests)
- **Connectors** (`api/connectors/`) - HTTP wrappers best tested with integration tools (nock, msw)
- **Models** - Waterline ORM definitions (no business logic)
- **Adapters** - Database layer (framework responsibility)
- **Constants** - Static values (no logic to test)

### When to create tests
- Every new **service**, **policy**, or **helper** must include unit tests.
- Every bug fix in business logic must include a regression test covering the fixed behavior.
- When analyzing or refactoring existing code in services/policies/helpers, proactively create tests.
- When reviewing code, focus test suggestions on business logic layers.

### Test file conventions
- Place test files in a `tests/` folder at the root of each module:
  - `api/services/ZoneService.js` → `api/services/tests/ZoneService.spec.js`
  - `api/policies/isAuthenticated.js` → `api/policies/tests/isAuthenticated.spec.js`
  - `api/helpers/formatPrice.js` → `api/helpers/tests/formatPrice.spec.js`
- Use the `.spec.js` (or `.spec.ts` if TypeScript) extension.
- Group tests logically using `describe()` blocks matching the function/module name.

### Test structure & coverage expectations
- Always cover: nominal/happy path, error cases, edge cases, and boundary values.
- Use `describe` / `it` blocks with clear, behavior-driven descriptions in English.
  Example: `it('should return 404 when user is not found')`
- Keep tests isolated: each test must be independent and not rely on execution order.
- Prefer small focused tests over large integration-style tests.

### Mocking & dependencies
- Mock all external dependencies: database calls (Sails models), external APIs, file system, etc.
- Use `vi.mock()` and `vi.fn()` from Vitest for mocking.
- Never hit a real database or external service in unit tests.
- For Sails globals (like `sails.helpers.*`, `sails.config.*`, model methods), create manual mocks or use `vi.stubGlobal()`.

### Vitest configuration
- The project uses Vitest with `globals: true` so `describe`, `it`, `expect`, `vi` are available globally without imports.
- Tests run via: `npx vitest run`
- CI output format: JUnit XML (`--reporter=junit`)
- Coverage format: Cobertura (`coverage.reporter: ['text', 'cobertura']`)

### Code example template
```js
describe('helper: format-price', () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.restoreAllMocks()
  })

  it('should format a price with two decimals', () => {
    const result = formatPrice(10)
    expect(result).toBe('10.00')
  })

  it('should throw when price is negative', () => {
    expect(() => formatPrice(-1)).toThrow('Price must be positive')
  })

  it('should handle zero correctly', () => {
    const result = formatPrice(0)
    expect(result).toBe('0.00')
  })
})
```

### What NOT to do
- Do not use Jest. This project uses Vitest exclusively.
- Do not write tests that depend on a running Sails instance unless explicitly asked for integration tests.
- Do not skip error case testing.
- Do not write empty or placeholder tests (e.g. `it.todo()` without a plan).
- Do not put all tests in a single top-level `__tests__` folder; keep them colocated with source files.
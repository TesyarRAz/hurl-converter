# Plan: Fix Array Path Syntax

## TL;DR
> Fix array path syntax from dot notation ($.items.0.id) to bracket notation ($.items[0].id)

---

## Context

**Bug**: Current converter generates `$.items.0.id` but should be `$.items[0].id`

---

## TODOs

- [x] 1. Fix array index path syntax

  **What to do**: Change line 33 in src/converter.ts from `${path}.0` to `${path}[0]`

  **QA Scenarios**:
  ```
  Scenario: Verify array path uses bracket notation
    Tool: Bash
    Steps:
      1. node -e "const {parseJsonToAsserts} = require('./dist/src/converter.js'); console.log(parseJsonToAsserts('{\"items\":[{\"id\":1}]}'))"
    Expected Result: includes $.items[0].id (not $.items.0.id)
  ```

- [x] 2. Compile and verify

  **What to do**: Run `npm run compile` and test

---

## Success Criteria

- [x] Array paths use bracket notation: `$.items[0].id`
- [x] npm run compile succeeds

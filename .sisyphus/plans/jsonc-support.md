# Plan: Add JSONC Support

## TL;DR
> Add JSONC (JSON with Comments) support to converter by replacing JSON.parse with jsonc-parser.

---

## Context

**User Request**: Current converter only accepts pure JSON. User wants to support JSONC (JSON with Comments) since many config files use comments for documentation.

**Library Selected**: `jsonc-parser` (Microsoft) - 738 stars, actively maintained, used by VS Code.

---

## Work Objectives

- **Core Objective**: Replace `JSON.parse()` with `jsonc-parser.parse()` in converter.ts
- **Deliverable**: Converter accepts both JSON and JSONC (comments, trailing commas)

---

## Verification Strategy

- Test with JSONC input containing `//` and `/* */` comments
- Ensure existing JSON still works

---

## TODOs

- [x] 1. Install jsonc-parser dependency

  **What to do**: Run `npm install jsonc-parser`

  **QA Scenarios**:
  ```
  Scenario: Verify jsonc-parser installed
    Tool: Bash
    Steps:
      1. Check node_modules/jsonc-parser exists
    Expected Result: Directory exists
  ```

- [x] 2. Update converter.ts to use jsonc-parser

  **What to do**:
  - Add import: `import { parse } from 'jsonc-parser';`
  - Replace `JSON.parse(jsonString)` with `parse(jsonString)`
  - Rebuild: `npm run compile`

  **QA Scenarios**:
  ```
  Scenario: Test with JSONC input (comments)
    Tool: Bash
    Steps:
      1. node -e "const {parse} = require('jsonc-parser'); console.log(parse('{ // comment\n\"key\": \"value\" }'))"
    Expected Result: { key: 'value' }

  Scenario: Test with block comments
    Tool: Bash
    Steps:
      1. node -e "const {parse} = require('jsonc-parser'); console.log(parse('{ /* block */ \"x\": 1 }'))"
    Expected Result: { x: 1 }

  Scenario: Test with trailing comma
    Tool: Bash
    Steps:
      1. node -e "const {parse} = require('jsonc-parser'); console.log(parse('{ \"y\": 2, }'))"
    Expected Result: { y: 2 }
  ```

---

## Success Criteria

- [x] `npm install jsonc-parser` succeeds
- [x] Converter works with JSON input (backward compatible)
- [x] Converter works with JSONC input (with comments)
- [x] `npm run compile` succeeds

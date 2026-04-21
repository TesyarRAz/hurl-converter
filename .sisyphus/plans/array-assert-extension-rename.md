# Plan: Array Assert + Extension Rename

## TL;DR

> **Quick Summary**: (1) Tambahkan array count + inner type check untuk array di converter, (2) Rename extension displayName

> **Deliverables**:
> - Array asserts: `isList` + `count == N` + inner type check index 0
> - Extension renamed: "Hurl Formatter: json to assert"

> **Estimated Effort**: Short
> **Parallel Execution**: NO - sequential tasks
> **Critical Path**: Rename extension → Test → Build

---

## Context

### Original Request
- Untuk array type: tambahkan count yang ngikuti input, dan check inner type (tapi hanya index 0)
- Rename extension: "Hurl Formatter: json to assert" (prefix "Hurl Formatter:" untuk extensibility)

### Research Findings
- **HURL syntax** (from web search):
  - `jsonpath "$" isList` - check array type
  - `jsonpath "$" count == N` - check jumlah item (PAKAI == bukan countEqual)
  - Array index: `$.0` atau `$[0]` - akses index pertama

### Expected Output Example
Input:
```json
[{"name": "a"}, {"name": "b"}]
```

Expected:
```
jsonpath "$" isList
jsonpath "$" count == 2
jsonpath "$.0" isObject
jsonpath "$.0.name" isString
```

---

## Work Objectives

### Core Objective
1. Perbaiki converter untuk generate array assertions dengan count + inner type
2. Rename extension displayName

### Must Have
- [ ] Array assertion: `jsonpath "$" isList`
- [ ] Array count: `jsonpath "$" count == LENGTH` (ikuti input array length)
- [ ] Inner type check: check type dari index 0 saja
- [ ] Extension displayName: "Hurl Formatter: json to assert"

### Must NOT Have
- [ ] Jangan check semua array items - hanya index 0
- [ ] Jangan rename semua - hanya displayName, bukan codebase

---

## Execution Strategy

### Waves

```
Wave 1 (sequential):
├── Task 1: Update converter.ts - array handling
├── Task 2: Update extension.ts - rename displayName
└── Task 3: Build + test
```

---

## TODOs

- [x] 1. Update converter.ts - array handling

  **What to do**:
  - Modify `walkObject` function di `src/converter.ts`
  - When Array detected:
    1. Add: `jsonpath "${path}" isList`
    2. Add: `jsonpath "${path}" count == LENGTH` (LENGTH = array.length)
    3. If array has items: walk through index 0 only (NOT all items)
  
  **Example expected output**:
  Input: `[{"name": "a"}]`
  
  Output:
  ```
  jsonpath "$" isList
  jsonpath "$" count == 1
  jsonpath "$.0" isObject
  jsonpath "$.0.name" isString
  ```

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Simple code modification, single file
  - **Skills**: []
  - **Skills Evaluated but Omitted**: N/A

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 1
  - **Blocks**: Task 2
  - **Blocked By**: None

  **References**:
  - Current implementation: `src/converter.ts:26-28` - array detection
  - HURL syntax reference (web search): 
    - `jsonpath "$" isList` - check array
    - `jsonpath "$" count == 2` - check length (PAKAI ==)

  **Acceptance Criteria**:
  - [ ] Input: `[1, 2, 3]` → Output includes: `isList`, `count == 3`, `isInteger` (from index 0)
  - [ ] Input: `[{"a": 1}]` → Output includes: `isList`, `count == 1`, `isObject`, `isInteger` (from index 0)
  - [ ] Input: `[]` → Output includes: `isList`, `count == 0` (empty array)

  **QA Scenarios**:
  ```
  Scenario: Array with numbers
    Tool: Bash (node REPL)
    Steps:
      1. Import converter and parse "[1, 2, 3]"
      2. Check output contains "isList"
      3. Check output contains "count == 3"
      4. Check output contains "isInteger" (from index 0)
    Expected Result: All 3 present
    Evidence: output in terminal

  Scenario: Array with objects
    Tool: Bash (node REPL)
    Steps:
      1. Import converter and parse '[{"name": "a"}]'
      2. Check output contains "isList"
      3. Check output contains "count == 1"
      4. Check output contains "isObject"
      5. Check output contains "isString"
    Expected Result: All 5 present
    Evidence: output in terminal
  ```

  **Commit**: NO

- [x] 2. Update extension.ts - displayName

  **What to do**:
  - Read `extension.ts`
  - Find `displayName` field
  - Change from current value to: "Hurl Formatter: json to assert"

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Simple string replacement, single file
  - **Skills**: []
  - **Skills Evaluated but Omitted**: N/A

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 1
  - **Blocks**: None (after Task 1)
  - **Blocked By**: Task 1

  **References**:
  - File: `extension.ts` - extension configuration

  **Acceptance Criteria**:
  - [ ] displayName is exactly: "Hurl Formatter: json to assert"

  **QA Scenarios**:
  ```
  Scenario: Verify extension name
    Tool: Read file and grep
    Steps:
      1. Read extension.ts
      2. Find "displayName"
      3. Verify value is "Hurl Formatter: json to assert"
    Expected Result: Match exact string
    Evidence: Line content
  ```

  **Commit**: NO

- [x] 3. Build extension

  **What to do**:
  - Run: `npm run compile`
  - Package: `npx vsce package`
  - Verify .vsix exists

  **Acceptance Criteria**:
  - [ ] Build succeeds
  - [ ] .vsix file generated

  **Commit**: NO

---

## Final Verification Wave

- [x] F1. **Array Output Verification** — `quick`
  Test converter with different array inputs.
  Output: Arrays correctly generate isList + count + inner type

---

## Success Criteria

### Verification Commands
```bash
npm run compile && npx vsce package
```

### Final Checklist
- [ ] Array: isList + count == N + inner type (index 0)
- [ ] Extension displayName: "Hurl Formatter: json to assert"
- [ ] Build succeeds
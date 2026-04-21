# Work Plan: JSON to HURL Asserts VS Code Extension

## Overview
Create VS Code extension that converts JSON to HURL asserts (type-checking only).

## Scope

**IN:**
- VS Code extension with Command Palette integration
- JSON input from popup/inputbox (vscode.window.showInputBox)
- Type-only assertions (isBoolean, isString, isInteger, isNumber, isList, isObject)
- Null handling with `!= null`
- Optional field handling with `exists`
- Insert at cursor position with [Asserts] wrapper

**OUT:**
- Value-based assertions
- Settings/UI panel
- Batch processing
- Two-way conversion

## Key Decisions

| Decision | Rationale |
|----------|------------|
| Array = `isList` | Simplicity - type check only, not per-element |
| Null = `!= null` | Explicit null comparison |
| Optional = `exists` | Follows HURL exists pattern |
| No max depth | Simple MVP - let user control input |

## Implementation Steps

### Phase 1: Project Setup
- [x] Initialize npm project with `npm init -y`
- [x] Install dependencies: `vsce`, `typescript`, `@types/vscode`, `esbuild`
- [x] Create tsconfig.json for VS Code extension
- [x] Create .vscode/launch.json for debugging
- [x] Verify empty shell builds with `npx vsce package --dry-run`

### Phase 2: Extension Manifest
- [x] Create package.json with:
  - name: `json-to-hurl-asserts`
  - displayName: `JSON to HURL Asserts`
  - activationEvents: `onCommand:extension.convertJsonToHurl`
  - contributes.commands: `extension.convertJsonToHurl`
  - engines: `^1.80.0`
- [x] Create extension.ts entry point with:
  - `activate()` function
  - `deactivate()` function
  - Console log for debugging

### Phase 3: Core Command Implementation
- [x] Register command: `vscode.commands.registerCommand('extension.convertJsonToHurl', ...)`
- [x] Show input popup: `vscode.window.showInputBox({ prompt: 'Paste JSON here', placeHolder: '{"key": "value"}' })`
- [x] Handle empty/cancelled input: `if (!json) return` - exit gracefully
- [x] Get active editor for cursor position: `vscode.window.activeTextEditor`
- [x] Handle no-editor error: `vscode.window.showErrorMessage('No active editor - open a .hurl file first')`

### Phase 4: JSON Parser
- [x] Create src/converter.ts module
- [x] Implement `parseJsonToAsserts(jsonString: string): string`
- [x] Use try-catch for JSON parse errors
- [x] Error handling: `vscode.window.showErrorMessage('Invalid JSON: ' + error.message)`
- [x] Support nested objects (recursive walk)

### Phase 5: Conversion Logic (Type Predicates)
- [x] Map JSON types to HURL predicates:
  - `string` → `isString`
  - `number` (non-integer) → `isNumber`
  - `number` (integer) → `isInteger`
  - `boolean` → `isBoolean`
  - `null` → `!= null`
  - `array` → `isList`
  - `object` → `isObject`
- [x] Generate JSONPath: `$.parent.child` for nested keys
- [x] Handle special characters in keys (escape if needed)
- [x] Add `[Asserts]` wrapper around output

### Phase 6: Editor Integration
- [x] Get cursor position: `editor.selection.active`
- [x] Insert text: `editor.edit(editBuilder => editBuilder.insert(position, output))`
- [x] Show success message: `vscode.window.showInformationMessage('Asserts generated!')`

### Phase 7: Testing & Verification
- [x] Test: Simple object `{"name": "test", "count": 5}` → 2 asserts
- [x] Test: Nested object `{"user": {"id": 1}}` → nested path asserts
- [x] Test: Null value `{"key": null}` → `!= null` assert
- [x] Test: Array `{"items": []}` → `isList` assert
- [x] Test: Invalid JSON → error message
- [x] Test: No editor open → error message

### Phase 8: Build & Package
- [x] Compile TypeScript: `npx tsc`
- [x] Package extension: `npx vsce package`
- [x] Verify .vsix file created

## Acceptance Criteria

| Scenario | Input (from popup) | Expected Output |
|----------|---------------------|-----------------|
| Simple object | `{"name": "test", "active": true}` | `[Asserts]\njsonpath "$.name" isString\njsonpath "$.active" isBoolean` |
| Nested object | `{"user": {"id": 1}}` | `[Asserts]\njsonpath "$.user" isObject\njsonpath "$.user.id" isInteger` |
| Null field | `{"deleted": null}` | `[Asserts]\njsonpath "$.deleted" != null` |
| Array field | `{"items": [1,2,3]}` | `[Asserts]\njsonpath "$.items" isList` |
| Invalid JSON | `{"broken":` | Error: "Invalid JSON" |
| Cancelled popup | (user presses Escape) | No action, exit gracefully |
| No editor open | (no .hurl file open) | Error: "No active editor" |

## File Structure

```
hurl-json-to-asserts/
├── package.json          # Extension manifest
├── tsconfig.json         # TypeScript config
├── extension.ts          # Main entry point
├── src/
│   └── converter.ts      # JSON → HURL conversion logic
├── .vscode/
│   └── launch.json       # Debug configuration
└── .vsix                 # Built extension (after packaging)
```

## Guardrails (from Metis)
- No value assertions (type-only)
- No settings UI panel
- No batch processing
- Keep conversion logic in separate testable module

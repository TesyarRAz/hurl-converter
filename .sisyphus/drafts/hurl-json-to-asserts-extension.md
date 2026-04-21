# Draft: JSON to HURL Asserts VS Code Extension

## Task Summary
Buat VS Code extension yang meng-convert JSON menjadi HURL asserts (type-checking only).

## Research Findings

### HURL Assert Syntax
- **Format**: `jsonpath "$.path" <predicate>`
- **Type predicates**:
  - `isBoolean` - value is boolean
  - `isString` - value is string  
  - `isInteger` - value is integer
  - `isNumber` - value is number (int/float)
  - `isList` - value is array
  - `isObject` - value is object
- **Docs**: https://hurl.dev/docs/asserting-response.html#jsonpath-assert

### VS Code Extension Architecture
- `package.json`: activationEvents, contributes.commands
- `extension.ts`: registerCommand, vscode.window.activeTextEditor
- Popup options: showInputBox (simple) vs WebviewPanel (rich UI)

## Requirements (Draft)

### Core Features
1. **Command Palette**: "Convert JSON to HURL Asserts"
2. **Input**: Dari active editor (selection atau full document)
3. **Output**: Insert assert block di cursor position
4. **Conversion Logic**: JSON structure → JSONPath + type predicate

### Conversion Rules
| JSON Type | HURL Assert |
|-----------|-------------|
| `{"key": "value"}` (string) | `jsonpath "$.key" isString` |
| `{"key": 123}` (number) | `jsonpath "$.key" isNumber` |
| `{"key": true}` (boolean) | `jsonpath "$.key" isBoolean` |
| `{"key": null}` | `jsonpath "$.key" == null` |
| `{"key": []}` (array) | `jsonpath "$.key" isList` |
| `{"key": {}}` (object) | `jsonpath "$.key" isObject` |
| Nested objects | Recursive - walk all paths |

### Example
Input JSON:
```json
{
  "user": {
    "id": 1,
    "name": "John",
    "active": true,
    "tags": ["vip", "premium"]
  }
}
```

Output HURL Asserts:
```hurl
[Asserts]
jsonpath "$.user.id" isInteger
jsonpath "$.user.name" isString
jsonpath "$.user.active" isBoolean
jsonpath "$.user.tags" isList
```

## Confirmed Requirements
- **Null**: `jsonpath "$.key" == null`
- **Optional fields**: exists + type check (e.g., `jsonpath "$.optional" exists && jsonpath "$.optional" isString`)
- **Output**: Auto-wrap dengan `[Asserts]` header

## Conversion Rules (Final)
| JSON Type | HURL Assert |
|-----------|-------------|
| `{"key": "value"}` (string) | `jsonpath "$.key" isString` |
| `{"key": 123}` (number) | `jsonpath "$.key" isNumber` |
| `{"key": 123}` (integer) | `jsonpath "$.key" isInteger` |
| `{"key": true}` (boolean) | `jsonpath "$.key" isBoolean` |
| `{"key": null}` | `jsonpath "$.key" == null` |
| `{"key": []}` (array) | `jsonpath "$.key" isList` |
| `{"key": {}}` (object) | `jsonpath "$.key" isObject` |
| Optional field | `jsonpath "$.field" exists` + type check |

## Next Steps
1. Create work plan with implementation steps
2. Scaffold VS Code extension project
3. Implement conversion logic
4. Register command and integrate with editor

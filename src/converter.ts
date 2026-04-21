/**
 * JSON to HURL Asserts Converter
 * Converts JSON (or JSONC - JSON with Comments) to HURL type assertions
 */

import { parse } from 'jsonc-parser';

/**
 * Parse JSON string and generate HURL type assertions
 * @param jsonString - JSON or JSONC string to convert
 * @returns HURL asserts string wrapped in [Asserts] block
 * @throws Error if JSON is invalid
 */
export function parseJsonToAsserts(jsonString: string): string {
  const parsed = parse(jsonString);
  const asserts: string[] = [];
  
  walkObject(parsed, '$', asserts, true);
  
  return `[Asserts]\n${asserts.join('\n')}`;
}

function walkObject(obj: any, path: string, asserts: string[], isRoot: boolean = false): void {
  if (obj === null) {
    asserts.push(`jsonpath "${path}" != null`);
  }
  
  if (Array.isArray(obj)) {
    asserts.push(`jsonpath "${path}" isList`);
    asserts.push(`jsonpath "${path}" count == ${obj.length}`);
    // Check inner type only for index 0
  if (obj.length > 0) {
      walkObject(obj[0], `${path}[0]`, asserts);
    }
    return;
  }
  
  switch (typeof obj) {
    case 'string':
      asserts.push(`jsonpath "${path}" isString`);
      break;
    case 'number':
      if (Number.isInteger(obj)) {
        asserts.push(`jsonpath "${path}" isInteger`);
      } else {
        asserts.push(`jsonpath "${path}" isNumber`);
      }
      break;
    case 'boolean':
      asserts.push(`jsonpath "${path}" isBoolean`);
      break;
    case 'object':
      if (!isRoot) {
        asserts.push(`jsonpath "${path}" isObject`);
      }
      for (const key of Object.keys(obj)) {
        const value = obj[key];
        const childPath = `${path}.${key}`;
        walkObject(value, childPath, asserts);
      }
      break;
    default:
      break;
  }
}

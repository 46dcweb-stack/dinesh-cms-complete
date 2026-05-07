/**
 * Smart fallback helper — returns Firebase value if it has meaningful content,
 * otherwise returns the static default.
 * Works for strings, arrays, and nested objects.
 */

// String: use Firebase if non-empty
export function fbStr(firebaseVal: any, staticVal: string): string {
  if (typeof firebaseVal === "string" && firebaseVal.trim().length > 0) return firebaseVal;
  return staticVal;
}

// Array: use Firebase if has items, else static
export function fbArr<T>(firebaseVal: any, staticVal: T[]): T[] {
  if (Array.isArray(firebaseVal) && firebaseVal.length > 0) return firebaseVal;
  return staticVal;
}

// Any value: use Firebase if not null/undefined/empty
export function fbVal<T>(firebaseVal: any, staticVal: T): T {
  if (firebaseVal !== null && firebaseVal !== undefined && firebaseVal !== "") return firebaseVal;
  return staticVal;
}

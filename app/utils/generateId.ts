
/**
 * Generates a unique ID that works across all browsers including mobile
 * Falls back to a custom implementation if crypto.randomUUID is not available
 */
export function generateId(): string {
  // Try to use crypto.randomUUID if available
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  // Fallback for older browsers and some mobile browsers
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

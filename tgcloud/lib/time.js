/** Convert schema timestamp (Date | number) to unix seconds for API responses. */
export function toUnixSeconds(value) {
  if (value == null) return null;
  if (value instanceof Date) return Math.floor(value.getTime() / 1000);
  if (typeof value === 'number') return value;
  return null;
}

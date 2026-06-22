/** Minimal className joiner — no runtime dep needed for this prototype. */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

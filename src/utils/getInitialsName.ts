/** First two characters of the trimmed string — no case or word formatting. */
export default function getInitialsName(value?: unknown): string {
  if (typeof value !== "string") return "";
  const s = value.trim();
  if (s.length === 0) return "";
  return s.slice(0, 2);
}

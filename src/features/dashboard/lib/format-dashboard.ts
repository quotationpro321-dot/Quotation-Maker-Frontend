const MINUTE_MS = 60_000;
const HOUR_MS = 3_600_000;
const DAY_MS = 86_400_000;

export function formatRelativeTime(isoDate: string): string {
  const date = new Date(isoDate);
  const diffMs = Date.now() - date.getTime();

  if (diffMs < MINUTE_MS) return "Just now";
  if (diffMs < HOUR_MS) {
    const minutes = Math.floor(diffMs / MINUTE_MS);
    return `${minutes}m ago`;
  }
  if (diffMs < DAY_MS) {
    const hours = Math.floor(diffMs / HOUR_MS);
    return `${hours}h ago`;
  }
  const days = Math.floor(diffMs / DAY_MS);
  if (days === 1) return "1d ago";
  if (days < 7) return `${days}d ago`;

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

export function formatCurrency(value: number, currency = "GBP"): string {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatTrendPercent(value: number): string {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value}%`;
}

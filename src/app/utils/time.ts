// utils/time.ts

const UNITS: { limit: number; div: number; label: string }[] = [
  { limit: 60, div: 1, label: 'second' },
  { limit: 3600, div: 60, label: 'minute' },
  { limit: 86400, div: 3600, label: 'hour' },
  { limit: 604800, div: 86400, label: 'day' },
  { limit: 2629800, div: 604800, label: 'week' },
  { limit: 31557600, div: 2629800, label: 'month' },
  { limit: Infinity, div: 31557600, label: 'year' },
];

export const relativeTime = (timestampSec: number | undefined): string => {
  if (!timestampSec) return 'unknown';
  const diff = Math.max(0, Math.floor(Date.now() / 1000 - timestampSec));
  if (diff < 5) return 'just now';
  const unit = UNITS.find((u) => diff < u.limit)!;
  const value = Math.floor(diff / unit.div);
  return `${value} ${unit.label}${value === 1 ? '' : 's'} ago`;
};

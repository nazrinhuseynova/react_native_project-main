const UNITS = ['B', 'KB', 'MB', 'GB', 'TB'] as const;

export function formatBytes(bytes: number, decimals = 1): string {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return '0 B';
  }

  const base = 1024;
  const fractionDigits = Math.max(0, decimals);
  const unitIndex = Math.min(
    UNITS.length - 1,
    Math.floor(Math.log(bytes) / Math.log(base)),
  );

  const size = bytes / Math.pow(base, unitIndex);
  const formatted =
    unitIndex === 0 ? String(Math.round(size)) : String(Number(size.toFixed(fractionDigits)));

  return `${formatted} ${UNITS[unitIndex]}`;
}
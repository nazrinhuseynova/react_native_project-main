export type RuntimeLabels = {
  hours: string;
  minutes: string;
};

function toSafeInteger(value: number): number {
  return Math.max(0, Math.floor(Number.isFinite(value) ? value : 0));
}

export function formatDuration(totalSeconds: number): string {
  const safe = toSafeInteger(totalSeconds);
  const hours = Math.floor(safe / 3600);
  const minutes = Math.floor((safe % 3600) / 60);
  const seconds = safe % 60;
  const secondsText = String(seconds).padStart(2, '0');

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${secondsText}`;
  }

  return `${minutes}:${secondsText}`;
}

export function formatRuntime(
  totalMinutes: number,
  labels: RuntimeLabels = { hours: 'h', minutes: 'm' },
): string {
  const safe = toSafeInteger(totalMinutes);
  const hours = Math.floor(safe / 60);
  const minutes = safe % 60;

  if (hours === 0) return `${minutes}${labels.minutes}`;
  if (minutes === 0) return `${hours}${labels.hours}`;
  return `${hours}${labels.hours} ${minutes}${labels.minutes}`;
}
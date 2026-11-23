export const DOWNLOAD_QUALITIES = ['standard', 'high'] as const;

export type DownloadQuality = (typeof DOWNLOAD_QUALITIES)[number];

export function isDownloadQuality(value: string): value is DownloadQuality {
  return (DOWNLOAD_QUALITIES as readonly string[]).includes(value);
}

const MEGABITS_PER_SECOND: Record<DownloadQuality, number> = { standard: 1.5, high: 4 };

/** Təxmini ölçü (Downloads for You üçün büdcə hesabı). */
export function estimateBytes(quality: DownloadQuality, runtimeMinutes: number): number {
  return Math.round((MEGABITS_PER_SECOND[quality] * 1_000_000 * runtimeMinutes * 60) / 8);
}
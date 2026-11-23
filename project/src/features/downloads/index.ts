export { DownloadsScreen } from './presentation/screens/DownloadsScreen';

export { DownloadButton } from './presentation/components/DownloadButton';
export { OfflineGateBanner } from './presentation/components/OfflineGateBanner';
export { QualityPicker } from './presentation/components/QualityPicker';
export { StorageUsageBar } from './presentation/components/StorageUsageBar';

export { DownloadsProvider } from './application/DownloadsProvider';
export { useDownloads } from './application/hooks/useDownloads';
export { useDownloadState } from './application/hooks/useDownloadState';
export { useStorageUsage } from './application/hooks/useStorageUsage';
export { setDownloadsTaskRunner } from './application/downloadsBackgroundTask';

export type { DownloadItem } from './domain/entities/DownloadItem';
export type { DownloadQuality } from './domain/entities/DownloadQuality';
export type { DownloadStatus } from './domain/entities/DownloadStatus';
export type { DownloadRepository } from './domain/repositories/DownloadRepository';
export type { DownloadEngine, DownloadSourceResolver } from './domain/ports/DownloadEngine';
export type { ForYouCandidate } from './domain/policies/DownloadsForYouPolicy';
export type {
  ForYouProvider,
  NextEpisodeInfo,
  NextEpisodeLookup,
  SmartContext,
} from './domain/usecases/RunSmartDownloads';

// ── container.ts üçün ──
export { DownloadsForYouPolicy } from './domain/policies/DownloadsForYouPolicy';
export { LicensePolicy } from './domain/policies/LicensePolicy';
export { SmartDownloadPolicy } from './domain/policies/SmartDownloadPolicy';
export { WifiOnlyPolicy } from './domain/policies/WifiOnlyPolicy';
export { CheckLicenses } from './domain/usecases/CheckLicenses';
export { DeleteDownload } from './domain/usecases/DeleteDownload';
export { EnqueueDownload } from './domain/usecases/EnqueueDownload';
export { PauseDownload } from './domain/usecases/PauseDownload';
export { ResumeDownload } from './domain/usecases/ResumeDownload';
export { RunSmartDownloads } from './domain/usecases/RunSmartDownloads';
export { ExpoFileDownloadEngine } from './data/ExpoFileDownloadEngine';
export { SqliteDownloadRepository } from './data/SqliteDownloadRepository';
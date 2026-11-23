import type { SupabaseClient } from '@supabase/supabase-js';
import type { QueryClient } from '@tanstack/react-query';

import { AnalyticsService } from '@/core/analytics/AnalyticsService';
import type { AnalyticsSink } from '@/core/analytics/AnalyticsSink';
import { ConsoleSink } from '@/core/analytics/sinks/ConsoleSink';
import { SupabaseSink } from '@/core/analytics/sinks/SupabaseSink';
import { createSupabaseClient } from '@/core/backend/supabase/createSupabaseClient';
import { env } from '@/core/config/env';
import { featureFlags } from '@/core/config/featureFlags';
import type { DeviceInfoProvider } from '@/core/device/DeviceInfoProvider';
import { ExpoDeviceInfoProvider } from '@/core/device/ExpoDeviceInfoProvider';
import type { AppEventBus, AppEvents } from '@/core/events/AppEvents';
import { EventBus } from '@/core/events/EventBus';
import { FetchHttpClient } from '@/core/http/FetchHttpClient';
import { AuthInterceptor } from '@/core/http/interceptors/AuthInterceptor';
import { ErrorMappingInterceptor } from '@/core/http/interceptors/ErrorMappingInterceptor';
import { LoggingInterceptor } from '@/core/http/interceptors/LoggingInterceptor';
import { RetryInterceptor } from '@/core/http/interceptors/RetryInterceptor';
import { i18n } from '@/core/i18n/i18n';
import { DeepLinkRegistry } from '@/core/linking/DeepLinkRegistry';
import { ConsoleLogger } from '@/core/logging/ConsoleLogger';
import type { Logger } from '@/core/logging/Logger';
import { networkMonitor } from '@/core/network/ExpoNetworkMonitor';
import type { NetworkMonitor } from '@/core/network/NetworkMonitor';
import { ExpoNotificationScheduler } from '@/core/notifications/ExpoNotificationScheduler';
import type { NotificationScheduler } from '@/core/notifications/NotificationScheduler';
import { createQueryClient } from '@/core/query/queryClient';
import type { Registry } from '@/core/registry/Registry';
import { Hasher } from '@/core/security/Hasher';
import { AsyncStorageAdapter } from '@/core/storage/AsyncStorageAdapter';
import type { KeyValueStorage } from '@/core/storage/KeyValueStorage';
import type { SecureStorage } from '@/core/storage/SecureStorage';
import { SecureStoreAdapter } from '@/core/storage/SecureStoreAdapter';
import {
  ChangeEmail,
  ChangePassword,
  DeletionGracePolicy,
  ListDevices,
  RequestAccountDeletion,
  RestoreAccount,
  RevokeDevice,
  StepUpAuthPolicy,
  SupabaseAccountRepository,
} from '@/features/account';
import {
  BiometricCredentialStore,
  BiometricStrategy,
  createAuthStrategyRegistry,
  EmailOtpStrategy,
  EmailPasswordStrategy,
  GoogleOAuthStrategy,
  LoginAttemptPolicy,
  OtpPolicy,
  PasswordPolicy,
  PasswordStrengthPolicy,
  RequestPasswordReset,
  ResendVerification,
  ResetPassword,
  RestoreSession,
  SignIn,
  SignOut,
  SignOutAllDevices,
  SignUp,
  SupabaseAuthRepository,
  SupabaseDeviceRepository,
  VerifyOtp,
} from '@/features/auth';
import {
  GetRecommendations,
  GetSeason,
  GetTitleDetails,
  OmdbImdbRatingSource,
  TmdbClient,
  TmdbDiscoverRepository,
  TmdbGenreRepository,
  TmdbImageUrlBuilder,
  TmdbPersonRepository,
  TmdbRatingSource,
  TmdbTitleRepository,
  type DiscoverRepository,
  type GenreRepository,
  type PersonRepository,
  type RatingSource,
  type TitleRepository,
} from '@/features/catalog';
import {
  CheckLicenses,
  DeleteDownload,
  DownloadsForYouPolicy,
  EnqueueDownload,
  ExpoFileDownloadEngine,
  LicensePolicy,
  PauseDownload,
  ResumeDownload,
  RunSmartDownloads,
  SmartDownloadPolicy,
  SqliteDownloadRepository,
  WifiOnlyPolicy,
  type DownloadSourceResolver,
  type NextEpisodeLookup,
} from '@/features/downloads';
import {
  ClearHistory,
  CompletionPolicy,
  ContinueWatchingSelector,
  GetContinueWatching,
  GetWatched,
  LocalProgressBuffer,
  progressFraction,
  RemoveFromHistory,
  SaveProgress,
  SupabaseHistoryRepository,
} from '@/features/history';
import { createHomeRowRegistry, type HomeRow, type HomeSources } from '@/features/home';
import {
  createLibraryFilterRegistry,
  createLibrarySortRegistry,
  QueryLibrary,
  SetWatchStatus,
  SupabaseLibraryRepository,
  ToggleFavorite,
  ToggleSaved,
} from '@/features/library';
import {
  CancelReminder,
  ScheduleReminder,
  SupabaseReminderRepository,
} from '@/features/newhot';
import {
  AsyncOnboardingRepository,
  createOnboardingStepRegistry,
  type OnboardingRepository,
  type OnboardingStep,
} from '@/features/onboarding';
import {
  BlockTitle,
  CompositePolicy,
  createContentPolicyRegistry,
  FilterTitles,
  SetMaxMaturity,
  SupabaseParentalRepository,
  UnblockTitle,
} from '@/features/parental';
import {
  DemoStreamResolver,
  LocalStreamResolver,
  NoopCastAdapter,
  parseEpisodeId,
  ResolvePlayback,
  SupabaseSkipSegmentRepository,
  toEpisodeId,
  type EntitlementGate,
} from '@/features/player';
import {
  CreateProfile,
  DeleteProfile,
  PinHasher,
  PinPolicy,
  ProfileLimitPolicy,
  SetProfilePin,
  SupabaseAvatarStorage,
  SupabaseProfileRepository,
  SwitchProfile,
  UpdateProfile,
  VerifyProfilePin,
} from '@/features/profiles';
import {
  AddReview,
  DeleteReview,
  EditReview,
  ReviewPolicy,
  SetReaction,
  SupabaseReactionRepository,
  SupabaseReviewRepository,
} from '@/features/reviews';
import {
  AsyncRecentSearchRepository,
  createSearchStrategyRegistry,
  SearchOrchestrator,
  TmdbSearchRepository,
} from '@/features/search';
import { AsyncSettingsRepository, createSettingsSectionRegistry } from '@/features/settings';
import { storageKeys } from '@/core/storage/storageKeys';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const OMDB_BASE_URL = 'https://www.omdbapi.com';

const DEMO_DOWNLOAD_URL =
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

function toTmdbLanguage(language: string): string {
  const normalized = language.toLowerCase();
  if (normalized.startsWith('az')) return 'az-AZ';
  if (normalized.startsWith('ru')) return 'ru-RU';
  return 'en-US';
}


class FreeEntitlementGate implements EntitlementGate {
  async check(): ReturnType<EntitlementGate['check']> {
    return { allowed: true, source: 'free' };
  }
}



function createAuthServices({
  supabase,
  secureStorage,
}: {
  supabase: SupabaseClient;
  secureStorage: SecureStorage;
}) {
  const repository = new SupabaseAuthRepository(supabase);
  const devices = new SupabaseDeviceRepository(supabase);
  const biometric = new BiometricStrategy(supabase, new BiometricCredentialStore(secureStorage));


  const strategies = createAuthStrategyRegistry([
    new EmailPasswordStrategy(supabase),
    new GoogleOAuthStrategy(supabase),
    new EmailOtpStrategy(supabase),
    biometric,
  ]);

  const password = new PasswordPolicy();
  const otp = new OtpPolicy();

  return {
    repository,
    devices,
    strategies,
    biometric,
    signUp: new SignUp(strategies, password),
    signIn: new SignIn(strategies),
    signOut: new SignOut(repository),
    signOutAllDevices: new SignOutAllDevices(repository),
    restoreSession: new RestoreSession(repository),
    requestPasswordReset: new RequestPasswordReset(repository),
    verifyOtp: new VerifyOtp(repository, strategies, otp),
    resetPassword: new ResetPassword(repository, password),
    resendVerification: new ResendVerification(repository),
    policies: {
      password,
      strength: new PasswordStrengthPolicy(),
      loginAttempt: new LoginAttemptPolicy(),
      otp,
    },
  };
}

function createAccountServices({
  supabase,
  deviceInfo,
  auth,
}: {
  supabase: SupabaseClient;
  deviceInfo: DeviceInfoProvider;
  auth: ReturnType<typeof createAuthServices>;
}) {
  const repository = new SupabaseAccountRepository(supabase);
  const grace = new DeletionGracePolicy();

  return {
    repository,
    policies: { stepUp: new StepUpAuthPolicy(), grace },
    changePassword: new ChangePassword(repository, auth.policies.password),
    changeEmail: new ChangeEmail(repository),
    requestDeletion: new RequestAccountDeletion(repository, grace),
    restore: new RestoreAccount(repository, grace),
    listDevices: new ListDevices(auth.devices, deviceInfo),
    revokeDevice: new RevokeDevice(auth.devices, deviceInfo),
  };
}

function createProfileServices({
  supabase,
  storage,
  secureStorage,
  eventBus,
}: {
  supabase: SupabaseClient;
  storage: KeyValueStorage;
  secureStorage: SecureStorage;
  eventBus: AppEventBus;
}) {
  const repository = new SupabaseProfileRepository(supabase);
  const avatars = new SupabaseAvatarStorage(supabase);
  const crypto = new PinHasher(new Hasher());
  const limit = new ProfileLimitPolicy();
  const pin = new PinPolicy();

  return {
    repository,
    policies: { limit, pin },
    create: new CreateProfile(repository, limit, avatars),
    update: new UpdateProfile(repository, avatars),
    remove: new DeleteProfile(repository, avatars),
    setPin: new SetProfilePin(repository, crypto, pin, secureStorage),
    verifyPin: new VerifyProfilePin(repository, crypto, pin, secureStorage),
    switch: new SwitchProfile(repository, storage, eventBus),
  };
}

function createParentalServices({ supabase }: { supabase: SupabaseClient }) {
  const repository = new SupabaseParentalRepository(supabase);
  const policy = new CompositePolicy(createContentPolicyRegistry().all());

  return {
    repository,
    policy,
    filterTitles: new FilterTitles(policy),
    setMaxMaturity: new SetMaxMaturity(repository),
    blockTitle: new BlockTitle(repository),
    unblockTitle: new UnblockTitle(repository),
  };
}

function createHistoryServices({
  supabase,
  storage,
}: {
  supabase: SupabaseClient;
  storage: KeyValueStorage;
}) {
  const repository = new SupabaseHistoryRepository(supabase);
  const policy = new CompletionPolicy();
  const buffer = new LocalProgressBuffer(storage);

  return {
    repository,
    save: new SaveProgress(repository, policy, buffer),
    getContinueWatching: new GetContinueWatching(repository, new ContinueWatchingSelector(policy)),
    getWatched: new GetWatched(repository),
    remove: new RemoveFromHistory(repository),
    clear: new ClearHistory(repository),
  };
}

function createLibraryServices({
  supabase,
  eventBus,
}: {
  supabase: SupabaseClient;
  eventBus: AppEventBus;
}) {
  const repository = new SupabaseLibraryRepository(supabase);

  return {
    repository,
    query: new QueryLibrary(),
    toggleSaved: new ToggleSaved(repository, eventBus),
    toggleFavorite: new ToggleFavorite(repository, eventBus),
    setWatchStatus: new SetWatchStatus(repository),
    sorters: createLibrarySortRegistry(),
    filters: createLibraryFilterRegistry(),
  };
}

function createReviewServices({
  supabase,
  eventBus,
}: {
  supabase: SupabaseClient;
  eventBus: AppEventBus;
}) {
  const reviews = new SupabaseReviewRepository(supabase);
  const reactions = new SupabaseReactionRepository(supabase);
  const policy = new ReviewPolicy();

  return {
    reviews,
    reactions,
    add: new AddReview(reviews, policy, eventBus),
    edit: new EditReview(reviews, policy, eventBus),
    remove: new DeleteReview(reviews),
    setReaction: new SetReaction(reactions),
  };
}

function createCatalogServices({
  logger,
  images,
}: {
  logger: Logger;
  images: TmdbImageUrlBuilder;
}) {
  const tmdbHttp = new FetchHttpClient({
    baseUrl: TMDB_BASE_URL,
    interceptors: [
      new LoggingInterceptor(logger),
      new ErrorMappingInterceptor(),
      new RetryInterceptor(),
      new AuthInterceptor(() => env.tmdbToken),
    ],
  });
  const omdbHttp = new FetchHttpClient({
    baseUrl: OMDB_BASE_URL,
    interceptors: [new ErrorMappingInterceptor(), new RetryInterceptor()],
  });

  const client = new TmdbClient({
    http: tmdbHttp,
    getLanguage: () => toTmdbLanguage(i18n.language),
  });
  const titles = new TmdbTitleRepository(client, images);

  return {
    client,
    discover: new TmdbDiscoverRepository(client, images),
    titles,
    genres: new TmdbGenreRepository(client),
    people: new TmdbPersonRepository(client, images),
    ratingSources: [new TmdbRatingSource(), new OmdbImdbRatingSource(omdbHttp, env.omdbKey)],
    getTitleDetails: new GetTitleDetails(titles),
    getSeason: new GetSeason(titles),
    getRecommendations: new GetRecommendations(titles),
  };
}

function createSearchServices({
  storage,
  catalog,
  images,
}: {
  storage: KeyValueStorage;
  catalog: ReturnType<typeof createCatalogServices>;
  images: TmdbImageUrlBuilder;
}) {
  const repository = new TmdbSearchRepository(catalog.client, images);
  const strategies = createSearchStrategyRegistry({
    repository,
    genres: catalog.genres,
    discover: catalog.discover,
  });

  return {
    recent: new AsyncRecentSearchRepository(storage),
    orchestrator: new SearchOrchestrator(strategies),
  };
}

function createDownloadsServices({ catalog }: { catalog: ReturnType<typeof createCatalogServices> }) {
  const repository = new SqliteDownloadRepository();
  const engine = new ExpoFileDownloadEngine();
  const licensePolicy = new LicensePolicy();
  const wifi = new WifiOnlyPolicy();

  const resolveSource: DownloadSourceResolver = async () => DEMO_DOWNLOAD_URL;
  const enqueue = new EnqueueDownload(repository, engine, resolveSource, wifi);
  const remove = new DeleteDownload(repository, engine);

  const nextEpisode: NextEpisodeLookup = async (titleId, episodeId) => {
    const current = parseEpisodeId(episodeId);
    if (!current) return null;
    const season = await catalog.getSeason.execute(titleId, current.seasonNumber).catch(() => null);
    const next = season?.episodes.find((item) => item.episodeNumber === current.episodeNumber + 1);
    if (!next) return null;
    return {
      episodeId: toEpisodeId({ seasonNumber: next.seasonNumber, episodeNumber: next.episodeNumber }),
      title: next.name,
      posterPath: null,
    };
  };

  return {
    repository,
    engine,
    licensePolicy,
    smart: new RunSmartDownloads({
      repository,
      engine,
      smart: new SmartDownloadPolicy(),
      forYou: new DownloadsForYouPolicy(),
      wifi,
      enqueue,
      remove,
      nextEpisode,
      forYouProvider: async () => [],
    }),
    licenses: new CheckLicenses(repository, engine, licensePolicy),
    enqueue,
    pause: new PauseDownload(repository, engine),
    resume: new ResumeDownload(repository, engine, wifi),
    remove,
  };
}

function createPlayerServices({
  supabase,
  storage,
  history,
  downloads,
}: {
  supabase: SupabaseClient;
  storage: KeyValueStorage;
  history: ReturnType<typeof createHistoryServices>;
  downloads: ReturnType<typeof createDownloadsServices>;
}) {
  const resolver = new LocalStreamResolver(async (titleId, episodeId) => {
    const items = await downloads.repository.listAll();
    const match = items.find(
      (item) =>
        item.titleId === titleId &&
        (item.episodeId ?? null) === episodeId &&
        item.status === 'completed',
    );
    return match?.fileUri ?? null;
  }, new DemoStreamResolver());

  const resume = {
    async get(titleId: string, episodeId: string | null): Promise<number> {
      const profileId = await storage.getString(storageKeys.activeProfileId);
      if (!profileId) return 0;
      const progress = await history.repository.find(profileId, titleId as never);
      if (!progress || (progress.episodeId ?? null) !== episodeId) return 0;
      return progress.positionSec;
    },
  };

  return {
    resolvePlayback: new ResolvePlayback(new FreeEntitlementGate(), resolver, resume),
    skipSegments: new SupabaseSkipSegmentRepository(supabase),
    cast: new NoopCastAdapter(),
  };
}

function createHomeServices({
  history,
  library,
}: {
  history: ReturnType<typeof createHistoryServices>;
  library: ReturnType<typeof createLibraryServices>;
}) {
  const sources: HomeSources = {
    history: {
      continueWatching: async (profileId) =>
        (await history.getContinueWatching.execute(profileId)).map((item) => ({
          titleId: item.titleId,
          progress: progressFraction(item),
        })),
      recentlyWatched: async (profileId) =>
        (await history.getWatched.execute(profileId)).map((item) => item.titleId),
    },
    library: {
      savedTitleIds: async (profileId) =>
        (await library.repository.list(profileId))
          .filter((entry) => entry.saved)
          .map((entry) => entry.titleId),
    },
  };

  return { rows: createHomeRowRegistry(), sources };
}

function createNewHotServices({
  supabase,
  notifications,
}: {
  supabase: SupabaseClient;
  notifications: NotificationScheduler;
}) {
  const repository = new SupabaseReminderRepository(supabase);
  return {
    repository,
    schedule: new ScheduleReminder(repository, notifications),
    cancel: new CancelReminder(repository, notifications),
  };
}

function createOnboardingServices({ storage }: { storage: KeyValueStorage }) {
  return {
    repository: new AsyncOnboardingRepository(storage) as OnboardingRepository,
    steps: createOnboardingStepRegistry() as Registry<OnboardingStep>,
  };
}

function createSettingsServices({ storage }: { storage: KeyValueStorage }) {
  return {
    repository: new AsyncSettingsRepository(storage),
    sections: createSettingsSectionRegistry(),
  };
}



export type AuthServices = ReturnType<typeof createAuthServices>;
export type AccountServices = ReturnType<typeof createAccountServices>;
export type ProfileServices = ReturnType<typeof createProfileServices>;
export type ParentalServices = ReturnType<typeof createParentalServices>;
export type HistoryServices = ReturnType<typeof createHistoryServices>;
export type LibraryServices = ReturnType<typeof createLibraryServices>;
export type ReviewServices = ReturnType<typeof createReviewServices>;
export type CatalogServices = ReturnType<typeof createCatalogServices> & {
  discover: DiscoverRepository;
  titles: TitleRepository;
  genres: GenreRepository;
  people: PersonRepository;
  ratingSources: RatingSource[];
};
export type SearchServices = ReturnType<typeof createSearchServices>;
export type DownloadsServices = ReturnType<typeof createDownloadsServices>;
export type PlayerServices = ReturnType<typeof createPlayerServices>;
export type HomeServices = { rows: Registry<HomeRow>; sources: HomeSources };
export type NewHotServices = ReturnType<typeof createNewHotServices>;
export type OnboardingServices = ReturnType<typeof createOnboardingServices>;
export type SettingsServices = ReturnType<typeof createSettingsServices>;

export type Services = {
  logger: Logger;
  eventBus: AppEventBus;
  analytics: AnalyticsService;
  networkMonitor: NetworkMonitor;
  storage: KeyValueStorage;
  secureStorage: SecureStorage;
  deviceInfo: DeviceInfoProvider;
  supabase: SupabaseClient;
  queryClient: QueryClient;
  notifications: NotificationScheduler;
  deepLinks: DeepLinkRegistry;
  auth: AuthServices;
  account: AccountServices;
  profiles: ProfileServices;
  parental: ParentalServices;
  onboarding: OnboardingServices;
  catalog: CatalogServices;
  home: HomeServices;
  newHot: NewHotServices;
  search: SearchServices;
  library: LibraryServices;
  reviews: ReviewServices;
  history: HistoryServices;
  downloads: DownloadsServices;
  player: PlayerServices;
  settings: SettingsServices;
};



export function createServices(): Services {
  const logger = new ConsoleLogger();
  const storage = new AsyncStorageAdapter();
  const secureStorage = new SecureStoreAdapter();
  const supabase = createSupabaseClient({ url: env.supabaseUrl, anonKey: env.supabaseAnonKey });
  const eventBus: AppEventBus = new EventBus<AppEvents>();
  const deviceInfo = new ExpoDeviceInfoProvider(secureStorage);
  const notifications = new ExpoNotificationScheduler();
  const images = new TmdbImageUrlBuilder();

  const sinks: AnalyticsSink[] = [new ConsoleSink(logger)];
  if (featureFlags.analytics) sinks.push(new SupabaseSink(supabase));

  const auth = createAuthServices({ supabase, secureStorage });
  const catalog = createCatalogServices({ logger, images });
  const history = createHistoryServices({ supabase, storage });
  const library = createLibraryServices({ supabase, eventBus });
  const downloads = createDownloadsServices({ catalog });

  return {
    logger,
    eventBus,
    analytics: new AnalyticsService(sinks, logger),
    networkMonitor,
    storage,
    secureStorage,
    deviceInfo,
    supabase,
    queryClient: createQueryClient(networkMonitor),
    notifications,
    deepLinks: new DeepLinkRegistry(),
    auth,
    account: createAccountServices({ supabase, deviceInfo, auth }),
    profiles: createProfileServices({ supabase, storage, secureStorage, eventBus }),
    parental: createParentalServices({ supabase }),
    onboarding: createOnboardingServices({ storage }),
    catalog,
    home: createHomeServices({ history, library }),
    newHot: createNewHotServices({ supabase, notifications }),
    search: createSearchServices({ storage, catalog, images }),
    library,
    reviews: createReviewServices({ supabase, eventBus }),
    history,
    downloads,
    player: createPlayerServices({ supabase, storage, history, downloads }),
    settings: createSettingsServices({ storage }),
  };
}
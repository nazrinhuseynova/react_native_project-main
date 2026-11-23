export interface TitlePrice {
  titleId: string;
  rentAmountCents: number;
  buyAmountCents: number;
  currency: string;
  availabilityDays: number;
  playbackHours: number;
}

export class PriceCatalog {
  private readonly defaultCurrency: string;
  private readonly defaultRentCents: number;
  private readonly defaultBuyCents: number;
  private readonly defaultAvailabilityDays: number;
  private readonly defaultPlaybackHours: number;
  private readonly overrides: Map<string, Partial<TitlePrice>>;

  constructor(options?: {
    defaultCurrency?: string;
    defaultRentCents?: number;
    defaultBuyCents?: number;
    defaultAvailabilityDays?: number;
    defaultPlaybackHours?: number;
    overrides?: Record<string, Partial<TitlePrice>>;
  }) {
    this.defaultCurrency = options?.defaultCurrency ?? 'AZN';
    this.defaultRentCents = options?.defaultRentCents ?? 499; 
    this.defaultBuyCents = options?.defaultBuyCents ?? 1499; 
    this.defaultAvailabilityDays = options?.defaultAvailabilityDays ?? 30;
    this.defaultPlaybackHours = options?.defaultPlaybackHours ?? 48; 
    this.overrides = new Map(Object.entries(options?.overrides ?? {}));
  }

  getPriceForTitle(titleId: string): TitlePrice {
    const custom = this.overrides.get(titleId);
    return {
      titleId,
      rentAmountCents: custom?.rentAmountCents ?? this.defaultRentCents,
      buyAmountCents: custom?.buyAmountCents ?? this.defaultBuyCents,
      currency: custom?.currency ?? this.defaultCurrency,
      availabilityDays: custom?.availabilityDays ?? this.defaultAvailabilityDays,
      playbackHours: custom?.playbackHours ?? this.defaultPlaybackHours,
    };
  }
}
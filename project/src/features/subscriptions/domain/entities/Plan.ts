import type { CurrencyCode } from '@/core/utils/formatMoney';

export type VideoQuality = '720p' | '1080p' | '4K + HDR';

export interface Plan {
  id: string;
  name: string;
  priceMinor: number;
  currency: CurrencyCode;
  quality: VideoQuality;
  maxScreens: number;
  downloadsAllowed: boolean;
  hasAds: boolean;
  isPopular?: boolean;
  sortOrder: number;
}

export const DEFAULT_PLANS: readonly Plan[] = [
  {
    id: 'free',
    name: 'Free',
    priceMinor: 0,
    currency: 'AZN',
    quality: '720p',
    maxScreens: 1,
    downloadsAllowed: false,
    hasAds: true,
    sortOrder: 0,
  },
  {
    id: 'basic',
    name: 'Basic',
    priceMinor: 799,
    currency: 'AZN',
    quality: '720p',
    maxScreens: 1,
    downloadsAllowed: true,
    hasAds: false,
    sortOrder: 1,
  },
  {
    id: 'standard',
    name: 'Standard',
    priceMinor: 1199,
    currency: 'AZN',
    quality: '1080p',
    maxScreens: 2,
    downloadsAllowed: true,
    hasAds: false,
    isPopular: true,
    sortOrder: 2,
  },
  {
    id: 'premium',
    name: 'Premium',
    priceMinor: 1599,
    currency: 'AZN',
    quality: '4K + HDR',
    maxScreens: 4,
    downloadsAllowed: true,
    hasAds: false,
    sortOrder: 3,
  },
];

export type AnalyticsEventMap = {
  screen_view: { screen: string };
  sign_up: { method: string };
  sign_in: { method: string };
  video_play: { titleId: string; episodeId?: string; positionSec?: number };
  video_pause: { titleId: string; episodeId?: string; positionSec: number };
  video_seek: { titleId: string; fromSec: number; toSec: number };
  video_buffer_start: { titleId: string; positionSec: number };
  video_complete: { titleId: string; episodeId?: string; durationSec: number };
  add_to_favorites: { titleId: string };
  remove_from_favorites: { titleId: string };
  add_to_list: { titleId: string };
  remove_from_list: { titleId: string };
  search_performed: { query: string; resultCount: number };
  rental_started: { titleId: string; rentalId?: string };
  subscription_purchased: { planId: string; amountMinor?: number; currency?: string };
};

export type AnalyticsEventName = keyof AnalyticsEventMap;
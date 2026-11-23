export type EntitlementRequest = {
  titleId: string;
  episodeId: string | null;
};

export type EntitlementSource = 'subscription' | 'rental' | 'purchase' | 'free';

export type DenyReason = 'no_access' | 'no_subscription' | 'subscription_past_due' | 'rental_expired';

export type EntitlementDecision =
  | { allowed: true; source: EntitlementSource }
  | { allowed: false; reason: DenyReason };


export interface EntitlementGate {
  check(request: EntitlementRequest): Promise<EntitlementDecision>;
}
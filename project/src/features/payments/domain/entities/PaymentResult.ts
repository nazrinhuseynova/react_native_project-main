export type PaymentDeclineReason =
  | 'insufficient_funds'
  | 'expired_card'
  | 'card_declined'
  | 'invalid_card'
  | 'network_error';

export type PaymentResult =
  | {
      status: 'success';
      transactionId: string;
      paidAt: string;
    }
  | {
      status: 'requires_3ds';
      transactionId: string;
      challengeUrl?: string;
    }
  | {
      status: 'declined';
      reason: PaymentDeclineReason;
      message: string;
    };
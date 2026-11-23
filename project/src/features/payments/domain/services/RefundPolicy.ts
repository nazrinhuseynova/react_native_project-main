import type { Invoice } from '../entities/Invoice';

export interface RefundEligibility {
  eligible: boolean;
  reason?: 'already_refunded' | 'invoice_not_paid' | 'window_expired';
  daysRemaining?: number;
}

const DEFAULT_REFUND_WINDOW_DAYS = 14;

export class RefundPolicy {
  constructor(private readonly windowDays: number = DEFAULT_REFUND_WINDOW_DAYS) {}

  evaluate(invoice: Invoice, now: Date = new Date()): RefundEligibility {
    if (invoice.status === 'refunded') {
      return { eligible: false, reason: 'already_refunded' };
    }
    if (invoice.status !== 'paid') {
      return { eligible: false, reason: 'invoice_not_paid' };
    }

    const createdMs = new Date(invoice.createdAt).getTime();
    const elapsedDays = (now.getTime() - createdMs) / (1000 * 60 * 60 * 24);
    if (elapsedDays > this.windowDays) {
      return { eligible: false, reason: 'window_expired', daysRemaining: 0 };
    }

    return {
      eligible: true,
      daysRemaining: Math.max(0, Math.ceil(this.windowDays - elapsedDays)),
    };
  }
}
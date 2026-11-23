import type { PaymentResult } from '../../domain/entities/PaymentResult';
import type {
  ChargeInput,
  PaymentGateway,
  RefundInput,
  RefundResult,
  TokenizeCardInput,
  TokenizeResult,
} from '../../domain/ports/PaymentGateway';
import { MockPaymentGateway } from './MockPaymentGateway';

export interface StripeTestGatewayConfig {
  publishableKey?: string;
  chargeEndpoint?: string;
}

export class StripeTestGateway implements PaymentGateway {
  readonly name = 'stripe_test';
  private readonly fallback = new MockPaymentGateway();

  constructor(private readonly config: StripeTestGatewayConfig = {}) {}

  async tokenize(input: TokenizeCardInput): Promise<TokenizeResult> {
    const base = await this.fallback.tokenize(input);
    return {
      ...base,
      token: `pm_card_test_${base.last4}_${Date.now()}`,
    };
  }

  async charge(input: ChargeInput): Promise<PaymentResult> {
    if (!this.config.chargeEndpoint) {
      return this.fallback.charge(input);
    }

    const response = await fetch(this.config.chargeEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: input.amount.amount,
        currency: input.amount.currency.toLowerCase(),
        paymentMethodToken: input.paymentMethod.token,
        description: input.description,
        idempotencyKey: input.idempotencyKey,
      }),
    });

    if (!response.ok) {
      return {
        status: 'declined',
        reason: 'card_declined',
        message: 'Ödəniş rədd edildi.',
      };
    }

    const data = (await response.json()) as { transactionId?: string };
    return {
      status: 'success',
      transactionId: data.transactionId ?? `pi_test_${Date.now()}`,
      paidAt: new Date().toISOString(),
    };
  }

  async refund(input: RefundInput): Promise<RefundResult> {
    return this.fallback.refund(input);
  }
}
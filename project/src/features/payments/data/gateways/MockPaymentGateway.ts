import type { CardBrand } from '../../domain/entities/PaymentMethod';
import type { PaymentResult } from '../../domain/entities/PaymentResult';
import type {
  ChargeInput,
  PaymentGateway,
  RefundInput,
  RefundResult,
  TokenizeCardInput,
  TokenizeResult,
} from '../../domain/ports/PaymentGateway';

function detectBrand(digits: string): CardBrand {
  if (digits.startsWith('4')) return 'visa';
  if (/^5[1-5]/.test(digits) || /^2[2-7]/.test(digits)) return 'mastercard';
  if (/^3[47]/.test(digits)) return 'amex';
  return 'unknown';
}

export class MockPaymentGateway implements PaymentGateway {
  readonly name = 'mock_gateway';

  async tokenize(input: TokenizeCardInput): Promise<TokenizeResult> {
    const digits = input.cardNumber.replace(/\D/g, '');
    const last4 = digits.slice(-4).padStart(4, '0');
    const brand = detectBrand(digits);

    return {
      token: `tok_mock_${brand}_${last4}_${Date.now()}`,
      brand,
      last4,
      expMonth: input.expMonth,
      expYear: input.expYear,
    };
  }

  async charge(input: ChargeInput): Promise<PaymentResult> {

    const lastDigit = input.paymentMethod.last4.slice(-1);

    if (lastDigit === '1') {
      return {
        status: 'declined',
        reason: 'insufficient_funds',
        message: 'Kartın balansı kifayət deyil.',
      };
    }

    if (lastDigit === '2') {
      return {
        status: 'declined',
        reason: 'expired_card',
        message: 'Kartın istifadə müddəti bitib.',
      };
    }

    if (lastDigit === '3') {
      return {
        status: 'requires_3ds',
        transactionId: `tx_3ds_${Date.now()}`,
        challengeUrl: 'https://example.com/3ds-challenge',
      };
    }

    return {
      status: 'success',
      transactionId: `tx_mock_${Date.now()}`,
      paidAt: new Date().toISOString(),
    };
  }

  async complete3ds(transactionId: string): Promise<PaymentResult> {
    return {
      status: 'success',
      transactionId,
      paidAt: new Date().toISOString(),
    };
  }

  async refund(input: RefundInput): Promise<RefundResult> {
    if (!input.transactionId) {
      return { refundId: '', status: 'failed', message: 'Transaction ID is missing' };
    }
    return {
      refundId: `ref_mock_${Date.now()}`,
      status: 'refunded',
    };
  }
}
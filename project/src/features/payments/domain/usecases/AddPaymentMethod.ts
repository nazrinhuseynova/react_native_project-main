import type { PaymentMethod } from '../entities/PaymentMethod';
import type { PaymentGateway, TokenizeCardInput } from '../ports/PaymentGateway';
import type { PaymentMethodRepository } from '../../repositories/PaymentMethodRepository';

export interface AddPaymentMethodCommand extends TokenizeCardInput {
  userId: string;
  setAsDefault?: boolean;
}

export class AddPaymentMethod {
  constructor(
    private readonly gateway: PaymentGateway,
    private readonly repository: PaymentMethodRepository,
  ) {}

  async execute(command: AddPaymentMethodCommand): Promise<PaymentMethod> {
    const tokenized = await this.gateway.tokenize({
      cardholderName: command.cardholderName,
      cardNumber: command.cardNumber,
      expMonth: command.expMonth,
      expYear: command.expYear,
      cvc: command.cvc,
    });

    return this.repository.add({
      userId: command.userId,
      token: tokenized.token,
      brand: tokenized.brand,
      last4: tokenized.last4,
      expMonth: tokenized.expMonth,
      expYear: tokenized.expYear,
      setAsDefault: command.setAsDefault ?? true,
    });
  }
}
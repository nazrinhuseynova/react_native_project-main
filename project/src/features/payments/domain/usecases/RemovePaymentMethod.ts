import type { PaymentMethodRepository } from '../../repositories/PaymentMethodRepository';

export interface RemovePaymentMethodCommand {
  userId: string;
  paymentMethodId: string;
}

export class RemovePaymentMethod {
  constructor(private readonly repository: PaymentMethodRepository) {}

  async execute(command: RemovePaymentMethodCommand): Promise<void> {
    await this.repository.remove(command.userId, command.paymentMethodId);
  }
}
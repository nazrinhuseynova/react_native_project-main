import type { Invoice } from '../entities/Invoice';
import type { Money } from '../entities/Money';
import type { PaymentMethod } from '../entities/PaymentMethod';
import type { PaymentResult } from '../entities/PaymentResult';
import type { PaymentGateway } from '../ports/PaymentGateway';
import type { InvoiceRepository } from '../../repositories/InvoiceRepository';

export interface ChargeCommand {
  userId: string;
  paymentMethod: PaymentMethod;
  subtotal: Money;
  description: string;
  itemKind: Invoice['itemKind'];
  itemId: string;
}

export interface ChargeOutcome {
  paymentResult: PaymentResult;
  invoice: Invoice;
}

export class Charge {
  constructor(
    private readonly gateway: PaymentGateway,
    private readonly invoiceRepo: InvoiceRepository,
  ) {}

  async execute(command: ChargeCommand): Promise<ChargeOutcome> {
    const paymentResult = await this.gateway.charge({
      amount: command.subtotal,
      paymentMethod: command.paymentMethod,
      description: command.description,
      idempotencyKey: `${command.userId}_${command.itemKind}_${command.itemId}_${Date.now()}`,
    });

    const invoiceStatus: Invoice['status'] =
      paymentResult.status === 'success'
        ? 'paid'
        : paymentResult.status === 'requires_3ds'
          ? 'pending'
          : 'failed';

    const invoice = await this.invoiceRepo.create({
      userId: command.userId,
      description: command.description,
      itemKind: command.itemKind,
      itemId: command.itemId,
      subtotalAmount: command.subtotal.amount,
      discountAmount: 0,
      totalAmount: command.subtotal.amount,
      currency: command.subtotal.currency,
      paymentMethodLast4: command.paymentMethod.last4,
      status: invoiceStatus,
    });

    return { paymentResult, invoice };
  }
}
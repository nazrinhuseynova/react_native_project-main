import type { Invoice } from '../entities/Invoice';
import type { Money } from '../entities/Money';
import type { PaymentMethod } from '../entities/PaymentMethod';
import type { PaymentResult } from '../entities/PaymentResult';
import type { PromoCode } from '../entities/PromoCode';
import type { PaymentGateway } from '../ports/PaymentGateway';
import type { InvoiceRepository } from '../../repositories/InvoiceRepository';
import type { PromoRepository } from '../../repositories/PromoRepository';
import { PricingService } from '../services/PricingService';

export interface ChargeCommand {
  userId: string;
  paymentMethod: PaymentMethod;
  subtotal: Money;
  description: string;
  itemKind: Invoice['itemKind'];
  itemId: string;
  promoCode?: PromoCode | null;
}

export interface ChargeOutcome {
  paymentResult: PaymentResult;
  invoice: Invoice;
}

export class Charge {
  constructor(
    private readonly gateway: PaymentGateway,
    private readonly invoiceRepo: InvoiceRepository,
    private readonly promoRepo: PromoRepository,
    private readonly pricingService: PricingService,
  ) {}

  async execute(command: ChargeCommand): Promise<ChargeOutcome> {
    const breakdown = this.pricingService.calculate(command.subtotal, command.promoCode);

    // 100% endirim / free trial halında kartdan 0 məbləğ çəkmədən invoys yaradırıq
    if (breakdown.total.amount <= 0) {
      if (command.promoCode) {
        await this.promoRepo.incrementRedemption(command.promoCode.id);
      }
      const invoice = await this.invoiceRepo.create({
        userId: command.userId,
        description: command.description,
        itemKind: command.itemKind,
        itemId: command.itemId,
        subtotalAmount: breakdown.subtotal.amount,
        discountAmount: breakdown.discount.amount,
        totalAmount: 0,
        currency: breakdown.total.currency,
        promoCode: command.promoCode?.code,
        paymentMethodLast4: command.paymentMethod.last4,
        status: 'paid',
      });

      return {
        paymentResult: {
          status: 'success',
          transactionId: `free_${Date.now()}`,
          paidAt: new Date().toISOString(),
        },
        invoice,
      };
    }

    const paymentResult = await this.gateway.charge({
      amount: breakdown.total,
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
      subtotalAmount: breakdown.subtotal.amount,
      discountAmount: breakdown.discount.amount,
      totalAmount: breakdown.total.amount,
      currency: breakdown.total.currency,
      promoCode: command.promoCode?.code,
      paymentMethodLast4: command.paymentMethod.last4,
      status: invoiceStatus,
    });

    if (paymentResult.status === 'success' && command.promoCode) {
      await this.promoRepo.incrementRedemption(command.promoCode.id);
    }

    return { paymentResult, invoice };
  }
}
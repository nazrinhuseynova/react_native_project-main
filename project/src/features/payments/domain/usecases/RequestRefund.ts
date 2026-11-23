import type { Invoice } from '../entities/Invoice';
import { createMoney } from '../entities/Money';
import type { PaymentGateway } from '../ports/PaymentGateway';
import type { InvoiceRepository } from '../../repositories/InvoiceRepository';
import { RefundPolicy } from '../services/RefundPolicy';

export interface RequestRefundCommand {
  invoice: Invoice;
  transactionId: string;
  reason?: string;
}

export class RequestRefund {
  constructor(
    private readonly gateway: PaymentGateway,
    private readonly invoiceRepo: InvoiceRepository,
    private readonly refundPolicy: RefundPolicy,
  ) {}

  async execute(command: RequestRefundCommand): Promise<Invoice> {
    const check = this.refundPolicy.evaluate(command.invoice);
    if (!check.eligible) {
      throw new Error(`Refund not allowed: ${check.reason ?? 'ineligible'}`);
    }

    const refundRes = await this.gateway.refund({
      transactionId: command.transactionId,
      amount: createMoney(command.invoice.totalAmount, command.invoice.currency),
      reason: command.reason,
    });

    if (refundRes.status !== 'refunded') {
      throw new Error(refundRes.message ?? 'Refund failed');
    }

    return this.invoiceRepo.updateStatus(command.invoice.id, 'refunded');
  }
}
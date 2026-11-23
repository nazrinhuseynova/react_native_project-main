import type { PaymentMethod } from '../domain/entities/PaymentMethod';

export interface CreatePaymentMethodInput {
  userId: string;
  token: string;
  brand: PaymentMethod['brand'];
  last4: string;
  expMonth: number;
  expYear: number;
  setAsDefault?: boolean;
}

export interface PaymentMethodRepository {
  listByUser(userId: string): Promise<PaymentMethod[]>;
  add(input: CreatePaymentMethodInput): Promise<PaymentMethod>;
  setDefault(userId: string, paymentMethodId: string): Promise<void>;
  remove(userId: string, paymentMethodId: string): Promise<void>;
}
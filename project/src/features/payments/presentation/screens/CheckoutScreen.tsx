import { useState } from 'react';
import { ScrollView, View } from 'react-native';

import { Screen } from '@/shared/ui/Screen';
import { AppText } from '@/shared/ui/AppText';
import { Button } from '@/shared/ui/Button';

import type { Invoice } from '../../domain/entities/Invoice';
import { createMoney, type Money } from '../../domain/entities/Money';
import type { PaymentMethod } from '../../domain/entities/PaymentMethod';
import type { InvoiceRepository } from '../../repositories/InvoiceRepository';
import type { PromoRepository } from '../../repositories/PromoRepository';
import { useCheckout } from '../../application/hooks/useCheckout';
import { usePromo } from '../../application/hooks/usePromo';
import { PaymentErrorMessage } from '../components/PaymentErrorMessage';
import { PromoInput } from '../components/PromoInput';

export interface CheckoutScreenProps {
  userId: string;
  selectedMethod: PaymentMethod | null;
  subtotal: Money;
  description: string;
  itemKind: Invoice['itemKind'];
  itemId: string;
  invoiceRepo: InvoiceRepository;
  promoRepo: PromoRepository;
  onSuccess?: () => void;
}

export function CheckoutScreen({
  userId,
  selectedMethod,
  subtotal,
  description,
  itemKind,
  itemId,
  invoiceRepo,
  promoRepo,
  onSuccess,
}: CheckoutScreenProps) {
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const promo = usePromo(promoRepo);
  const checkout = useCheckout({
    userId,
    invoiceRepo,
    promoRepo,
  });

  const finalAmount = promo.breakdown?.total ?? subtotal;
  const discountAmount = promo.breakdown?.discount ?? createMoney(0, subtotal.currency);

  const handlePay = async () => {
    setStatusMessage(null);
    if (!selectedMethod) {
      setStatusMessage('Ödəniş üçün kart seçin.');
      return;
    }

    const outcome = await checkout.checkout({
      paymentMethod: selectedMethod,
      subtotal,
      description,
      itemKind,
      itemId,
      promoCode: promo.appliedPromo,
    });

    if (outcome.paymentResult.status === 'success') {
      setStatusMessage('Ödəniş uğurla tamamlandı!');
      onSuccess?.();
    } else if (outcome.paymentResult.status === 'requires_3ds') {
      setStatusMessage('3D Secure doğrulaması tələb olunur.');
    } else {
      setStatusMessage(outcome.paymentResult.message);
    }
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
        <AppText variant="title2">Ödəniş</AppText>
        <AppText variant="callout" color="textSecondary">
          {description}
        </AppText>

        <PromoInput
          appliedCode={promo.appliedPromo?.code}
          isApplying={promo.isApplying}
          error={promo.error}
          onApply={(code) => promo.applyPromo({ code, subtotal }).then(() => undefined)}
          onClear={promo.clearPromo}
        />

        <View style={{ gap: 6 }}>
          <AppText variant="body">
            İlkin məbləğ: {(subtotal.amount / 100).toFixed(2)} {subtotal.currency}
          </AppText>
          <AppText variant="body" color="textSecondary">
            Endirim: -{(discountAmount.amount / 100).toFixed(2)} {discountAmount.currency}
          </AppText>
          <AppText variant="title3">
            Yekun məbləğ: {(finalAmount.amount / 100).toFixed(2)} {finalAmount.currency}
          </AppText>
        </View>

        <PaymentErrorMessage message={checkout.error ?? statusMessage} />

      <Button
  label={`Ödə (${(finalAmount.amount / 100).toFixed(2)} ${finalAmount.currency})`}
  loading={checkout.isLoading}
  disabled={checkout.isLoading || !selectedMethod}
  onPress={handlePay}
/>
      </ScrollView>
    </Screen>
  );
}
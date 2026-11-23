import { View } from 'react-native';

import { AppText } from '@/shared/ui/AppText';
import { BottomSheet } from '@/shared/ui/BottomSheet';
import { Button } from '@/shared/ui/Button';

import type { TitlePrice } from '../../domain/policies/PriceCatalog';

export interface RentBuySheetProps {
  visible: boolean;
  onClose: () => void;
  titleName: string;
  price: TitlePrice;
  onRent: () => Promise<void> | void;
  onBuy: () => Promise<void> | void;
  isSubmitting?: boolean;
}

export function RentBuySheet({
  visible,
  onClose,
  titleName,
  price,
  onRent,
  onBuy,
  isSubmitting = false,
}: RentBuySheetProps) {
  const rentPriceText = `${(price.rentAmountCents / 100).toFixed(2)} ${price.currency}`;
  const buyPriceText = `${(price.buyAmountCents / 100).toFixed(2)} ${price.currency}`;

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <View style={{ padding: 16, gap: 12 }}>
        <AppText variant="title2">{titleName}</AppText>
        <AppText variant="body">
          Kirayə: {price.availabilityDays} gün ərzində başla, ilk Play-dən{' '}
          {price.playbackHours} saat izlə[cite: 1, 2].
        </AppText>

        <Button
          label={`Kirayə et — ${rentPriceText}`}
          disabled={isSubmitting}
          loading={isSubmitting}
          onPress={onRent}
        />

        <Button
          label={`Satın al — ${buyPriceText}`}
          variant="secondary"
          disabled={isSubmitting}
          loading={isSubmitting}
          onPress={onBuy}
        />
      </View>
    </BottomSheet>
  );
}
import { useMemo, useState } from 'react';
import { View } from 'react-native';

import { Screen } from '@/shared/ui/Screen';
import { AppText } from '@/shared/ui/AppText';
import { Button } from '@/shared/ui/Button';

import { PriceCatalog } from '../../domain/policies/PriceCatalog';
import type { PurchaseRepository } from '../../domain/repositories/PurchaseRepository';
import type { RentalRepository } from '../../domain/repositories/RentalRepository';
import { useBuy } from '../../application/hooks/useBuy';
import { useRent } from '../../application/hooks/useRent';
import { useRentalStatus } from '../../application/hooks/useRentalStatus';
import { RentBuySheet } from '../components/RentBuySheet';
import { RentalBadge } from '../components/RentalBadge';
import { RentalCountdown } from '../components/RentalCountdown';

export interface RentScreenProps {
  userId: string;
  titleId: string;
  titleName?: string;
  rentalRepository: RentalRepository;
  purchaseRepository: PurchaseRepository;
  priceCatalog?: PriceCatalog;
  onWatchNow?: (titleId: string) => void;
}

export function RentScreen({
  userId,
  titleId,
  titleName = 'Seçilmiş məzmun',
  rentalRepository,
  purchaseRepository,
  priceCatalog = new PriceCatalog(),
  onWatchNow,
}: RentScreenProps) {
  const [sheetVisible, setSheetVisible] = useState(false);

  const price = useMemo(
    () => priceCatalog.getPriceForTitle(titleId),
    [priceCatalog, titleId],
  );

  const {
    status,
    canWatch,
    hasPermanentPurchase,
    rental,
    evaluation,
    refresh,
  } = useRentalStatus({
    userId,
    titleId,
    rentalRepository,
    purchaseRepository,
  });

  const { rentTitle, isRenting, error: rentError } = useRent({
    userId,
    rentalRepository,
    priceCatalog,
    onSuccess: async () => {
      setSheetVisible(false);
      await refresh();
    },
  });

  const { buyTitle, isBuying, error: buyError } = useBuy({
    userId,
    purchaseRepository,
    priceCatalog,
    onSuccess: async () => {
      setSheetVisible(false);
      await refresh();
    },
  });

  const activeError = rentError ?? buyError;
  const badgeStatus = hasPermanentPurchase
    ? 'purchased'
    : (evaluation?.status ?? null);

  return (
    <Screen>
      <View style={{ flex: 1, padding: 16, gap: 16 }}>
        <AppText variant="title2">{titleName}</AppText>

        {badgeStatus ? <RentalBadge status={badgeStatus} /> : null}
        <RentalCountdown rental={rental} />

        {activeError ? (
          <AppText variant="caption">{activeError}</AppText>
        ) : null}

        {canWatch ? (
          <Button
            label="İndi izlə"
            onPress={() => onWatchNow?.(titleId)}
          />
        ) : (
          <Button
            label="Kirayə və ya satın al"
            onPress={() => setSheetVisible(true)}
          />
        )}

        <RentBuySheet
          visible={sheetVisible}
          onClose={() => setSheetVisible(false)}
          titleName={titleName}
          price={price}
          isSubmitting={isRenting || isBuying}
          onRent={async () => {
            await rentTitle(titleId, titleName);
          }}
          onBuy={async () => {
            await buyTitle(titleId, titleName);
          }}
        />

        {status ? (
          <AppText variant="caption">
            Status: {hasPermanentPurchase ? 'Daimi giriş' : canWatch ? 'Aktiv' : 'Kilidli'}
          </AppText>
        ) : null}
      </View>
    </Screen>
  );
}
import { View } from 'react-native';

import { AppText } from '@/shared/ui/AppText';
import { Badge } from '@/shared/ui/Badge';

import type { RentalStatus } from '../../domain/entities/Rental';

export interface RentalBadgeProps {
  status: RentalStatus | 'purchased';
}

const STATUS_LABELS: Record<RentalStatus | 'purchased', string> = {
  purchased: 'Satın alınıb',
  unstarted: '30 gün ərzində başlat',
  active: '48 saat aktivdir',
  expired: 'Müddəti bitib',
};

export function RentalBadge({ status }: RentalBadgeProps) {
  return (
    <View>
      <Badge label={STATUS_LABELS[status]} />
      <AppText variant="caption">{STATUS_LABELS[status]}</AppText>
    </View>
  );
}
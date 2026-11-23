import { View } from 'react-native';

import { AppText } from '@/shared/ui/AppText';

import type { Rental } from '../../domain/entities/Rental';
import { useRentalCountdown } from '../../application/hooks/useRentalCountdown';

export interface RentalCountdownProps {
  rental: Rental | null;
}

export function RentalCountdown({ rental }: RentalCountdownProps) {
  const { evaluation, formattedRemaining, isExpired } =
    useRentalCountdown(rental);

  if (!rental || !evaluation) {
    return null;
  }

  const label = isExpired
    ? 'İzləmə müddəti başa çatıb'
    : evaluation.reason === 'awaiting_first_play'
      ? `Başlamağa qalan vaxt: ${formattedRemaining}`
      : `İzləməyə qalan vaxt: ${formattedRemaining}`;

  return (
    <View style={{ paddingVertical: 4 }}>
      <AppText variant="caption">{label}</AppText>
    </View>
  );
}
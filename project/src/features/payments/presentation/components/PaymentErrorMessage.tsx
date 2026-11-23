import { View } from 'react-native';

import { useTheme } from '@/shared/theme/useTheme';
import { AppText } from '@/shared/ui/AppText';
import type { PaymentDeclineReason } from '../../domain/entities/PaymentResult';

export interface PaymentErrorMessageProps {
  message?: string | null;
  reason?: PaymentDeclineReason;
}

const REASON_MESSAGES: Record<PaymentDeclineReason, string> = {
  insufficient_funds: 'Kartın balansı kifayət deyil. Başqa kart yoxlayın və ya balans artırın.',
  expired_card: 'Kartın istifadə müddəti bitib. Zəhmət olmasa yeni kart əlavə edin.',
  card_declined: 'Ödəniş bank tərəfindən rədd edildi.',
  invalid_card: 'Kart məlumatları düzgün deyil.',
  network_error: 'Şəbəkə xətası baş verdi. İnternet bağlantısını yoxlayın.',
};

export function PaymentErrorMessage({ message, reason }: PaymentErrorMessageProps) {
  const { colors, radius, spacing } = useTheme();
  const text = message || (reason ? REASON_MESSAGES[reason] : null);

  if (!text) return null;

  return (
    <View
      accessibilityLiveRegion="polite"
      style={{
        backgroundColor: colors.card,
        borderColor: colors.danger,
        borderWidth: 1,
        borderRadius: radius.md,
        padding: spacing.md,
      }}
    >
      <AppText variant="captionStrong" color="danger">
        {text}
      </AppText>
    </View>
  );
}
import { Pressable, View } from 'react-native';

import { useTheme } from '@/shared/theme/useTheme';
import { AppText } from '@/shared/ui/AppText';
import { Badge } from '@/shared/ui/Badge';

import type { Invoice } from '../../domain/entities/Invoice';

export interface InvoiceRowProps {
  invoice: Invoice;
  onPress?: (invoice: Invoice) => void;
}

function formatAmount(cents: number, currency: Invoice['currency']): string {
  return `${(cents / 100).toFixed(2)} ${currency}`;
}

export function InvoiceRow({ invoice, onPress }: InvoiceRowProps) {
  const { colors, radius, spacing } = useTheme();

  return (
    <Pressable
      onPress={() => onPress?.(invoice)}
      style={{
        backgroundColor: colors.card,
        borderRadius: radius.md,
        padding: spacing.md,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: spacing.md,
      }}
    >
      <View style={{ flex: 1, gap: 4 }}>
        <AppText variant="bodyStrong">{invoice.description}</AppText>
        <AppText variant="caption" color="textMuted">
          {new Date(invoice.createdAt).toLocaleDateString()}
          {invoice.paymentMethodLast4 ? ` • •••• ${invoice.paymentMethodLast4}` : ''}
          {invoice.promoCode ? ` • ${invoice.promoCode}` : ''}
        </AppText>
      </View>

      <View style={{ alignItems: 'flex-end', gap: 6 }}>
        <AppText variant="bodyStrong">
          {formatAmount(invoice.totalAmount, invoice.currency)}
        </AppText>
        <Badge label={invoice.status.toUpperCase()} />
      </View>
    </Pressable>
  );
}
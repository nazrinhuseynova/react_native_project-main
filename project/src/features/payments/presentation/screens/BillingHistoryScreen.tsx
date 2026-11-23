import { FlatList } from 'react-native';

import { Screen } from '@/shared/ui/Screen';
import { AppText } from '@/shared/ui/AppText';
import { EmptyState } from '@/shared/ui/EmptyState';

import type { InvoiceRepository } from '../../repositories/InvoiceRepository';
import { useInvoices } from '../../application/hooks/useInvoices';
import { InvoiceRow } from '../components/InvoiceRow';
import { PaymentErrorMessage } from '../components/PaymentErrorMessage';

export interface BillingHistoryScreenProps {
  userId: string;
  repository: InvoiceRepository;
}

export function BillingHistoryScreen({ userId, repository }: BillingHistoryScreenProps) {
  const { invoices, isLoading, isRefetching, error, refetch } = useInvoices({
    userId,
    repository,
  });

  return (
    <Screen>
      <FlatList
        data={invoices}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, gap: 12 }}
        refreshing={isRefetching}
        onRefresh={refetch}
        ListHeaderComponent={<AppText variant="title2">Ödəniş tarixçəsi</AppText>}
        ListEmptyComponent={() =>
          !isLoading ? (
            <EmptyState
              title="İnvoyis yoxdur"
              message="Hələ heç bir ödəniş və ya abunəlik qəbzi yaranmayıb."
            />
          ) : null
        }
        renderItem={({ item }) => <InvoiceRow invoice={item} />}
        ListFooterComponent={<PaymentErrorMessage message={error} />}
      />
    </Screen>
  );
}
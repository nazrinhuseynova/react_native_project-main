import { FlatList, View } from 'react-native';

import { Screen } from '@/shared/ui/Screen';
import { AppText } from '@/shared/ui/AppText';
import { Button } from '@/shared/ui/Button';
import { EmptyState } from '@/shared/ui/EmptyState';

import type { PaymentMethodRepository } from '../../repositories/PaymentMethodRepository';
import { usePaymentMethods } from '../../application/hooks/usePaymentMethods';
import { CardForm } from '../components/CardForm';
import { PaymentErrorMessage } from '../components/PaymentErrorMessage';

export interface PaymentMethodsScreenProps {
  userId: string;
  repository: PaymentMethodRepository;
}

export function PaymentMethodsScreen({ userId, repository }: PaymentMethodsScreenProps) {
  const {
    paymentMethods,
    isLoading,
    error,
    addCard,
    isAdding,
    removeCard,
    setDefaultCard,
  } = usePaymentMethods({ userId, repository });

  return (
    <Screen>
      <View style={{ flex: 1, padding: 16, gap: 16 }}>
        <AppText variant="title2">Ödəniş üsulları</AppText>

        <PaymentErrorMessage message={error} />

        <CardForm
          onSubmit={async (values) => {
            await addCard(values);
          }}
          isSubmitting={isAdding}
        />

        <FlatList
          data={paymentMethods}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={() =>
            !isLoading ? (
              <EmptyState
                title="Kart əlavə edilməyib"
                message="Ödəniş etmək üçün yuxarıdakı formadan kart əlavə edin."
              />
            ) : null
          }
          renderItem={({ item }) => (
            <View
              style={{
                paddingVertical: 12,
                borderBottomWidth: 1,
                borderBottomColor: '#2a2a2a',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 8,
              }}
            >
              <View>
                <AppText variant="bodyStrong">
                  {item.brand.toUpperCase()} •••• {item.last4}
                </AppText>
                <AppText variant="caption" color="textMuted">
                  Bitmə: {String(item.expMonth).padStart(2, '0')}/{item.expYear}
                  {item.isDefault ? ' • Əsas' : ''}
                </AppText>
              </View>

              <View style={{ flexDirection: 'row', gap: 8 }}>
                {!item.isDefault ? (
                  <Button
                    label="Əsas et"
                    variant="secondary"
                    onPress={() => setDefaultCard(item.id)}
                  />
                ) : null}
                <Button
                  label="Sil"
                  variant="secondary"
                  onPress={() => removeCard(item.id)}
                />
              </View>
            </View>
          )}
        />
      </View>
    </Screen>
  );
}
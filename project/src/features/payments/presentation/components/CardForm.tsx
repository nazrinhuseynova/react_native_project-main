import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { View } from 'react-native';

import { Button } from '@/shared/ui/Button';
import { Checkbox } from '@/shared/ui/Checkbox';
import { TextField } from '@/shared/ui/TextField';

import { cardSchema, type CardFormValues } from '../../application/schemas/cardSchema';

export interface CardFormProps {
  onSubmit: (values: CardFormValues) => Promise<void> | void;
  isSubmitting?: boolean;
  submitLabel?: string;
}

export function CardForm({
  onSubmit,
  isSubmitting = false,
  submitLabel = 'Kartı yadda saxla',
}: CardFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CardFormValues>({
    resolver: zodResolver(cardSchema) as never,
    defaultValues: {
      cardholderName: '',
      cardNumber: '',
      expMonth: 12,
      expYear: 2028,
      cvc: '',
      setAsDefault: true,
    },
  });

  return (
    <View style={{ gap: 12 }}>
      <Controller
        control={control}
        name="cardholderName"
        render={({ field }) => (
          <TextField
            label="Kart sahibinin adı"
            placeholder="Ad Soyad"
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            error={errors.cardholderName?.message ?? null}
            autoCapitalize="words"
          />
        )}
      />

      <Controller
        control={control}
        name="cardNumber"
        render={({ field }) => (
          <TextField
            label="Kart nömrəsi"
            placeholder="4111 •••• •••• 1111"
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            error={errors.cardNumber?.message ?? null}
            keyboardType="number-pad"
          />
        )}
      />

      <View style={{ flexDirection: 'row', gap: 12 }}>
        <Controller
          control={control}
          name="expMonth"
          render={({ field }) => (
            <TextField
              containerStyle={{ flex: 1 }}
              label="Ay"
              placeholder="MM"
              value={String(field.value ?? '')}
              onChangeText={(text) => field.onChange(text.replace(/\D/g, ''))}
              onBlur={field.onBlur}
              error={errors.expMonth?.message ?? null}
              keyboardType="number-pad"
              maxLength={2}
            />
          )}
        />

        <Controller
          control={control}
          name="expYear"
          render={({ field }) => (
            <TextField
              containerStyle={{ flex: 1 }}
              label="İl"
              placeholder="YYYY"
              value={String(field.value ?? '')}
              onChangeText={(text) => field.onChange(text.replace(/\D/g, ''))}
              onBlur={field.onBlur}
              error={errors.expYear?.message ?? null}
              keyboardType="number-pad"
              maxLength={4}
            />
          )}
        />

        <Controller
          control={control}
          name="cvc"
          render={({ field }) => (
            <TextField
              containerStyle={{ flex: 1 }}
              label="CVC"
              placeholder="123"
              value={field.value}
              onChangeText={(text) => field.onChange(text.replace(/\D/g, ''))}
              onBlur={field.onBlur}
              error={errors.cvc?.message ?? null}
              keyboardType="number-pad"
              maxLength={4}
              secureTextEntry
            />
          )}
        />
      </View>

      <Controller
        control={control}
        name="setAsDefault"
        render={({ field }) => (
          <Checkbox
            checked={Boolean(field.value)}
            onChange={field.onChange}
            label="Əsas ödəniş üsulu kimi təyin et"
          />
        )}
      />

     <Button
        label={submitLabel}
        loading={isSubmitting}
        disabled={isSubmitting}
        onPress={handleSubmit((values) => onSubmit(values as CardFormValues))}
      />
    </View>
  );
}
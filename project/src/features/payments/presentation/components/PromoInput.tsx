import { useState } from 'react';
import { View } from 'react-native';

import { Button } from '@/shared/ui/Button';
import { TextField } from '@/shared/ui/TextField';

export interface PromoInputProps {
  appliedCode?: string | null;
  onApply: (code: string) => Promise<void> | void;
  onClear?: () => void;
  isApplying?: boolean;
  error?: string | null;
}

export function PromoInput({
  appliedCode,
  onApply,
  onClear,
  isApplying = false,
  error = null,
}: PromoInputProps) {
  const [code, setCode] = useState(appliedCode ?? '');

  return (
    <View style={{ gap: 8 }}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 8 }}>
        <TextField
          containerStyle={{ flex: 1 }}
          label="Promo kod"
          placeholder="Məs: CINE20"
          value={code}
          onChangeText={(val) => setCode(val.toUpperCase())}
          error={error}
          autoCapitalize="characters"
        />
        {appliedCode ? (
          <Button
            label="Sil"
            variant="secondary"
            onPress={() => {
              setCode('');
              onClear?.();
            }}
          />
        ) : (
          <Button
            label="Tətbiq et"
            loading={isApplying}
            disabled={isApplying || !code.trim()}
            onPress={() => onApply(code.trim())}
          />
        )}
      </View>
    </View>
  );
}
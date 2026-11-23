import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { useTheme } from '@/shared/theme/useTheme';
import { AppText } from '@/shared/ui/AppText';
import { BottomSheet } from '@/shared/ui/BottomSheet';
import { Button } from '@/shared/ui/Button';
import { PinPad } from '@/shared/ui/PinPad';

type Step = 'enter' | 'confirm';

type PinSetupSheetProps = {
  visible: boolean;
  hasPin: boolean;
  onClose: () => void;
  onSubmit: (pin: string) => Promise<void>;
  onRemove: () => Promise<void>;
};

export function PinSetupSheet({ visible, hasPin, onClose, onSubmit, onRemove }: PinSetupSheetProps) {
  const { t } = useTranslation();
  const { spacing } = useTheme();

  const [step, setStep] = useState<Step>('enter');
  const [pin, setPin] = useState('');
  const [firstPin, setFirstPin] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const busyRef = useRef(false);

  useEffect(() => {
    if (!visible) {
      setStep('enter');
      setPin('');
      setFirstPin('');
      setError(null);
    }
  }, [visible]);

  const handleComplete = useCallback(
    async (value: string) => {
      if (busyRef.current) return;

      if (step === 'enter') {
        setFirstPin(value);
        setPin('');
        setStep('confirm');
        setError(null);
        return;
      }

      if (value !== firstPin) {
        setError(t('profiles.pin.mismatch'));
        setPin('');
        setFirstPin('');
        setStep('enter');
        return;
      }

      busyRef.current = true;
      setBusy(true);
      try {
        await onSubmit(value);
        onClose();
      } catch {
        setError(t('errors.unknown'));
        setPin('');
      } finally {
        busyRef.current = false;
        setBusy(false);
      }
    },
    [step, firstPin, onSubmit, onClose, t],
  );

  const handleRemove = async () => {
    setBusy(true);
    try {
      await onRemove();
      onClose();
    } catch {
      setError(t('errors.unknown'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <BottomSheet visible={visible} onClose={onClose} title={t('profiles.pin.setupTitle')}>
      <AppText variant="callout" color="textSecondary" align="center" style={{ marginBottom: spacing.lg }}>
        {step === 'enter' ? t('profiles.pin.setupEnter') : t('profiles.pin.setupConfirm')}
      </AppText>

      <PinPad
        value={pin}
        onChange={setPin}
        onComplete={handleComplete}
        error={error}
        disabled={busy}
      />

      {hasPin ? (
        <View style={{ marginTop: spacing.lg }}>
          <Button
            label={t('profiles.pin.remove')}
            variant="ghost"
            disabled={busy}
            onPress={handleRemove}
          />
        </View>
      ) : null}
    </BottomSheet>
  );
}
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useResendTimer } from '../../application/hooks/useResendTimer';
import { AuthLink } from './AuthForm';

type ResendCodeButtonProps = {
  onResend: () => Promise<unknown>;
};

export function ResendCodeButton({ onResend }: ResendCodeButtonProps) {
  const { t } = useTranslation();
  const { secondsLeft, canResend, restart } = useResendTimer();
  const [busy, setBusy] = useState(false);

  const handlePress = async () => {
    setBusy(true);
    try {
      await onResend();
      restart();
    } catch {
    } finally {
      setBusy(false);
    }
  };

  const label = canResend
    ? t('auth.resend.action')
    : t('auth.resend.wait', { seconds: secondsLeft });

  return <AuthLink label={label} onPress={handlePress} disabled={!canResend || busy} />;
}
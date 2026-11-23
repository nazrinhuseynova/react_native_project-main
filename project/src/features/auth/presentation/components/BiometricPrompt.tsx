import { useTranslation } from 'react-i18next';

import { AuthButton } from './AuthForm';

type BiometricPromptProps = {
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
};

export function BiometricPrompt({ onPress, loading = false, disabled = false }: BiometricPromptProps) {
  const { t } = useTranslation();

  return (
    <AuthButton
      variant="secondary"
      label={t('auth.biometric.action')}
      onPress={onPress}
      loading={loading}
      disabled={disabled}
    />
  );
}
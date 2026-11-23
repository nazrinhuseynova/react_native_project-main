import { useTranslation } from 'react-i18next';

import { SwitchRow } from '@/shared/ui/SwitchRow';

type KidsToggleProps = {
  value: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
};

export function KidsToggle({ value, onChange, disabled = false }: KidsToggleProps) {
  const { t } = useTranslation();
  return (
    <SwitchRow
      label={t('profiles.kids.label')}
      description={t('profiles.kids.description')}
      value={value}
      onValueChange={onChange}
      disabled={disabled}
    />
  );
}
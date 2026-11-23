import { useTranslation } from 'react-i18next';

import { ConfirmDialog } from '@/shared/ui/ConfirmDialog';

type ClearHistoryDialogProps = {
  visible: boolean;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ClearHistoryDialog({ visible, loading = false, onConfirm, onCancel }: ClearHistoryDialogProps) {
  const { t } = useTranslation();

  return (
    <ConfirmDialog
      visible={visible}
      destructive
      loading={loading}
      title={t('history.clearDialog.title')}
      message={t('history.clearDialog.message')}
      confirmLabel={t('history.clearDialog.confirm')}
      cancelLabel={t('history.clearDialog.cancel')}
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  );
}
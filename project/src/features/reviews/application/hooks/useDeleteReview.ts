import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { useServices } from '@/bootstrap/useServices';
import { useToast } from '@/shared/ui/ToastProvider';

import { toErrorKey } from '../errorKey';
import { reviewKeys } from '../reviewKeys';

export function useDeleteReview() {
  const { reviews } = useServices();
  const queryClient = useQueryClient();
  const toast = useToast();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (reviewId: string) => reviews.remove.execute(reviewId),
    onSuccess: () => toast.success(t('reviews.deleted')),
    onError: (error) => toast.error(t(toErrorKey(error))),
    onSettled: () => queryClient.invalidateQueries({ queryKey: reviewKeys.all }),
  });
}
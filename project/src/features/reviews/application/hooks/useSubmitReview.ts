import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { useServices } from '@/bootstrap/useServices';
import { AppError } from '@/core/errors/AppError';
import { useAuth } from '@/features/auth';
import type { TitleId } from '@/features/catalog';
import { useActiveProfile } from '@/features/profiles';
import { useToast } from '@/shared/ui/ToastProvider';

import { toErrorKey } from '../errorKey';
import { reviewKeys } from '../reviewKeys';
import { useMyReview } from './useMyReview';

export type ReviewValues = { stars: number; text: string };

/** Mövcud rəy varsa PUT (edit), yoxdursa POST (add). */
export function useSubmitReview(titleId: TitleId) {
  const { reviews } = useServices();
  const { session } = useAuth();
  const { activeProfile } = useActiveProfile();
  const { review: mine } = useMyReview(titleId);
  const queryClient = useQueryClient();
  const toast = useToast();
  const { t } = useTranslation();

  const userId = session?.user.id ?? null;

  return useMutation({
    mutationFn: async (values: ReviewValues) => {
      if (!userId) {
        throw new AppError('No session', { code: 'AUTH', userMessageKey: 'errors.unknown' });
      }
      if (mine) return reviews.edit.execute(mine.id, titleId, values);
      return reviews.add.execute({
        userId,
        titleId,
        authorName: activeProfile?.name ?? '',
        ...values,
      });
    },
    onSuccess: () => toast.success(t('reviews.saved')),
    onError: (error) => toast.error(t(toErrorKey(error))),
    onSettled: () => queryClient.invalidateQueries({ queryKey: reviewKeys.all }),
  });
}
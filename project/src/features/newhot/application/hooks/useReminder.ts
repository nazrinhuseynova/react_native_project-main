import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { useServices } from '@/bootstrap/useServices';
import { ValidationError } from '@/core/errors/ValidationError';
import { toUserMessage } from '@/core/errors/toUserMessage';
import { buildTitleShareUrl } from '@/core/linking/buildShareUrl';
import { useAuth } from '@/features/auth';
import { parseTitleId } from '@/features/catalog';
import { useToast } from '@/shared/ui/ToastProvider';

import { computeRemindAt, type ReminderTarget } from '../../domain/entities/Reminder';
import { newHotKeys } from '../newHotKeys';

function toErrorKey(error: unknown): string {
  if (error instanceof ValidationError) {
    const first = Object.values(error.fields)[0];
    if (first) return first;
  }
  return toUserMessage(error);
}

export function useReminder(target: ReminderTarget) {
  const { newHot } = useServices();
  const { session } = useAuth();
  const { t } = useTranslation();
  const toast = useToast();
  const queryClient = useQueryClient();

  const userId = session?.user.id ?? null;
  const key = newHotKeys.reminders(userId);

  const reminders = useQuery({
    queryKey: key,
    queryFn: () => newHot.repository.list(),
    enabled: userId !== null,
  });

  const isReminded = reminders.data?.some((reminder) => reminder.titleId === target.titleId) ?? false;

  const mutation = useMutation({
    mutationFn: async (next: boolean) => {
      if (!next) {
        await newHot.cancel.execute(target.titleId);
        return;
      }
      const parsed = parseTitleId(target.titleId);
      await newHot.schedule.execute(target, {
        title: t('newhot.notification.title', { title: target.titleName }),
        body: t('newhot.notification.body'),
        url: parsed ? buildTitleShareUrl(parsed.tmdbId, parsed.kind) : '',
      });
    },
    onSuccess: (_, next) => {
      if (next) toast.success(t('newhot.reminderSet'));
    },
    onError: (error) => toast.error(t(toErrorKey(error))),
    onSettled: () => queryClient.invalidateQueries({ queryKey: key }),
  });

  const { mutate } = mutation;
  const toggle = useCallback(() => mutate(!isReminded), [mutate, isReminded]);

  const canRemind = useMemo(() => computeRemindAt(target.releaseDate) !== null, [target.releaseDate]);

  return { isReminded, isPending: mutation.isPending, toggle, canRemind };
}
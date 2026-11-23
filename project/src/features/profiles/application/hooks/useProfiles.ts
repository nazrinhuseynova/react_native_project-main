import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useServices } from '@/bootstrap/useServices';
import { ValidationError } from '@/core/errors/ValidationError';
import { toUserMessage } from '@/core/errors/toUserMessage';
import { useAuth } from '@/features/auth';

import type { CreateProfileInput, Profile, ProfilePatch } from '../../domain/entities/Profile';
import { profileKeys } from '../profileKeys';

const EMPTY: Profile[] = [];

export function toProfileErrorKey(error: unknown): string {
  if (error instanceof ValidationError) {
    const first = Object.values(error.fields)[0];
    if (first) return first;
  }
  return toUserMessage(error);
}

export function useProfiles() {
  const { profiles: service } = useServices();
  const { session } = useAuth();
  const queryClient = useQueryClient();
  const userId = session?.user.id ?? null;

  const query = useQuery({
    queryKey: profileKeys.list(userId),
    queryFn: () => service.repository.list(),
    enabled: userId !== null,
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: profileKeys.all });

  const create = useMutation({
    mutationFn: (input: CreateProfileInput) => service.create.execute(input),
    onSuccess: invalidate,
  });

  const update = useMutation({
    mutationFn: (input: { id: string; patch: ProfilePatch }) =>
      service.update.execute(input.id, input.patch),
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: (id: string) => service.remove.execute(id),
    onSuccess: invalidate,
  });

  const setPin = useMutation({
    mutationFn: (input: { id: string; pin: string | null }) =>
      service.setPin.execute(input.id, input.pin),
    onSuccess: invalidate,
  });

  const profiles = query.data ?? EMPTY;

  return {
    profiles,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
    maxProfiles: service.policies.limit.max,
    canCreate: service.policies.limit.canCreate(profiles.length),
    createProfile: create.mutateAsync,
    updateProfile: update.mutateAsync,
    deleteProfile: remove.mutateAsync,
    setProfilePin: setPin.mutateAsync,
    isSaving: create.isPending || update.isPending || remove.isPending || setPin.isPending,
  };
}
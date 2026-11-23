import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useServices } from '@/bootstrap/useServices';
import { toUserMessage } from '@/core/errors/toUserMessage';
import { useAuth } from '@/features/auth';

import { accountKeys } from '../accountKeys';

export function useDevices() {
  const { account } = useServices();
  const { signOutAllDevices } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: accountKeys.devices,
    queryFn: () => account.listDevices.execute(),
  });

  const revoke = useMutation({
    mutationFn: (deviceId: string) => account.revokeDevice.execute(deviceId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: accountKeys.devices }),
  });

  const signOutAll = useMutation({ mutationFn: () => signOutAllDevices() });

  return {
    devices: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,

    revokeDevice: revoke.mutateAsync,
    isRevoking: revoke.isPending,
    revokeErrorKey: revoke.error ? toUserMessage(revoke.error) : null,

    signOutAllDevices: signOutAll.mutateAsync,
    isSigningOutAll: signOutAll.isPending,
  };
}
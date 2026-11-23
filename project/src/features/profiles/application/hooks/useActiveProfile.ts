import { useContext } from 'react';

import { ProfileContext, type ProfileContextValue } from '../ProfileProvider';

export function useActiveProfile(): ProfileContextValue {
  const value = useContext(ProfileContext);
  if (!value) {
    throw new Error('useActiveProfile must be used inside <ProfileProvider>');
  }
  return value;
}
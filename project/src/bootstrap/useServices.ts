import { useContext } from 'react';

import type { Services } from './container';
import { ServicesContext } from './ServicesProvider';

export function useServices(): Services {
  const services = useContext(ServicesContext);
  if (!services) {
    throw new Error('useServices must be used inside <ServicesProvider>');
  }
  return services;
}
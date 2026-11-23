import { createContext, type PropsWithChildren } from 'react';

import type { Services } from './container';

export const ServicesContext = createContext<Services | null>(null);

type ServicesProviderProps = PropsWithChildren<{ services: Services }>;

export function ServicesProvider({ services, children }: ServicesProviderProps) {
  return <ServicesContext.Provider value={services}>{children}</ServicesContext.Provider>;
}
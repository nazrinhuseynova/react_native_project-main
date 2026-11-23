import * as Linking from 'expo-linking';
import { useEffect } from 'react';

import type { DeepLinkRegistry, DeepLinkTarget } from './DeepLinkRegistry';

export function useDeepLinks(
  registry: DeepLinkRegistry,
  onNavigate: (target: DeepLinkTarget) => void,
): void {
  useEffect(() => {
    let active = true;

    const handle = (url: string) => {
      if (!active) return;
      const match = registry.resolve(url);
      if (!match || match.route.handledByRouter) return;
      onNavigate(match.target);
    };

    Linking.getInitialURL()
      .then((url) => {
        if (url) handle(url);
      })
      .catch(() => undefined);

    const subscription = Linking.addEventListener('url', ({ url }) => handle(url));

    return () => {
      active = false;
      subscription.remove();
    };
  }, [registry, onNavigate]);
}
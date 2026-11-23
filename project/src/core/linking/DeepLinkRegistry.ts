import * as Linking from 'expo-linking';

import { DEEP_LINK_SCHEME } from '@/core/config/constants';
import { Registry } from '@/core/registry/Registry';

export type DeepLinkParams = Record<string, string>;

export type DeepLinkTarget = {
  pathname: string;
  params: DeepLinkParams;
};

export type DeepLinkContext = {
  params: DeepLinkParams;
  query: DeepLinkParams;
};

export type DeepLinkRoute = {
  readonly id: string;
  readonly order?: number;
  readonly pattern: string;
  readonly handledByRouter?: boolean;
  toTarget(context: DeepLinkContext): DeepLinkTarget | null;
};

export type DeepLinkMatch = {
  route: DeepLinkRoute;
  target: DeepLinkTarget;
};

type ParsedDeepLink = {
  segments: string[];
  query: DeepLinkParams;
};

function parseDeepLink(url: string): ParsedDeepLink | null {
  let parsed: ReturnType<typeof Linking.parse>;
  try {
    parsed = Linking.parse(url);
  } catch {
    return null;
  }

  const pathSegments = (parsed.path ?? '').split('/').filter(Boolean);
  const withoutDevPrefix = pathSegments[0] === '--' ? pathSegments.slice(1) : pathSegments;
  const segments =
    parsed.scheme === DEEP_LINK_SCHEME && parsed.hostname
      ? [parsed.hostname, ...withoutDevPrefix]
      : withoutDevPrefix;

  const query: DeepLinkParams = {};
  Object.entries(parsed.queryParams ?? {}).forEach(([key, value]) => {
    const first = Array.isArray(value) ? value[0] : value;
    if (typeof first === 'string') query[key] = first;
  });

  return { segments, query };
}

function matchPattern(pattern: string, segments: string[]): DeepLinkParams | null {
  const patternSegments = pattern.split('/').filter(Boolean);
  if (patternSegments.length !== segments.length) return null;

  const params: DeepLinkParams = {};

  for (let index = 0; index < patternSegments.length; index += 1) {
    const expected = patternSegments[index];
    const actual = segments[index];

    if (expected.startsWith(':')) {
      params[expected.slice(1)] = decodeURIComponent(actual);
    } else if (expected !== actual) {
      return null;
    }
  }

  return params;
}

export class DeepLinkRegistry {
  private readonly routes = new Registry<DeepLinkRoute>();

  register(route: DeepLinkRoute): this {
    this.routes.register(route);
    return this;
  }

  registerAll(routes: readonly DeepLinkRoute[]): this {
    this.routes.registerAll(routes);
    return this;
  }

  resolve(url: string): DeepLinkMatch | null {
    const parsed = parseDeepLink(url);
    if (!parsed) return null;

    for (const route of this.routes.all()) {
      const params = matchPattern(route.pattern, parsed.segments);
      if (!params) continue;

      const target = route.toTarget({ params, query: parsed.query });
      if (target) return { route, target };
    }

    return null;
  }
}
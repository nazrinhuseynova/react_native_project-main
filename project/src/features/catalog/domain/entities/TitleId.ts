export type MediaKind = 'movie' | 'tv';
export type TitleId = `${MediaKind}:${number}`;

const TITLE_ID_PATTERN = /^(movie|tv):(\d+)$/;

export function isMediaKind(value: unknown): value is MediaKind {
  return value === 'movie' || value === 'tv';
}

export function makeTitleId(kind: MediaKind, tmdbId: number): TitleId {
  return `${kind}:${tmdbId}`;
}

export function isTitleId(value: string): value is TitleId {
  return TITLE_ID_PATTERN.test(value);
}

export function parseTitleId(value: string): { kind: MediaKind; tmdbId: number } | null {
  const match = TITLE_ID_PATTERN.exec(value);
  if (!match) return null;
  return { kind: match[1] as MediaKind, tmdbId: Number(match[2]) };
}


export function titleIdFromRoute(id: string | undefined, type?: string): TitleId | null {
  if (!id) return null;
  if (isTitleId(id)) return id;
  if (!/^\d+$/.test(id)) return null;
  return makeTitleId(isMediaKind(type) ? type : 'movie', Number(id));
}

export function toRouteParams(id: TitleId): { id: string; type: MediaKind } {
  const [kind, rawId] = id.split(':') as [MediaKind, string];
  return { id: rawId, type: kind };
}
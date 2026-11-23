const AZ_FOLD: Record<string, string> = {
  ə: 'e',
  ı: 'i',
  ö: 'o',
  ü: 'u',
  ş: 's',
  ç: 'c',
  ğ: 'g',
};

export const MIN_QUERY_LENGTH = 2;

export type NormalizedQuery = {
 
  text: string;
 
  folded: string;
};

export function foldText(value: string): string {
  return value
    .toLowerCase()
    .replace(/[əıöüşçğ]/g, (char) => AZ_FOLD[char] ?? char)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

export function normalizeQuery(raw: string): NormalizedQuery {
  const text = raw.trim().replace(/\s+/g, ' ');
  return { text, folded: foldText(text) };
}

export function isSearchable(query: NormalizedQuery): boolean {
  return query.folded.length >= MIN_QUERY_LENGTH;
}

export function editDistance(a: string, b: string): number {
  if (a === b) return 0;
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  let previous = Array.from({ length: b.length + 1 }, (_, index) => index);
  for (let i = 1; i <= a.length; i += 1) {
    const current = [i];
    for (let j = 1; j <= b.length; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      current[j] = Math.min(previous[j] + 1, current[j - 1] + 1, previous[j - 1] + cost);
    }
    previous = current;
  }
  return previous[b.length];
}

export function matchesName(query: string, name: string): boolean {
  if (query.length < 3) return false;
  if (name.startsWith(query)) return true;
  if (name.split(' ').some((word) => word.startsWith(query))) return true;
  if (query.length < 4) return false;
  const tolerance = query.length >= 7 ? 2 : 1;
  return editDistance(query, name) <= tolerance;
}
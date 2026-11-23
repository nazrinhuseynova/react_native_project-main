export type Certification = {
  country: string;
  rating: string;
};


export const CERTIFICATION_COUNTRY = 'US';

export function pickCertification(list: readonly Certification[]): string | null {
  const match = list.find(
    (item) => item.country === CERTIFICATION_COUNTRY && item.rating.trim() !== '',
  );
  return match ? match.rating.trim() : null;
}
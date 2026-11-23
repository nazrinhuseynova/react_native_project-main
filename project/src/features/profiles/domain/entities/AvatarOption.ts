export type AvatarOption = {
  id: string;
  label: string;
  color: string;
};

const DEFAULT_OPTION: AvatarOption = { id: 'crimson', label: 'Crimson', color: '#E50914' };

export const AVATAR_OPTIONS: readonly AvatarOption[] = [
  DEFAULT_OPTION,
  { id: 'ocean', label: 'Ocean', color: '#1F7AE0' },
  { id: 'forest', label: 'Forest', color: '#2E9E5B' },
  { id: 'amber', label: 'Amber', color: '#F29F05' },
  { id: 'violet', label: 'Violet', color: '#8E44AD' },
  { id: 'rose', label: 'Rose', color: '#E84393' },
  { id: 'teal', label: 'Teal', color: '#16A5A5' },
  { id: 'slate', label: 'Slate', color: '#5D6D7E' },
];

export const DEFAULT_AVATAR_ID = DEFAULT_OPTION.id;

export function findAvatarOption(id: string | null | undefined): AvatarOption {
  return AVATAR_OPTIONS.find((option) => option.id === id) ?? DEFAULT_OPTION;
}
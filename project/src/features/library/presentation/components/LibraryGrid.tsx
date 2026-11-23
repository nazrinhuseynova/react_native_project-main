import type { ReactElement } from 'react';
import { useMemo } from 'react';
import type { RefreshControlProps } from 'react-native';

import { TitleGrid, type TitleId } from '@/features/catalog';

import type { LibraryItem } from '../../domain/entities/LibraryEntry';

type LibraryGridProps = {
  items: readonly LibraryItem[];
  onPressTitle: (id: TitleId) => void;
  header?: ReactElement | null;
  refreshControl?: ReactElement<RefreshControlProps>;
};

export function LibraryGrid({ items, onPressTitle, header, refreshControl }: LibraryGridProps) {
  const titles = useMemo(() => items.map((item) => item.title), [items]);

  return (
    <TitleGrid
      titles={titles}
      onPressTitle={onPressTitle}
      header={header}
      refreshControl={refreshControl}
    />
  );
}
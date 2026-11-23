import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { TitleGrid, type TitleId } from '@/features/catalog';
import { makeStyles } from '@/shared/theme/makeStyles';
import { SectionHeader } from '@/shared/ui/SectionHeader';

import type { SearchResults } from '../../domain/entities/SearchResult';
import { PersonResultRow } from './PersonResultRow';

const useStyles = makeStyles(({ spacing }) => ({
  header: { marginBottom: spacing.md },
  titlesHeader: { marginTop: spacing.lg },
}));

type SearchResultListProps = {
  results: SearchResults;
  onPressTitle: (id: TitleId) => void;
  onPressPerson: (personId: number) => void;
};

export function SearchResultList({ results, onPressTitle, onPressPerson }: SearchResultListProps) {
  const { t } = useTranslation();
  const styles = useStyles();

  const header =
    results.people.length > 0 ? (
      <View style={styles.header}>
        <SectionHeader title={t('search.people')} />
        {results.people.map((person) => (
          <PersonResultRow key={person.id} person={person} onPress={onPressPerson} />
        ))}
        {results.titles.length > 0 ? (
          <SectionHeader title={t('search.titles')} style={styles.titlesHeader} />
        ) : null}
      </View>
    ) : null;

  return <TitleGrid titles={results.titles} onPressTitle={onPressTitle} header={header} />;
}
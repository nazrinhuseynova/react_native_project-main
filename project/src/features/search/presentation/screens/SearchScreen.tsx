import { useRouter } from 'expo-router';
import { useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Keyboard, ScrollView, View } from 'react-native';

import { toRouteParams, type TitleId } from '@/features/catalog';
import { makeStyles } from '@/shared/theme/makeStyles';
import { EmptyState } from '@/shared/ui/EmptyState';
import { ErrorState } from '@/shared/ui/ErrorState';
import { Screen } from '@/shared/ui/Screen';
import { Skeleton } from '@/shared/ui/Skeleton';

import { useRecentSearches } from '../../application/hooks/useRecentSearches';
import { useSearch } from '../../application/hooks/useSearch';
import { useSearchFilters } from '../../application/hooks/useSearchFilters';
import { useTopSearches } from '../../application/hooks/useTopSearches';
import { hasResults } from '../../domain/entities/SearchResult';
import { FilterSheet } from '../components/FilterSheet';
import { RecentSearchesList } from '../components/RecentSearchesList';
import { SearchBar } from '../components/SearchBar';
import { SearchResultList } from '../components/SearchResultList';
import { TopSearchesList } from '../components/TopSearchesList';

const useStyles = makeStyles(({ spacing }) => ({
  header: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm, paddingBottom: spacing.md },
  idle: { padding: spacing.lg },
  skeletons: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    gap: spacing.md,
    padding: spacing.lg,
  },
}));

export function SearchScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const styles = useStyles();

  const [text, setText] = useState('');
  const [sheetOpen, setSheetOpen] = useState(false);

  const { filter, setFilter, activeCount } = useSearchFilters();
  const { query, isActive, results, isLoading, isError, refetch } = useSearch(text, filter);
  const { recent, add, remove, clear } = useRecentSearches();
  const { titles: top } = useTopSearches();

  const remember = () => {
    if (isActive) void add(query.text);
  };

  const openTitle = (id: TitleId) => {
    remember();
    router.push({ pathname: '/movie/[id]', params: toRouteParams(id) });
  };

  const openPerson = (personId: number) => {
    remember();
    router.push({ pathname: '/person/[id]', params: { id: String(personId) } });
  };

  const submit = () => {
    Keyboard.dismiss();
    remember();
  };

  let body: ReactNode;
  if (!isActive) {
    body = (
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.idle}
        showsVerticalScrollIndicator={false}
      >
        <RecentSearchesList items={recent} onPress={setText} onRemove={(q) => void remove(q)} onClear={() => void clear()} />
        <TopSearchesList titles={top} onPress={openTitle} />
      </ScrollView>
    );
  } else if (isLoading) {
    body = (
      <View style={styles.skeletons}>
        {Array.from({ length: 9 }).map((_, index) => (
          <Skeleton key={index} width={110} height={165} radius={8} />
        ))}
      </View>
    );
  } else if (isError) {
    body = (
      <ErrorState
        title={t('search.error.title')}
        retryLabel={t('search.retry')}
        onRetry={() => void refetch()}
      />
    );
  } else if (!hasResults(results)) {
    body = (
      <EmptyState
        icon="search-outline"
        title={t('search.empty.title', { query: query.text })}
        message={t('search.empty.message')}
      />
    );
  } else {
    body = <SearchResultList results={results} onPressTitle={openTitle} onPressPerson={openPerson} />;
  }

  return (
    <Screen padded={false}>
      <View style={styles.header}>
        <SearchBar
          value={text}
          onChangeText={setText}
          onSubmit={submit}
          onOpenFilters={() => setSheetOpen(true)}
          activeFilters={activeCount}
        />
      </View>
      {body}
      <FilterSheet
        visible={sheetOpen}
        onClose={() => setSheetOpen(false)}
        filter={filter}
        onApply={setFilter}
      />
    </Screen>
  );
}
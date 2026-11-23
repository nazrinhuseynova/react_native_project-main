import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FlatList,
  useWindowDimensions,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';

import { makeStyles } from '@/shared/theme/makeStyles';
import { Button } from '@/shared/ui/Button';
import { Screen } from '@/shared/ui/Screen';

import { useOnboardingSteps } from '../../application/onboardingSteps';
import type { OnboardingStep } from '../../domain/OnboardingStep';
import { IntroPage } from '../components/IntroPage';
import { PageDots } from '../components/PageDots';

const useStyles = makeStyles(({ spacing }) => ({
  topBar: {
    alignItems: 'flex-end' as const,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  footer: { padding: spacing.lg, gap: spacing.lg },
}));

export function IntroScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const styles = useStyles();
  const steps = useOnboardingSteps();
  const { width } = useWindowDimensions();
  const listRef = useRef<FlatList<OnboardingStep>>(null);
  const [index, setIndex] = useState(0);

  const isLast = index >= steps.length - 1;
  const toGenres = () => router.push('/pick-genres');

  const onNext = () => {
    if (isLast) {
      toGenres();
      return;
    }
    listRef.current?.scrollToIndex({ index: index + 1, animated: true });
  };

  const onMomentumEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    setIndex(Math.round(event.nativeEvent.contentOffset.x / width));
  };

  return (
    <Screen padded={false}>
      <View style={styles.topBar}>
        <Button
          label={t('common.skip')}
          variant="ghost"
          size="sm"
          fullWidth={false}
          style={{ alignSelf: 'flex-end' }}
          onPress={toGenres}
        />
      </View>

      <FlatList
        ref={listRef}
        data={steps}
        keyExtractor={(step) => step.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onMomentumEnd}
        getItemLayout={(_, itemIndex) => ({
          length: width,
          offset: width * itemIndex,
          index: itemIndex,
        })}
        renderItem={({ item }) => <IntroPage step={item} width={width} />}
      />

      <View style={styles.footer}>
        <PageDots count={steps.length} activeIndex={index} />
        <Button
          label={isLast ? t('onboarding.getStarted') : t('common.next')}
          onPress={onNext}
        />
      </View>
    </Screen>
  );
}
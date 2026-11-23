import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { toUserMessage } from '@/core/errors/toUserMessage';
import { makeStyles } from '@/shared/theme/makeStyles';
import { AppText } from '@/shared/ui/AppText';
import { Button } from '@/shared/ui/Button';
import { Screen } from '@/shared/ui/Screen';
import { useToast } from '@/shared/ui/ToastProvider';

import { useGenrePicks } from '../../application/hooks/useGenrePicks';
import { GenreChip } from '../components/GenreChip';

const useStyles = makeStyles(({ spacing }) => ({
  header: { marginTop: spacing.xl, marginBottom: spacing.lg, gap: spacing.sm },
  chips: { flexDirection: 'row' as const, flexWrap: 'wrap' as const, gap: spacing.sm },
  footer: { padding: spacing.lg, gap: spacing.sm },
}));

export function GenrePickerScreen() {
  const { t } = useTranslation();
  const toast = useToast();
  const styles = useStyles();
  const { options, selected, toggle, minPicks, canContinue, isSaving, finish } = useGenrePicks();

  const submit = async (skip: boolean) => {
    try {
      await finish({ skip });
    } catch (error) {
      toast.error(t(toUserMessage(error)));
    }
  };

  return (
    <Screen
      scroll
      footer={
        <View style={styles.footer}>
          <AppText variant="caption" color="textSecondary" align="center">
            {t('onboarding.genres.selected', { count: selected.size })}
          </AppText>
          <Button
            label={t('onboarding.genres.continue')}
            disabled={!canContinue}
            loading={isSaving}
            onPress={() => void submit(false)}
          />
          <Button
            label={t('common.skip')}
            variant="ghost"
            disabled={isSaving}
            onPress={() => void submit(true)}
          />
        </View>
      }
    >
      <View style={styles.header}>
        <AppText variant="title1">{t('onboarding.genres.title')}</AppText>
        <AppText variant="body" color="textSecondary">
          {t('onboarding.genres.subtitle', { count: minPicks })}
        </AppText>
      </View>

      <View style={styles.chips}>
        {options.map((option) => (
          <GenreChip
            key={option.id}
            option={option}
            selected={selected.has(option.id)}
            onToggle={toggle}
          />
        ))}
      </View>
    </Screen>
  );
}
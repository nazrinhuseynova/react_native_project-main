import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { makeStyles } from '@/shared/theme/makeStyles';
import { useTheme } from '@/shared/theme/useTheme';
import type { IconName } from '@/shared/types/common';
import { AppText } from '@/shared/ui/AppText';

import type { OnboardingStep } from '../../domain/OnboardingStep';

const useStyles = makeStyles(({ spacing, colors }) => ({
  page: {
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    padding: spacing.xl,
  },
  iconCircle: {
    width: 128,
    height: 128,
    borderRadius: 64,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    backgroundColor: colors.primarySoft,
    marginBottom: spacing.xl,
  },
  body: { marginTop: spacing.md },
}));

type IntroPageProps = {
  step: OnboardingStep;
  width: number;
};

export function IntroPage({ step, width }: IntroPageProps) {
  const { t } = useTranslation();
  const styles = useStyles();
  const { colors } = useTheme();

  return (
    <View style={[styles.page, { width }]}>
      <View style={styles.iconCircle}>
        <Ionicons name={step.icon as IconName} size={64} color={colors.primary} />
      </View>
      <AppText variant="title1" align="center">
        {t(step.titleKey)}
      </AppText>
      <AppText variant="body" color="textSecondary" align="center" style={styles.body}>
        {t(step.bodyKey)}
      </AppText>
    </View>
  );
}
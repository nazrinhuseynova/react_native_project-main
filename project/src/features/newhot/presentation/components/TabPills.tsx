import { ScrollView } from 'react-native';

import { tabA11y } from '@/shared/a11y/accessibilityProps';
import { ScalePressable } from '@/shared/animations/ScalePressable';
import { useTheme } from '@/shared/theme/useTheme';
import { AppText } from '@/shared/ui/AppText';

export type TabOption<T extends string> = {
  key: T;
  label: string;
};

type TabPillsProps<T extends string> = {
  tabs: readonly TabOption<T>[];
  value: T;
  onChange: (key: T) => void;
};

export function TabPills<T extends string>({ tabs, value, onChange }: TabPillsProps<T>) {
  const { colors, radius, spacing } = useTheme();

  return (
    <ScrollView
      horizontal
      accessibilityRole="tablist"
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingVertical: spacing.md, gap: spacing.sm }}
    >
      {tabs.map((tab) => {
        const selected = tab.key === value;
        return (
          <ScalePressable
            key={tab.key}
            {...tabA11y(tab.label, selected)}
            onPress={() => onChange(tab.key)}
            style={{
              minHeight: 36,
              justifyContent: 'center',
              paddingHorizontal: spacing.lg,
              borderRadius: radius.pill,
              backgroundColor: selected ? colors.text : colors.surfaceElevated,
            }}
          >
            <AppText variant="callout" weight="600" color={selected ? colors.background : 'textSecondary'}>
              {tab.label}
            </AppText>
          </ScalePressable>
        );
      })}
    </ScrollView>
  );
}
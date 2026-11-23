import { Ionicons } from '@expo/vector-icons';
import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';

import { MATURITY_RATINGS, type MaturityRating } from '@/features/profiles';
import { useTheme } from '@/shared/theme/useTheme';
import { Divider } from '@/shared/ui/Divider';
import { ListRow } from '@/shared/ui/ListRow';

type MaturityPickerProps = {
  value: MaturityRating;
  onChange: (rating: MaturityRating) => void;
  disabled?: boolean;
};

export function MaturityPicker({ value, onChange, disabled = false }: MaturityPickerProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();

  return (
    <>
      {MATURITY_RATINGS.map((rating, index) => (
        <Fragment key={rating}>
          {index > 0 ? <Divider /> : null}
          <ListRow
            title={t(`maturity.${rating}.label`)}
            subtitle={t(`maturity.${rating}.description`)}
            disabled={disabled}
            showChevron={false}
            onPress={() => onChange(rating)}
            right={
              rating === value ? (
                <Ionicons name="checkmark-circle" size={22} color={colors.primary} />
              ) : (
                <Ionicons name="ellipse-outline" size={22} color={colors.textMuted} />
              )
            }
          />
        </Fragment>
      ))}
    </>
  );
}
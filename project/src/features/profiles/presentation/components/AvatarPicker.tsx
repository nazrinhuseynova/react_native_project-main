import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { buttonA11y } from '@/shared/a11y/accessibilityProps';
import { ScalePressable } from '@/shared/animations/ScalePressable';
import { makeStyles } from '@/shared/theme/makeStyles';
import { AppText } from '@/shared/ui/AppText';
import { Button } from '@/shared/ui/Button';

import { AVATAR_OPTIONS } from '../../domain/entities/AvatarOption';
import { ProfileAvatar } from './ProfileAvatar';

type AvatarPickerProps = {
  name: string;
  presetId: string;
  imageUri: string | null;
  onSelectPreset: (presetId: string) => void;
  onPickImage: () => void;
  isPicking?: boolean;
  permissionDenied?: boolean;
  onOpenSettings?: () => void;
};

const useStyles = makeStyles(({ spacing, colors }) => ({
  preview: { alignItems: 'center' as const, marginBottom: spacing.lg },
  row: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    justifyContent: 'center' as const,
    gap: spacing.md,
  },
  swatch: { width: 44, height: 44, borderRadius: 22, borderWidth: 3 },
  actions: { marginTop: spacing.lg, gap: spacing.sm },
  denied: {
    marginTop: spacing.md,
    padding: spacing.md,
    borderRadius: 12,
    backgroundColor: colors.primarySoft,
  },
}));

export function AvatarPicker({
  name,
  presetId,
  imageUri,
  onSelectPreset,
  onPickImage,
  isPicking = false,
  permissionDenied = false,
  onOpenSettings,
}: AvatarPickerProps) {
  const { t } = useTranslation();
  const styles = useStyles();

  return (
    <View>
      <View style={styles.preview}>
        <ProfileAvatar
          profile={{ name: name || '?', avatarPreset: presetId, avatarUrl: imageUri }}
          size={112}
        />
      </View>

      <AppText variant="captionStrong" color="textSecondary" align="center" style={{ marginBottom: 8 }}>
        {t('profiles.avatar.choose')}
      </AppText>

      <View style={styles.row}>
        {AVATAR_OPTIONS.map((option) => {
          const selected = !imageUri && option.id === presetId;
          return (
            <ScalePressable
              key={option.id}
              {...buttonA11y(option.label, { selected })}
              onPress={() => onSelectPreset(option.id)}
              style={[
                styles.swatch,
                { backgroundColor: option.color, borderColor: selected ? '#FFFFFF' : 'transparent' },
              ]}
            />
          );
        })}
      </View>

      <View style={styles.actions}>
        <Button
          label={t('profiles.avatar.upload')}
          variant="secondary"
          leftIcon="image-outline"
          loading={isPicking}
          onPress={onPickImage}
        />
      </View>

      {permissionDenied ? (
        <View style={styles.denied}>
          <AppText variant="callout" style={{ marginBottom: 8 }}>
            {t('profiles.avatar.denied')}
          </AppText>
          {onOpenSettings ? (
            <Button
              label={t('profiles.avatar.openSettings')}
              size="sm"
              variant="secondary"
              fullWidth={false}
              onPress={onOpenSettings}
            />
          ) : null}
        </View>
      ) : null}
    </View>
  );
}
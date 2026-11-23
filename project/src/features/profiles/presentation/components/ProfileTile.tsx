import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { buttonA11y } from '@/shared/a11y/accessibilityProps';
import { ScalePressable } from '@/shared/animations/ScalePressable';
import { makeStyles } from '@/shared/theme/makeStyles';
import { useTheme } from '@/shared/theme/useTheme';
import { AppText } from '@/shared/ui/AppText';
import { Badge } from '@/shared/ui/Badge';

import { hasPin, type Profile } from '../../domain/entities/Profile';
import { ProfileAvatar } from './ProfileAvatar';

type ProfileTileProps = {
  profile: Profile;
  onPress: (profile: Profile) => void;
  editing?: boolean;
  size?: number;
};

const useStyles = makeStyles(({ spacing, colors }) => ({
  tile: { alignItems: 'center' as const, width: 112, marginBottom: spacing.lg },
  avatarWrap: { marginBottom: spacing.sm },
  badge: {
    position: 'absolute' as const,
    right: -4,
    bottom: -4,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  meta: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
}));

export function ProfileTile({ profile, onPress, editing = false, size = 96 }: ProfileTileProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useStyles();
  const locked = hasPin(profile);

  return (
    <ScalePressable
      {...buttonA11y(profile.name, {
        hint: editing ? t('profiles.edit.editTitle') : undefined,
      })}
      onPress={() => onPress(profile)}
      style={styles.tile}
    >
      <View style={styles.avatarWrap}>
        <ProfileAvatar profile={profile} size={size} />
        {editing ? (
          <View style={styles.badge}>
            <Ionicons name="pencil" size={16} color={colors.text} />
          </View>
        ) : null}
      </View>
      <AppText variant="bodyStrong" numberOfLines={1} align="center">
        {profile.name}
      </AppText>
      {profile.isKids || locked ? (
        <View style={styles.meta}>
          {profile.isKids ? <Badge label={t('profiles.kidsBadge')} tone="info" /> : null}
          {locked ? <Ionicons name="lock-closed" size={14} color={colors.textMuted} /> : null}
        </View>
      ) : null}
    </ScalePressable>
  );
}
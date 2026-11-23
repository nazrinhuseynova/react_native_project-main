import { Image } from 'expo-image';
import { View, type StyleProp, type ViewStyle } from 'react-native';
 
import { imageA11y } from '../a11y/accessibilityProps';
import { useTheme } from '../theme/useTheme';
import { AppText } from './AppText';
 
interface AvatarProps {
  uri?: string | null;
  name?: string;
  size?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
}
 
function initialsOf(name?: string): string {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((part) => part.charAt(0).toUpperCase()).join('') || '?';
}
 
export function Avatar({ uri, name, size = 48, color, style }: AvatarProps) {
  const { colors } = useTheme();
  const background = color ?? colors.primary;
 
  return (
    <View
      {...imageA11y(name ? `${name} avatar` : 'Avatar')}
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          overflow: 'hidden',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: background,
        },
        style,
      ]}
    >
      {uri ? (
        <Image source={{ uri }} style={{ width: size, height: size }} contentFit="cover" transition={150} />
      ) : (
        <AppText
          variant="headline"
          color="#FFFFFF"
          maxFontScale={1}
          style={{ fontSize: size * 0.4, lineHeight: size * 0.5 }}
        >
          {initialsOf(name)}
        </AppText>
      )}
    </View>
  );
}

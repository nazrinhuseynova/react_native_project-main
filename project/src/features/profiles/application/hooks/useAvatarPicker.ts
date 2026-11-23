import * as ImagePicker from 'expo-image-picker';
import { useCallback, useState } from 'react';
import { Linking } from 'react-native';

export function useAvatarPicker() {
  const [isPicking, setIsPicking] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);


  const pick = useCallback(async (): Promise<string | null> => {
    setIsPicking(true);
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        setPermissionDenied(true);
        return null;
      }
      setPermissionDenied(false);

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });
      if (result.canceled) return null;
      return result.assets[0]?.uri ?? null;
    } finally {
      setIsPicking(false);
    }
  }, []);

  const openSettings = useCallback(() => {
    Linking.openSettings().catch(() => undefined);
  }, []);

  return { pick, isPicking, permissionDenied, openSettings };
}
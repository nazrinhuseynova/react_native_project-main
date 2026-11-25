import { Ionicons } from '@expo/vector-icons';
import { useKeepAwake } from 'expo-keep-awake';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

import { useServices } from '@/bootstrap/useServices';
import { useSecureScreen } from '@/core/security/useSecureScreen';
import { titleIdFromRoute, useTitleDetails, useTrailers } from '@/features/catalog';
import { AppText } from '@/shared/ui/AppText';

import { useOrientationLock } from '../../application/hooks/useOrientationLock';

const FALLBACK_YOUTUBE_KEY = 'aqz-KE-bpKQ';

function buildEmbedHtml(videoKey: string): string {
  const safeKey = encodeURIComponent(videoKey);
  return `<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { width: 100%; height: 100%; background: #000; overflow: hidden; }
    iframe { position: fixed; top: 0; left: 0; width: 100%; height: 100%; border: 0; }
  </style>
</head>
<body>
  <iframe
    src="https://youtube.com{safeKey}?playsinline=1&rel=0&modestbranding=1&autoplay=1&controls=1&fs=1"
    referrerpolicy="strict-origin-when-cross-origin"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
    allowfullscreen
  ></iframe>
</body>
</html>`;
}

export function PlayerScreen() {
  const params = useLocalSearchParams<{
    id?: string;
    type?: string;
    season?: string;
    episode?: string;
    videoKey?: string;
  }>();
  const router = useRouter();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { eventBus } = useServices();

  const titleId = titleIdFromRoute(params.id, params.type);
  const { details } = useTitleDetails(titleId);
  const { trailer, videos, isLoading } = useTrailers(titleId, { enabled: !params.videoKey });

  useOrientationLock();
  useKeepAwake();
  useSecureScreen(true, 'player');

  const resolvedVideo =
    params.videoKey ??
    trailer?.key ??
    videos.find((v) => v.site === 'YouTube')?.key ??
    FALLBACK_YOUTUBE_KEY;

  const titleName = details?.title.name ?? '';
  const subtitle =
    params.season && params.episode ? `S${params.season}:E${params.episode}` : undefined;

  useEffect(() => {
    if (!titleId) return;
    eventBus.emit('playback.started', {
      titleId,
      episodeId: params.season && params.episode ? `s${params.season}e${params.episode}` : undefined,
      positionSec: 0,
    });
  }, [titleId, params.season, params.episode, eventBus]);

  return (
    <View style={styles.root}>
      <StatusBar hidden />

      {isLoading && !params.videoKey ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#FFFFFF" />
        </View>
      ) : (
        <WebView
          originWhitelist={['*']}
          source={{
            html: buildEmbedHtml(resolvedVideo),
            baseUrl: 'https://youtube.com',
          }}
          style={styles.webview}
          javaScriptEnabled
          domStorageEnabled
          allowsInlineMediaPlayback
          mediaPlaybackRequiresUserAction={false}
          allowsFullscreenVideo
          mixedContentMode="always"
        />
      )}

      <View
        pointerEvents="box-none"
        style={[
          styles.topBar,
          { paddingTop: Math.max(insets.top, 12), paddingLeft: Math.max(insets.left, 16) },
        ]}
      >
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel={t('common.back')}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={26} color="#FFFFFF" />
        </Pressable>

        <View style={styles.titleWrap}>
          {titleName ? (
            <AppText variant="headline" color="#FFFFFF" numberOfLines={1}>
              {titleName}
            </AppText>
          ) : null}
          {subtitle ? (
            <AppText variant="caption" color="#D0D0D8" numberOfLines={1}>
              {subtitle}
            </AppText>
          ) : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000000',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000000',
  },
  webview: {
    flex: 1,
    backgroundColor: '#000000',
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingRight: 16,
    paddingBottom: 12,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleWrap: {
    flex: 1,
  },
});

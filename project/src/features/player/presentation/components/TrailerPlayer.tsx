import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

type TrailerPlayerProps = {
  videoKey: string;
  autoPlay?: boolean;
  muted?: boolean;
};

export function TrailerPlayer({ videoKey, autoPlay = true, muted = true }: TrailerPlayerProps) {
  const uri =
    `https://www.youtube.com/embed/${encodeURIComponent(videoKey)}` +
    `?playsinline=1&rel=0&modestbranding=1&autoplay=${autoPlay ? 1 : 0}&mute=${muted ? 1 : 0}`;

  return (
    <View style={styles.container}>
      <WebView
        source={{ uri }}
        style={styles.web}
        javaScriptEnabled
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction={false}
        allowsFullscreenVideo
        onShouldStartLoadWithRequest={(request) => request.url.startsWith('https://www.youtube.com/embed/')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%', aspectRatio: 16 / 9, backgroundColor: '#000000' },
  web: { flex: 1, backgroundColor: '#000000' },
});
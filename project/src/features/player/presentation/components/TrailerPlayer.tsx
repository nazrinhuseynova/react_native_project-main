import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

type TrailerPlayerProps = {
  videoKey: string;
  onError?: () => void;
};

const ORIGIN = 'https://www.youtube.com';

export function TrailerPlayer({ videoKey, onError }: TrailerPlayerProps) {
  const html = `<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1" />
<style>html,body{margin:0;height:100%;background:#000}#p{width:100%;height:100%}</style>
</head>
<body>
<div id="p"></div>
<script src="https://www.youtube.com/iframe_api"></script>
<script>
  function onYouTubeIframeAPIReady() {
    new YT.Player('p', {
      videoId: ${JSON.stringify(videoKey)},
      width: '100%',
      height: '100%',
      playerVars: { playsinline: 1, autoplay: 1, rel: 0, origin: '${ORIGIN}' },
      events: {
        onReady: function (e) { e.target.playVideo(); },
        onError: function () { window.ReactNativeWebView.postMessage('error'); }
      }
    });
  }
</script>
</body>
</html>`;

  return (
    <View style={styles.container}>
      <WebView
        source={{ html, baseUrl: ORIGIN }}
        style={styles.web}
        originWhitelist={['https://*', 'about:*']}
        javaScriptEnabled
        domStorageEnabled
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction={false}
        allowsFullscreenVideo
        onMessage={(event) => {
          if (event.nativeEvent.data === 'error') onError?.();
        }}
        onError={() => onError?.()}
        onShouldStartLoadWithRequest={(request) =>
          request.url.startsWith('about:') ||
          request.url === `${ORIGIN}/` ||
          request.url.startsWith(`${ORIGIN}/embed/`)
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, width: '100%', backgroundColor: '#000000' },
  web: { flex: 1, backgroundColor: '#000000' },
});
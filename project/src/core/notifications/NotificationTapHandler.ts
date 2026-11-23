import * as Notifications from 'expo-notifications';

export type OpenUrlHandler = (url: string) => void;

export class NotificationTapHandler {
  private readonly onOpenUrl: OpenUrlHandler;

  constructor(onOpenUrl: OpenUrlHandler) {
    this.onOpenUrl = onOpenUrl;
  }

  start(): () => void {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldPlaySound: false,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });

    const initialResponse = Notifications.getLastNotificationResponse();
    if (initialResponse) {
      this.handle(initialResponse);
      Notifications.clearLastNotificationResponse();
    }

    const subscription = Notifications.addNotificationResponseReceivedListener((response) =>
      this.handle(response),
    );

    return () => subscription.remove();
  }

  private handle(response: Notifications.NotificationResponse): void {
    const url = response.notification.request.content.data?.url;
    if (typeof url === 'string' && url.length > 0) {
      this.onOpenUrl(url);
    }
  }
}
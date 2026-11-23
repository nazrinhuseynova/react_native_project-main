import * as ScreenCapture from 'expo-screen-capture';

export class ScreenCaptureGuard {
  private readonly activeKeys = new Set<string>();

  async enable(key: string): Promise<void> {
    if (this.activeKeys.has(key)) return;
    this.activeKeys.add(key);
    await ScreenCapture.preventScreenCaptureAsync(key);
  }

  async disable(key: string): Promise<void> {
    if (!this.activeKeys.delete(key)) return;
    await ScreenCapture.allowScreenCaptureAsync(key);
  }
}

export const screenCaptureGuard = new ScreenCaptureGuard();
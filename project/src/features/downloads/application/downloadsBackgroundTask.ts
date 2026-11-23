import * as BackgroundTask from 'expo-background-task';
import * as TaskManager from 'expo-task-manager';

export const DOWNLOADS_TASK = 'cineverse.downloads.maintenance';

type Runner = () => Promise<void>;
let runner: Runner | null = null;

export function setDownloadsTaskRunner(next: Runner | null): void {
  runner = next;
}


TaskManager.defineTask(DOWNLOADS_TASK, async () => {
  try {
    await runner?.();
    return BackgroundTask.BackgroundTaskResult.Success;
  } catch {
    return BackgroundTask.BackgroundTaskResult.Failed;
  }
});

export async function registerDownloadsBackgroundTask(): Promise<void> {
  const registered = await TaskManager.isTaskRegisteredAsync(DOWNLOADS_TASK);
  if (registered) return;
  await BackgroundTask.registerTaskAsync(DOWNLOADS_TASK, { minimumInterval: 6 * 60 });
}

export async function unregisterDownloadsBackgroundTask(): Promise<void> {
  const registered = await TaskManager.isTaskRegisteredAsync(DOWNLOADS_TASK);
  if (registered) await BackgroundTask.unregisterTaskAsync(DOWNLOADS_TASK);
}
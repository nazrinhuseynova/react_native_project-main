// NOTE: "expo-file-system/legacy" yolunu SDK 58 üçün yoxlayın.
import * as FileSystem from 'expo-file-system/legacy';
import { useEffect, useState } from 'react';

import { useDownloads } from './useDownloads';

export function useStorageUsage() {
  const { usedBytes, items } = useDownloads();
  const [freeBytes, setFreeBytes] = useState(0);
  const [totalBytes, setTotalBytes] = useState(0);

  useEffect(() => {
    let active = true;
    Promise.all([FileSystem.getFreeDiskStorageAsync(), FileSystem.getTotalDiskCapacityAsync()])
      .then(([free, total]) => {
        if (!active) return;
        setFreeBytes(free);
        setTotalBytes(total);
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, [items]);

  const usedFraction = totalBytes > 0 ? Math.min(usedBytes / totalBytes, 1) : 0;

  return { usedBytes, freeBytes, totalBytes, usedFraction };
}
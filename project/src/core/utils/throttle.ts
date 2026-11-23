export type Throttled<A extends unknown[]> = ((...args: A) => void) & {
  cancel: () => void;
};

export function throttle<A extends unknown[]>(
  fn: (...args: A) => void,
  intervalMs: number,
): Throttled<A> {
  let lastCall = 0;
  let timer: ReturnType<typeof setTimeout> | null = null;
  let pendingArgs: A | null = null;

  const throttled = (...args: A) => {
    const remaining = intervalMs - (Date.now() - lastCall);

    if (remaining <= 0) {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      pendingArgs = null;
      lastCall = Date.now();
      fn(...args);
      return;
    }

    pendingArgs = args;

    if (!timer) {
      timer = setTimeout(() => {
        timer = null;
        lastCall = Date.now();
        if (pendingArgs) {
          const latest = pendingArgs;
          pendingArgs = null;
          fn(...latest);
        }
      }, remaining);
    }
  };

  throttled.cancel = () => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    pendingArgs = null;
  };

  return throttled;
}
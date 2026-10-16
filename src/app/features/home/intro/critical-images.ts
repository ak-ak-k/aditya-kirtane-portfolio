/** Image errors and cancellation release the intro; neither may block navigation. */
export async function waitForCriticalImages(
  images: readonly HTMLImageElement[],
  signal: AbortSignal,
): Promise<void> {
  await Promise.all(
    images.map(
      (image) =>
        new Promise<void>((resolve) => {
          let settled = false;
          const finish = (): void => {
            if (settled) return;
            settled = true;
            image.removeEventListener('load', decode);
            image.removeEventListener('error', finish);
            signal.removeEventListener('abort', finish);
            resolve();
          };
          const decode = (): void => {
            if (image.naturalWidth > 0 && typeof image.decode === 'function') {
              void image.decode().then(finish, finish);
            } else {
              finish();
            }
          };

          image.addEventListener('load', decode, { once: true });
          image.addEventListener('error', finish, { once: true });
          signal.addEventListener('abort', finish, { once: true });
          if (signal.aborted) finish();
          else if (image.complete) decode();
        }),
    ),
  );
}

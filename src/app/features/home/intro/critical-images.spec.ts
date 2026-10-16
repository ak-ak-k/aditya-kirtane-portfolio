import { waitForCriticalImages } from './critical-images';

describe('Critical intro image readiness', () => {
  function pendingImage(): HTMLImageElement {
    const image = document.createElement('img');
    Object.defineProperty(image, 'complete', { value: false });
    return image;
  }

  it('decodes a cached image before declaring it ready', async () => {
    const image = document.createElement('img');
    Object.defineProperty(image, 'naturalWidth', { value: 511 });
    image.decode = vi.fn().mockResolvedValue(undefined);
    await waitForCriticalImages([image], new AbortController().signal);
    expect(image.decode).toHaveBeenCalledTimes(1);
  });

  it('waits for every required image rather than the first load event', async () => {
    const first = pendingImage();
    const second = pendingImage();
    const done = vi.fn();
    const ready = waitForCriticalImages([first, second], new AbortController().signal).then(done);
    first.dispatchEvent(new Event('load'));
    await Promise.resolve();
    expect(done).not.toHaveBeenCalled();
    second.dispatchEvent(new Event('load'));
    await ready;
    expect(done).toHaveBeenCalledTimes(1);
  });

  it('settles safely on an image error', async () => {
    const image = pendingImage();
    const ready = waitForCriticalImages([image], new AbortController().signal);
    image.dispatchEvent(new Event('error'));
    await expect(ready).resolves.toBeUndefined();
  });

  it('settles safely on a decoding failure', async () => {
    const image = document.createElement('img');
    Object.defineProperty(image, 'naturalWidth', { value: 511 });
    image.decode = vi.fn().mockRejectedValue(new Error('Decode failed'));
    await expect(
      waitForCriticalImages([image], new AbortController().signal),
    ).resolves.toBeUndefined();
  });

  it('cancels pending images and removes listeners on navigation or skip', async () => {
    const image = pendingImage();
    const remove = vi.spyOn(image, 'removeEventListener');
    const controller = new AbortController();
    const ready = waitForCriticalImages([image], controller.signal);
    controller.abort();
    await ready;
    expect(remove).toHaveBeenCalledWith('load', expect.any(Function));
    expect(remove).toHaveBeenCalledWith('error', expect.any(Function));
  });

  it('does not block when cancellation has already occurred', async () => {
    const controller = new AbortController();
    controller.abort();
    await expect(
      waitForCriticalImages([pendingImage()], controller.signal),
    ).resolves.toBeUndefined();
  });
});

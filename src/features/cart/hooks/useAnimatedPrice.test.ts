import { renderHook, act, waitFor } from '@testing-library/react';
import { useAnimatedPrice } from './useAnimatedPrice';

describe('useAnimatedPrice', () => {
  it.skip('should complete animation and set final value', async () => {
    const { result, rerender } = renderHook(
      ({ targetValue }) => useAnimatedPrice({ targetValue, duration: 100 }),
      {
        initialProps: { targetValue: 100 },
      }
    );

    act(() => {
      rerender({ targetValue: 200 });
    });

    await waitFor(
      () => {
        expect(result.current.value).toBeCloseTo(200);
      },
      { timeout: 2000 }
    );

    expect(result.current.isAnimating).toBe(false);
  });

  it.skip('should use custom duration', async () => {
    const { result, rerender } = renderHook(
      ({ targetValue, duration }) => useAnimatedPrice({ targetValue, duration }),
      {
        initialProps: { targetValue: 100, duration: 500 },
      }
    );

    act(() => {
      rerender({ targetValue: 200, duration: 500 });
    });

    await waitFor(
      () => {
        expect(result.current.value).toBeCloseTo(200);
      },
      { timeout: 2000 }
    );

    expect(result.current.isAnimating).toBe(false);
  });
});

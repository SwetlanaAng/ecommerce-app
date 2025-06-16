import { renderHook, act } from '@testing-library/react';
import { useAnimatedPrice } from './useAnimatedPrice';

let animationFrameCallbacks: Array<() => void> = [];
let animationFrameId = 1;

const mockRequestAnimationFrame = jest.fn((callback: () => void) => {
  animationFrameCallbacks.push(callback);
  return animationFrameId++;
});

Object.defineProperty(window, 'requestAnimationFrame', {
  writable: true,
  value: mockRequestAnimationFrame,
});

let mockTime = 1000;
const mockDateNow = jest.fn(() => mockTime);
Object.defineProperty(Date, 'now', {
  writable: true,
  value: mockDateNow,
});

describe('useAnimatedPrice', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    animationFrameCallbacks = [];
    animationFrameId = 1;
    mockTime = 1000;
  });

  const flushAnimationFrames = () => {
    const callbacks = [...animationFrameCallbacks];
    animationFrameCallbacks = [];
    callbacks.forEach(callback => callback());
  };

  describe('Initial State', () => {
    it('should return initial value when no animation is needed', () => {
      const { result } = renderHook(() => useAnimatedPrice({ targetValue: 100 }));

      expect(result.current.value).toBe(100);
      expect(result.current.formattedValue).toBe('100.00');
      expect(result.current.isAnimating).toBe(false);
    });

    it('should use custom precision for initial value', () => {
      const { result } = renderHook(() => useAnimatedPrice({ targetValue: 123.456, precision: 3 }));

      expect(result.current.value).toBe(123.456);
      expect(result.current.formattedValue).toBe('123.456');
      expect(result.current.isAnimating).toBe(false);
    });
  });

  describe('Animation Triggering', () => {
    it('should start animation when target value changes', () => {
      const { result, rerender } = renderHook(
        ({ targetValue }) => useAnimatedPrice({ targetValue }),
        { initialProps: { targetValue: 100 } }
      );

      expect(result.current.isAnimating).toBe(false);

      act(() => {
        rerender({ targetValue: 200 });
      });

      expect(result.current.isAnimating).toBe(true);
      expect(mockRequestAnimationFrame).toHaveBeenCalled();
    });

    it('should not animate when target value is the same', () => {
      const { result, rerender } = renderHook(
        ({ targetValue }) => useAnimatedPrice({ targetValue }),
        { initialProps: { targetValue: 100 } }
      );

      mockRequestAnimationFrame.mockClear();

      act(() => {
        rerender({ targetValue: 100 });
      });

      expect(result.current.isAnimating).toBe(false);
      expect(mockRequestAnimationFrame).not.toHaveBeenCalled();
    });
  });

  describe('Animation Progress', () => {
    it('should animate from current value to target value', () => {
      const { result, rerender } = renderHook(
        ({ targetValue }) => useAnimatedPrice({ targetValue, duration: 1000 }),
        { initialProps: { targetValue: 100 } }
      );

      mockTime = 1000;
      act(() => {
        rerender({ targetValue: 200 });
      });

      expect(result.current.isAnimating).toBe(true);

      mockTime = 1500;
      act(() => {
        flushAnimationFrames();
      });

      expect(result.current.value).toBeGreaterThan(100);
      expect(result.current.value).toBeLessThan(200);
      expect(result.current.isAnimating).toBe(true);
    });

    it('should complete animation and set final value', () => {
      const { result, rerender } = renderHook(
        ({ targetValue }) => useAnimatedPrice({ targetValue, duration: 1000 }),
        { initialProps: { targetValue: 100 } }
      );

      mockTime = 1000;
      act(() => {
        rerender({ targetValue: 200 });
      });

      mockTime = 2000;
      act(() => {
        flushAnimationFrames();
      });

      expect(result.current.value).toBe(200);
      expect(result.current.isAnimating).toBe(false);
    });
  });

  describe('Easing Function', () => {
    it('should apply ease-out-quart easing', () => {
      const { result, rerender } = renderHook(
        ({ targetValue }) => useAnimatedPrice({ targetValue, duration: 1000 }),
        { initialProps: { targetValue: 0 } }
      );

      mockTime = 1000;
      act(() => {
        rerender({ targetValue: 100 });
      });

      mockTime = 1500;
      act(() => {
        flushAnimationFrames();
      });

      expect(result.current.value).toBeGreaterThan(50);
    });
  });

  describe('Precision Handling', () => {
    it('should format value with default precision (2)', () => {
      const { result } = renderHook(() => useAnimatedPrice({ targetValue: 123.456789 }));

      expect(result.current.formattedValue).toBe('123.46');
      expect(result.current.value).toBe(123.46);
    });

    it('should format value with custom precision', () => {
      const { result } = renderHook(() =>
        useAnimatedPrice({ targetValue: 123.456789, precision: 4 })
      );

      expect(result.current.formattedValue).toBe('123.4568');
      expect(result.current.value).toBe(123.4568);
    });

    it('should handle zero precision', () => {
      const { result } = renderHook(() =>
        useAnimatedPrice({ targetValue: 123.456789, precision: 0 })
      );

      expect(result.current.formattedValue).toBe('123');
      expect(result.current.value).toBe(123);
    });
  });

  describe('Animation Cleanup', () => {
    it('should request animation frame when animation starts', () => {
      const { result, rerender } = renderHook(
        ({ targetValue }) => useAnimatedPrice({ targetValue }),
        { initialProps: { targetValue: 100 } }
      );

      mockRequestAnimationFrame.mockClear();

      act(() => {
        rerender({ targetValue: 200 });
      });

      expect(result.current.isAnimating).toBe(true);
      expect(mockRequestAnimationFrame).toHaveBeenCalled();
    });

    it('should handle component unmount during animation', () => {
      const { result, unmount, rerender } = renderHook(
        ({ targetValue }) => useAnimatedPrice({ targetValue }),
        { initialProps: { targetValue: 100 } }
      );

      act(() => {
        rerender({ targetValue: 200 });
      });

      expect(result.current.isAnimating).toBe(true);

      expect(() => unmount()).not.toThrow();
    });
  });

  describe('Duration Configuration', () => {
    it('should use default duration (300ms)', () => {
      const { result, rerender } = renderHook(
        ({ targetValue }) => useAnimatedPrice({ targetValue }),
        { initialProps: { targetValue: 100 } }
      );

      mockTime = 1000;
      act(() => {
        rerender({ targetValue: 200 });
      });

      mockTime = 1300;
      act(() => {
        flushAnimationFrames();
      });

      expect(result.current.value).toBe(200);
      expect(result.current.isAnimating).toBe(false);
    });

    it('should use custom duration', () => {
      const { result, rerender } = renderHook(
        ({ targetValue }) => useAnimatedPrice({ targetValue, duration: 500 }),
        { initialProps: { targetValue: 100 } }
      );

      mockTime = 1000;
      act(() => {
        rerender({ targetValue: 200 });
      });

      mockTime = 1300;
      act(() => {
        flushAnimationFrames();
      });

      expect(result.current.isAnimating).toBe(true);

      mockTime = 1500;
      act(() => {
        flushAnimationFrames();
      });

      expect(result.current.value).toBe(200);
      expect(result.current.isAnimating).toBe(false);
    });
  });
});

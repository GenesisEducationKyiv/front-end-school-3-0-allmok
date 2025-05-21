import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import useDebounce from '../hooks/useDebounce';

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers(); 
  });

  afterEach(() => {
    vi.restoreAllMocks(); 
    vi.useRealTimers();
  });

  it('should return the initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 500));
    expect(result.current).toBe('initial');
  });

  it('should return the old value if delay has not passed', () => {
    const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
      initialProps: { value: 'first', delay: 500 },
    });

    expect(result.current).toBe('first');

    rerender({ value: 'second', delay: 500 });
    expect(result.current).toBe('first');

    act(() => {
       vi.advanceTimersByTime(300);
    });
    expect(result.current).toBe('first');
  });

  it('should return the new value after the delay has passed', () => {
    const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
      initialProps: { value: 'first', delay: 500 },
    });

    rerender({ value: 'second', delay: 500 });
    expect(result.current).toBe('first');

    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(result.current).toBe('second');
  });

   it('should only return the latest value after multiple rapid changes', () => {
    const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
      initialProps: { value: 'a', delay: 500 },
    });

    rerender({ value: 'b', delay: 500 });
     act(() => { vi.advanceTimersByTime(100); });
     rerender({ value: 'c', delay: 500 });
     act(() => { vi.advanceTimersByTime(100); });
     rerender({ value: 'd', delay: 500 });

     expect(result.current).toBe('a'); 

     act(() => {
       vi.advanceTimersByTime(500);
     });
     expect(result.current).toBe('d'); 
   });

    it('should handle changes in delay', () => {
        const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
          initialProps: { value: 'first', delay: 500 },
        });

        rerender({ value: 'second', delay: 1000 });

        act(() => { vi.advanceTimersByTime(500); }); 
        expect(result.current).toBe('first'); 

        act(() => { vi.advanceTimersByTime(500); }); 
        expect(result.current).toBe('second'); 
  });

});
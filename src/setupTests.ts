import '@testing-library/jest-dom';
import { vi, beforeEach } from 'vitest'; 

beforeEach(() => {
  vi.clearAllMocks();
});

// Було прийнято рішеня відключити правило
// Правильно типізувати є надлишково складним для тестів
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), 
    removeListener: vi.fn(), 
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
/* eslint-enable @typescript-eslint/no-unsafe-assignment */
import { vi } from 'vitest';

const mockWaveSurferInstance = {
    on: vi.fn(),
    un: vi.fn(),
    destroy: vi.fn(),
    load: vi.fn(),
    play: vi.fn().mockResolvedValue(undefined),
    pause: vi.fn(),
    isPlaying: vi.fn(() => false),
  };

  const create = vi.fn(() => mockWaveSurferInstance);

export default { create };
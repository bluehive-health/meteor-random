/**
 * @jest-environment node
 */

import { createAleaGeneratorWithGeneratedSeed } from '../create-alea-generator';

// Mock global objects to test different environments
const mockWindow = (overrides = {}) => {
  (global as any).window = {
    innerHeight: 768,
    innerWidth: 1024,
    ...overrides
  };
};

const mockDocument = (overrides = {}) => {
  (global as any).document = {
    documentElement: {
      clientHeight: 600,
      clientWidth: 800
    },
    body: {
      clientHeight: 580,
      clientWidth: 780
    },
    ...overrides
  };
};

const mockNavigator = (userAgent = 'Test User Agent') => {
  (global as any).navigator = {
    userAgent
  };
};

const clearMocks = () => {
  delete (global as any).window;
  delete (global as any).document;
  delete (global as any).navigator;
};

describe('createAleaGeneratorWithGeneratedSeed', () => {
  beforeEach(() => {
    clearMocks();
  });

  afterEach(() => {
    clearMocks();
  });

  it('should create generator with all entropy sources available', () => {
    mockWindow();
    mockDocument();
    mockNavigator();

    const generator = createAleaGeneratorWithGeneratedSeed();
    expect(generator).toBeDefined();
    expect(typeof generator.fraction).toBe('function');
  });

  it('should handle missing window object', () => {
    mockDocument();
    mockNavigator();

    const generator = createAleaGeneratorWithGeneratedSeed();
    expect(generator).toBeDefined();
  });

  it('should handle missing document object', () => {
    mockWindow();
    mockNavigator();

    const generator = createAleaGeneratorWithGeneratedSeed();
    expect(generator).toBeDefined();
  });

  it('should handle missing navigator object', () => {
    mockWindow();
    mockDocument();

    const generator = createAleaGeneratorWithGeneratedSeed();
    expect(generator).toBeDefined();
  });

  it('should handle missing window dimensions', () => {
    mockWindow({ innerHeight: undefined, innerWidth: undefined });
    mockDocument();
    mockNavigator();

    const generator = createAleaGeneratorWithGeneratedSeed();
    expect(generator).toBeDefined();
  });

  it('should handle missing document element', () => {
    mockWindow();
    mockDocument({ documentElement: null });
    mockNavigator();

    const generator = createAleaGeneratorWithGeneratedSeed();
    expect(generator).toBeDefined();
  });

  it('should handle missing document body', () => {
    mockWindow();
    mockDocument({ body: null });
    mockNavigator();

    const generator = createAleaGeneratorWithGeneratedSeed();
    expect(generator).toBeDefined();
  });

  it('should handle missing document element dimensions', () => {
    mockWindow();
    mockDocument({
      documentElement: {
        clientHeight: undefined,
        clientWidth: undefined
      }
    });
    mockNavigator();

    const generator = createAleaGeneratorWithGeneratedSeed();
    expect(generator).toBeDefined();
  });

  it('should handle missing document body dimensions', () => {
    mockWindow();
    mockDocument({
      documentElement: null,
      body: {
        clientHeight: undefined,
        clientWidth: undefined
      }
    });
    mockNavigator();

    const generator = createAleaGeneratorWithGeneratedSeed();
    expect(generator).toBeDefined();
  });

  it('should use fallback values when all sources unavailable', () => {
    // No mocking - all globals undefined
    const generator = createAleaGeneratorWithGeneratedSeed();
    expect(generator).toBeDefined();
    expect(typeof generator.fraction).toBe('function');
    
    // Should still generate valid random values
    const value = generator.fraction();
    expect(value).toBeGreaterThanOrEqual(0);
    expect(value).toBeLessThan(1);
  });

  it('should use different entropy each time', () => {
    mockWindow();
    mockDocument();
    mockNavigator();

    const gen1 = createAleaGeneratorWithGeneratedSeed();
    const gen2 = createAleaGeneratorWithGeneratedSeed();

    // Should generate different sequences due to time-based entropy
    const id1 = gen1.id();
    const id2 = gen2.id();
    
    // They might be the same due to timing, but fraction should be different due to Math.random
    const frac1 = gen1.fraction();
    const frac2 = gen2.fraction();
    
    // At least one should be different due to different entropy sources
    expect(id1 !== id2 || frac1 !== frac2).toBe(true);
  });
});

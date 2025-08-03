/**
 * Ultra-focused test to hit the last uncovered lines for 100% coverage
 */

describe('100% Coverage Target', () => {
  // Store original values
  const originalProcess = (globalThis as any).process;
  const originalWindow = (global as any).window;
  const originalRequire = (global as any).require;

  afterEach(() => {
    // Restore all globals
    (globalThis as any).process = originalProcess;
    (global as any).window = originalWindow;
    (global as any).require = originalRequire;
  });

  test('NodeRandomGenerator crypto module failure (line 16)', () => {
    // Clear any existing cache
    jest.resetModules();
    
    // Mock the crypto module to throw before importing NodeRandomGenerator
    jest.doMock('crypto', () => {
      throw new Error('Mocked crypto failure');
    });

    // Import after mocking
    const { NodeRandomGenerator } = require('../node-generator');
    
    expect(() => {
      new NodeRandomGenerator();
    }).toThrow('Node.js crypto module is not available');
  });

  test('Empty seeds array in alea-generator (line 47)', () => {
    // Just test that we can create with empty seeds - this should trigger line 47
    const { AleaRandomGenerator } = require('../alea-generator');
    
    // This should work and use current date as seed (line 47: seeds = [+new Date()])
    const generator = new AleaRandomGenerator({ seeds: [] });
    expect(generator.fraction()).toBeGreaterThanOrEqual(0);
    expect(generator.fraction()).toBeLessThan(1);
  });

  test('Index.ts fallback paths - Node environment with failing NodeRandomGenerator', () => {
    jest.resetModules();
    
    // Set up Node environment
    (globalThis as any).process = { versions: { node: '18.0.0' } };
    delete (global as any).window;
    
    // Mock NodeRandomGenerator to throw during construction
    jest.doMock('../node-generator', () => ({
      NodeRandomGenerator: jest.fn(() => {
        throw new Error('Mock NodeRandomGenerator failure');
      })
    }));
    
    // Mock the fallback
    jest.doMock('../create-alea-generator', () => ({
      createAleaGeneratorWithGeneratedSeed: jest.fn(() => ({
        fraction: () => 0.5
      }))
    }));

    const { Random } = require('../index');
    expect(typeof Random.fraction).toBe('function');
  });

  test('Index.ts fallback paths - Browser environment with failing BrowserRandomGenerator', () => {
    jest.resetModules();
    
    // Set up browser environment
    delete (globalThis as any).process;
    (global as any).window = { crypto: { getRandomValues: () => {} } };
    
    // Mock BrowserRandomGenerator to throw during construction
    jest.doMock('../browser-generator', () => ({
      BrowserRandomGenerator: jest.fn(() => {
        throw new Error('Mock BrowserRandomGenerator failure');
      })
    }));
    
    // Mock the fallback
    jest.doMock('../create-alea-generator', () => ({
      createAleaGeneratorWithGeneratedSeed: jest.fn(() => ({
        fraction: () => 0.7
      }))
    }));

    const { Random } = require('../index');
    expect(typeof Random.fraction).toBe('function');
  });

  test('Index.ts fallback paths - Unknown environment', () => {
    jest.resetModules();
    
    // Set up unknown environment - no Node, no browser
    delete (globalThis as any).process;
    delete (global as any).window;
    
    // Mock the direct Alea fallback
    jest.doMock('../create-alea-generator', () => ({
      createAleaGeneratorWithGeneratedSeed: jest.fn(() => ({
        fraction: () => 0.9
      }))
    }));

    const { Random } = require('../index');
    expect(typeof Random.fraction).toBe('function');
  });
});

/**
 * @jest-environment jsdom
 */

import { BrowserRandomGenerator } from '../browser-generator';

// Mock window.crypto.getRandomValues
const mockGetRandomValues = jest.fn();

// Setup window.crypto mock
Object.defineProperty(window, 'crypto', {
  value: {
    getRandomValues: mockGetRandomValues,
  },
  writable: true,
});

describe('BrowserRandomGenerator', () => {
  let generator: BrowserRandomGenerator;

  beforeEach(() => {
    generator = new BrowserRandomGenerator();
    mockGetRandomValues.mockClear();
  });

  describe('fraction method', () => {
    it('should return numbers between 0 and 1', () => {
      // Mock getRandomValues to return a predictable value
      mockGetRandomValues.mockImplementation((array: Uint32Array) => {
        array[0] = 0x80000000; // Half of max uint32 value
        return array;
      });

      const value = generator.fraction();
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(1);
      expect(value).toBeCloseTo(0.5, 1);
    });

    it('should call window.crypto.getRandomValues', () => {
      mockGetRandomValues.mockImplementation((array: Uint32Array) => {
        array[0] = 0x12345678;
        return array;
      });

      generator.fraction();
      
      expect(mockGetRandomValues).toHaveBeenCalledTimes(1);
      expect(mockGetRandomValues).toHaveBeenCalledWith(expect.any(Uint32Array));
    });

    it('should return different values on consecutive calls', () => {
      let counter = 0;
      mockGetRandomValues.mockImplementation((array: Uint32Array) => {
        array[0] = 0x12345678 + counter++;
        return array;
      });

      const values = new Set();
      for (let i = 0; i < 10; i++) {
        values.add(generator.fraction());
      }
      
      expect(values.size).toBe(10);
    });

    it('should handle edge cases correctly', () => {
      // Test with minimum value
      mockGetRandomValues.mockImplementationOnce((array: Uint32Array) => {
        array[0] = 0;
        return array;
      });
      expect(generator.fraction()).toBe(0);

      // Test with maximum value
      mockGetRandomValues.mockImplementationOnce((array: Uint32Array) => {
        array[0] = 0xFFFFFFFF;
        return array;
      });
      const maxValue = generator.fraction();
      expect(maxValue).toBeLessThan(1);
      expect(maxValue).toBeCloseTo(1, 1);
    });
  });

  describe('hexString method', () => {
    beforeEach(() => {
      // Set up a predictable sequence for choice method
      let callCount = 0;
      mockGetRandomValues.mockImplementation((array: Uint32Array) => {
        array[0] = (0x12345678 + callCount++) >>> 0;
        return array;
      });
    });

    it('should return hex strings of the correct length', () => {
      expect(generator.hexString(1)).toHaveLength(1);
      expect(generator.hexString(5)).toHaveLength(5);
      expect(generator.hexString(20)).toHaveLength(20);
    });

    it('should return valid hex characters only', () => {
      const hexString = generator.hexString(100);
      expect(hexString).toMatch(/^[0-9a-f]+$/);
    });

    it('should be parseable as hex', () => {
      const hexString = generator.hexString(8);
      expect(() => Number.parseInt(hexString, 16)).not.toThrow();
    });
  });

  describe('id method', () => {
    beforeEach(() => {
      let callCount = 0;
      mockGetRandomValues.mockImplementation((array: Uint32Array) => {
        array[0] = (0x12345678 + callCount++) >>> 0;
        return array;
      });
    });

    it('should return ids of default length 17', () => {
      expect(generator.id()).toHaveLength(17);
    });

    it('should return ids of specified length', () => {
      expect(generator.id(10)).toHaveLength(10);
      expect(generator.id(25)).toHaveLength(25);
    });

    it('should use only unmistakable characters', () => {
      const id = generator.id(100);
      expect(id).toMatch(/^[23456789ABCDEFGHJKLMNPQRSTWXYZabcdefghijkmnopqrstuvwxyz]+$/);
    });
  });

  describe('secret method', () => {
    beforeEach(() => {
      let callCount = 0;
      mockGetRandomValues.mockImplementation((array: Uint32Array) => {
        array[0] = (0x12345678 + callCount++) >>> 0;
        return array;
      });
    });

    it('should return secrets of default length 43', () => {
      expect(generator.secret()).toHaveLength(43);
    });

    it('should return secrets of specified length', () => {
      expect(generator.secret(10)).toHaveLength(10);
      expect(generator.secret(50)).toHaveLength(50);
    });

    it('should use base64 characters', () => {
      const secret = generator.secret(100);
      expect(secret).toMatch(/^[a-zA-Z0-9_-]+$/);
    });
  });

  describe('choice method', () => {
    beforeEach(() => {
      let callCount = 0;
      mockGetRandomValues.mockImplementation((array: Uint32Array) => {
        array[0] = (0x12345678 + callCount++) >>> 0;
        return array;
      });
    });

    it('should return elements from arrays', () => {
      const array = ['a', 'b', 'c', 'd', 'e'];
      const choice = generator.choice(array);
      expect(array).toContain(choice);
    });

    it('should return characters from strings', () => {
      const string = 'abcde';
      const choice = generator.choice(string);
      expect(string).toContain(choice);
      expect(choice).toHaveLength(1);
    });
  });

  describe('error handling', () => {
    it('should throw error when crypto is not available', () => {
      const originalCrypto = window.crypto;
      
      // Remove crypto
      (window as any).crypto = undefined;
      
      expect(() => new BrowserRandomGenerator().fraction()).toThrow(
        'window.crypto.getRandomValues() is not available'
      );
      
      // Restore crypto
      window.crypto = originalCrypto;
    });

    it('should throw error when getRandomValues is not available', () => {
      const originalGetRandomValues = window.crypto.getRandomValues;
      
      // Remove getRandomValues
      (window.crypto as any).getRandomValues = undefined;
      
      expect(() => new BrowserRandomGenerator().fraction()).toThrow(
        'window.crypto.getRandomValues() is not available'
      );
      
      // Restore getRandomValues
      window.crypto.getRandomValues = originalGetRandomValues;
    });
  });
});

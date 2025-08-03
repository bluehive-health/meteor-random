/**
 * @jest-environment node
 */

import { NodeRandomGenerator } from '../node-generator';

describe('NodeRandomGenerator', () => {
  let generator: NodeRandomGenerator;

  beforeEach(() => {
    generator = new NodeRandomGenerator();
  });

  describe('constructor', () => {
    it('should create successfully when crypto is available', () => {
      expect(() => new NodeRandomGenerator()).not.toThrow();
    });
  });

  describe('hexString method', () => {
    it('should return hex strings of the correct length', () => {
      expect(generator.hexString(1)).toHaveLength(1);
      expect(generator.hexString(8)).toHaveLength(8);
      expect(generator.hexString(4)).toHaveLength(4);
    });

    it('should return valid hex characters only', () => {
      const hexString = generator.hexString(16);
      expect(hexString).toMatch(/^[0-9a-f]+$/);
    });

    it('should be parseable as hex', () => {
      const hexString = generator.hexString(8);
      expect(() => Number.parseInt(hexString, 16)).not.toThrow();
      expect(Number.parseInt(hexString, 16)).toBeGreaterThanOrEqual(0);
    });
  });

  describe('fraction method', () => {
    it('should return numbers between 0 and 1', () => {
      const value = generator.fraction();
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(1);
    });

    it('should return different values on consecutive calls', () => {
      const values = new Set();
      for (let i = 0; i < 10; i++) {
        values.add(generator.fraction());
      }
      
      expect(values.size).toBe(10);
    });
  });

  describe('id method', () => {
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

    it('should return undefined for empty arrays', () => {
      const choice = generator.choice([]);
      expect(choice).toBeUndefined();
    });

    it('should return empty string for empty strings', () => {
      const choice = generator.choice('');
      expect(choice).toBe('');
    });
  });
});

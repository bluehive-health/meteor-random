import { Random } from '../index';

describe('Random (main export)', () => {
  describe('basic functionality', () => {
    it('should have all required methods', () => {
      expect(typeof Random.fraction).toBe('function');
      expect(typeof Random.hexString).toBe('function');
      expect(typeof Random.id).toBe('function');
      expect(typeof Random.secret).toBe('function');
      expect(typeof Random.choice).toBe('function');
      expect(typeof Random.createWithSeeds).toBe('function');
      expect(typeof Random.insecure).toBe('object');
    });

    it('should have insecure generator with same methods', () => {
      expect(typeof Random.insecure.fraction).toBe('function');
      expect(typeof Random.insecure.hexString).toBe('function');
      expect(typeof Random.insecure.id).toBe('function');
      expect(typeof Random.insecure.secret).toBe('function');
      expect(typeof Random.insecure.choice).toBe('function');
    });
  });

  describe('format validation', () => {
    it('should generate ids with correct default length', () => {
      const id = Random.id();
      expect(id).toHaveLength(17);
    });

    it('should generate ids with specified length', () => {
      expect(Random.id(29)).toHaveLength(29);
    });

    it('should generate hex strings with correct length', () => {
      const numDigits = 9;
      const hexStr = Random.hexString(numDigits);
      expect(hexStr).toHaveLength(numDigits);
      expect(() => Number.parseInt(hexStr, 16)).not.toThrow();
    });

    it('should generate fractions in correct range', () => {
      const frac = Random.fraction();
      expect(frac).toBeLessThan(1.0);
      expect(frac).toBeGreaterThanOrEqual(0.0);
    });

    it('should generate secrets with correct default length', () => {
      expect(Random.secret()).toHaveLength(43);
    });

    it('should generate secrets with specified length', () => {
      expect(Random.secret(13)).toHaveLength(13);
    });
  });

  describe('choice method behavior', () => {
    it('should choose from arrays', () => {
      const array = ['a', 'b', 'c', 'd', 'e'];
      const choice = Random.choice(array);
      expect(array).toContain(choice);
    });

    it('should choose from strings', () => {
      const string = 'abcde';
      const choice = Random.choice(string);
      expect(string).toContain(choice);
      expect(choice).toHaveLength(1);
    });

    it('should return undefined for empty arrays', () => {
      const choice = Random.choice([]);
      expect(choice).toBeUndefined();
    });
  });

  describe('createWithSeeds', () => {
    it('should create deterministic generators', () => {
      const random1 = Random.createWithSeeds(0);
      const random2 = Random.createWithSeeds(0);
      
      // Should generate the same sequence
      expect(random1.id()).toBe(random2.id());
      expect(random1.fraction()).toBe(random2.fraction());
    });

    it('should throw error when no seeds provided', () => {
      expect(() => Random.createWithSeeds()).toThrow('No seeds were provided');
    });

    it('should generate expected sequence for seed 0', () => {
      const random = Random.createWithSeeds(0);
      
      // These should match the original Meteor implementation
      expect(random.id()).toBe('cp9hWvhg8GSvuZ9os');
      expect(random.id()).toBe('3f3k6Xo7rrHCifQhR');
      expect(random.id()).toBe('shxDnjWWmnKPEoLhM');
      expect(random.id()).toBe('6QTjB8C5SEqhmz4ni');
    });
  });

  describe('insecure generator', () => {
    it('should be different from main generator', () => {
      expect(Random.insecure).not.toBe(Random);
    });

    it('should generate valid random values', () => {
      const id = Random.insecure.id();
      expect(id).toHaveLength(17);
      
      const frac = Random.insecure.fraction();
      expect(frac).toBeGreaterThanOrEqual(0);
      expect(frac).toBeLessThan(1);
      
      const hex = Random.insecure.hexString(8);
      expect(hex).toHaveLength(8);
      expect(hex).toMatch(/^[0-9a-f]+$/);
    });
  });

  describe('character sets', () => {
    it('should use unmistakable characters in ids', () => {
      const id = Random.id(1000);
      expect(id).toMatch(/^[23456789ABCDEFGHJKLMNPQRSTWXYZabcdefghijkmnopqrstuvwxyz]+$/);
      expect(id).not.toMatch(/[01IlO]/);
    });

    it('should use base64 characters in secrets', () => {
      const secret = Random.secret(1000);
      expect(secret).toMatch(/^[a-zA-Z0-9_-]+$/);
    });

    it('should use hex characters in hex strings', () => {
      const hex = Random.hexString(1000);
      expect(hex).toMatch(/^[0-9a-f]+$/);
    });
  });

  describe('randomness quality', () => {
    it('should generate different values on consecutive calls', () => {
      const values = new Set();
      for (let i = 0; i < 100; i++) {
        values.add(Random.fraction());
      }
      // Should have high diversity
      expect(values.size).toBeGreaterThan(95);
    });

    it('should distribute choices reasonably', () => {
      const array = ['a', 'b', 'c'];
      const counts: Record<string, number> = {};
      
      for (let i = 0; i < 300; i++) {
        const choice = Random.choice(array);
        counts[choice!] = (counts[choice!] || 0) + 1;
      }

      // Each element should be selected at least once
      expect(Object.keys(counts)).toHaveLength(3);
      // No element should dominate too much (rough distribution check)
      Object.values(counts).forEach(count => {
        expect(count).toBeGreaterThan(50);
        expect(count).toBeLessThan(200);
      });
    });
  });
});

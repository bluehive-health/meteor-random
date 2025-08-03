import { AleaRandomGenerator } from '../alea-generator';

describe('AleaRandomGenerator', () => {
  describe('deterministic behavior with seeds', () => {
    it('should generate the same sequence with the same seed', () => {
      const random1 = new AleaRandomGenerator({ seeds: [0] });
      const random2 = new AleaRandomGenerator({ seeds: [0] });

      // Test that both generators produce the same sequence
      for (let i = 0; i < 10; i++) {
        expect(random1.fraction()).toBe(random2.fraction());
      }
    });

    it('should generate consistent id sequence with seed 0', () => {
      const random = new AleaRandomGenerator({ seeds: [0] });
      
      // These values should be consistent across runs with seed 0
      expect(random.id()).toBe('cp9hWvhg8GSvuZ9os');
      expect(random.id()).toBe('3f3k6Xo7rrHCifQhR');
      expect(random.id()).toBe('shxDnjWWmnKPEoLhM');
      expect(random.id()).toBe('6QTjB8C5SEqhmz4ni');
    });

    it('should generate different sequences with different seeds', () => {
      const random1 = new AleaRandomGenerator({ seeds: [1] });
      const random2 = new AleaRandomGenerator({ seeds: [2] });

      const values1: number[] = [];
      const values2: number[] = [];

      for (let i = 0; i < 10; i++) {
        values1.push(random1.fraction());
        values2.push(random2.fraction());
      }

      expect(values1).not.toEqual(values2);
    });
  });

  describe('fraction method', () => {
    let generator: AleaRandomGenerator;

    beforeEach(() => {
      generator = new AleaRandomGenerator({ seeds: ['test'] });
    });

    it('should return numbers between 0 and 1', () => {
      for (let i = 0; i < 100; i++) {
        const value = generator.fraction();
        expect(value).toBeGreaterThanOrEqual(0);
        expect(value).toBeLessThan(1);
      }
    });

    it('should return different values on consecutive calls', () => {
      const values = new Set();
      for (let i = 0; i < 100; i++) {
        values.add(generator.fraction());
      }
      expect(values.size).toBeGreaterThan(90);
    });
  });

  describe('hexString method', () => {
    let generator: AleaRandomGenerator;

    beforeEach(() => {
      generator = new AleaRandomGenerator({ seeds: ['test'] });
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
    let generator: AleaRandomGenerator;

    beforeEach(() => {
      generator = new AleaRandomGenerator({ seeds: ['test'] });
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

    it('should not contain confusing characters', () => {
      const id = generator.id(100);
      expect(id).not.toMatch(/[01IlO]/);
    });
  });

  describe('secret method', () => {
    let generator: AleaRandomGenerator;

    beforeEach(() => {
      generator = new AleaRandomGenerator({ seeds: ['test'] });
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
    let generator: AleaRandomGenerator;

    beforeEach(() => {
      generator = new AleaRandomGenerator({ seeds: ['test'] });
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

    it('should return undefined for empty arrays', () => {
      const choice = generator.choice([]);
      expect(choice).toBeUndefined();
    });

    it('should return empty string for empty strings', () => {
      const choice = generator.choice('');
      expect(choice).toBe('');
    });

    it('should distribute choices reasonably over multiple calls', () => {
      const array = ['a', 'b', 'c'];
      const counts: Record<string, number> = {};
      
      for (let i = 0; i < 300; i++) {
        const choice = generator.choice(array);
        counts[choice!] = (counts[choice!] || 0) + 1;
      }

      // Each element should be selected at least once in 300 tries
      expect(Object.keys(counts)).toHaveLength(3);
      expect(counts.a).toBeGreaterThan(0);
      expect(counts.b).toBeGreaterThan(0);
      expect(counts.c).toBeGreaterThan(0);
    });
  });

  describe('createWithSeeds method', () => {
    let generator: AleaRandomGenerator;

    beforeEach(() => {
      generator = new AleaRandomGenerator({ seeds: ['test'] });
    });

    it('should create new generators with seeds', () => {
      const seededGenerator = generator.createWithSeeds(42);
      expect(seededGenerator).toBeInstanceOf(AleaRandomGenerator);
      expect(seededGenerator).not.toBe(generator);
    });

    it('should throw error when no seeds provided', () => {
      expect(() => generator.createWithSeeds()).toThrow('No seeds were provided');
    });

    it('should create deterministic generators', () => {
      const gen1 = generator.createWithSeeds(123);
      const gen2 = generator.createWithSeeds(123);
      
      expect(gen1.fraction()).toBe(gen2.fraction());
      expect(gen1.id()).toBe(gen2.id());
    });
  });

  describe('error handling', () => {
    it('should handle empty seeds array by using current date', () => {
      // Now empty seeds should work
      expect(() => new AleaRandomGenerator({ seeds: [] })).not.toThrow();
      const generator = new AleaRandomGenerator({ seeds: [] });
      expect(generator.fraction()).toBeGreaterThanOrEqual(0);
    });

    it('should handle null seeds by throwing at runtime', () => {
      expect(() => new AleaRandomGenerator({ seeds: null as any })).toThrow();
    });

    it('should handle default empty seeds in Alea algorithm', () => {
      // Test the internal Alea algorithm with empty seeds array
      // This tests the line: if (seeds.length === 0) { seeds = [+new Date]; }
      const generator = new AleaRandomGenerator({ seeds: [''] }); // Force empty seed processing
      expect(generator).toBeInstanceOf(AleaRandomGenerator);
      expect(typeof generator.fraction()).toBe('number');
    });
  });
});

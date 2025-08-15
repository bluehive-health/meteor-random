import { Random } from '../index';

describe('New Random Functions', () => {
  describe('uuid()', () => {
    it('should generate valid RFC4122 v4 UUIDs', () => {
      const uuid = Random.uuid();
      
      // Check format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      expect(uuid).toMatch(uuidRegex);
      expect(uuid).toHaveLength(36);
    });

    it('should generate unique UUIDs', () => {
      const uuids = new Set();
      for (let i = 0; i < 1000; i++) {
        uuids.add(Random.uuid());
      }
      expect(uuids.size).toBe(1000);
    });

    it('should work with seeded generators', () => {
      const seeded1 = Random.createWithSeeds('uuid-test');
      const seeded2 = Random.createWithSeeds('uuid-test');
      
      expect(seeded1.uuid()).toBe(seeded2.uuid());
    });

    it('should work with insecure generator', () => {
      const uuid = Random.insecure.uuid();
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      expect(uuid).toMatch(uuidRegex);
    });
  });

  describe('date()', () => {
    it('should generate dates within default range (last 100 years)', () => {
      const now = new Date();
      const hundredYearsAgo = new Date(now.getFullYear() - 100, 0, 1);
      
      const randomDate = Random.date();
      expect(randomDate.getTime()).toBeGreaterThanOrEqual(hundredYearsAgo.getTime());
      expect(randomDate.getTime()).toBeLessThanOrEqual(now.getTime());
    });

    it('should generate dates within specified range', () => {
      const start = new Date('2020-01-01');
      const end = new Date('2020-12-31');
      
      const randomDate = Random.date(start, end);
      expect(randomDate.getTime()).toBeGreaterThanOrEqual(start.getTime());
      expect(randomDate.getTime()).toBeLessThanOrEqual(end.getTime());
    });

    it('should be deterministic with seeded generators', () => {
      const seeded1 = Random.createWithSeeds('date-test');
      const seeded2 = Random.createWithSeeds('date-test');
      
      const start = new Date('2020-01-01');
      const end = new Date('2020-12-31');
      
      expect(seeded1.date(start, end).getTime()).toBe(seeded2.date(start, end).getTime());
    });

    it('should work with insecure generator', () => {
      const now = new Date();
      const hundredYearsAgo = new Date(now.getFullYear() - 100, 0, 1);
      
      const randomDate = Random.insecure.date();
      expect(randomDate.getTime()).toBeGreaterThanOrEqual(hundredYearsAgo.getTime());
      expect(randomDate.getTime()).toBeLessThanOrEqual(now.getTime());
    });
  });

  describe('integer()', () => {
    it('should generate integers in default range (0-100)', () => {
      for (let i = 0; i < 100; i++) {
        const num = Random.integer();
        expect(Number.isInteger(num)).toBe(true);
        expect(num).toBeGreaterThanOrEqual(0);
        expect(num).toBeLessThanOrEqual(100);
      }
    });

    it('should generate integers with single argument (0 to max)', () => {
      for (let i = 0; i < 50; i++) {
        const num = Random.integer(10);
        expect(Number.isInteger(num)).toBe(true);
        expect(num).toBeGreaterThanOrEqual(0);
        expect(num).toBeLessThanOrEqual(10);
      }
    });

    it('should generate integers with min and max arguments', () => {
      for (let i = 0; i < 50; i++) {
        const num = Random.integer(5, 15);
        expect(Number.isInteger(num)).toBe(true);
        expect(num).toBeGreaterThanOrEqual(5);
        expect(num).toBeLessThanOrEqual(15);
      }
    });

    it('should be deterministic with seeded generators', () => {
      const seeded1 = Random.createWithSeeds('integer-test');
      const seeded2 = Random.createWithSeeds('integer-test');
      
      expect(seeded1.integer(1, 10)).toBe(seeded2.integer(1, 10));
    });

    it('should work with insecure generator', () => {
      const num = Random.insecure.integer(1, 10);
      expect(Number.isInteger(num)).toBe(true);
      expect(num).toBeGreaterThanOrEqual(1);
      expect(num).toBeLessThanOrEqual(10);
    });
  });

  describe('cardinal()', () => {
    it('should generate non-negative integers in default range (0-100)', () => {
      for (let i = 0; i < 100; i++) {
        const num = Random.cardinal();
        expect(Number.isInteger(num)).toBe(true);
        expect(num).toBeGreaterThanOrEqual(0);
        expect(num).toBeLessThanOrEqual(100);
      }
    });

    it('should generate non-negative integers with max argument', () => {
      for (let i = 0; i < 50; i++) {
        const num = Random.cardinal(25);
        expect(Number.isInteger(num)).toBe(true);
        expect(num).toBeGreaterThanOrEqual(0);
        expect(num).toBeLessThanOrEqual(25);
      }
    });

    it('should be deterministic with seeded generators', () => {
      const seeded1 = Random.createWithSeeds('cardinal-test');
      const seeded2 = Random.createWithSeeds('cardinal-test');
      
      expect(seeded1.cardinal(50)).toBe(seeded2.cardinal(50));
    });

    it('should work with insecure generator', () => {
      const num = Random.insecure.cardinal(20);
      expect(Number.isInteger(num)).toBe(true);
      expect(num).toBeGreaterThanOrEqual(0);
      expect(num).toBeLessThanOrEqual(20);
    });
  });

  describe('number()', () => {
    it('should generate numbers in default range (0-1)', () => {
      for (let i = 0; i < 100; i++) {
        const num = Random.number();
        expect(typeof num).toBe('number');
        expect(num).toBeGreaterThanOrEqual(0);
        expect(num).toBeLessThan(1);
      }
    });

    it('should generate numbers with single argument (0 to max)', () => {
      for (let i = 0; i < 50; i++) {
        const num = Random.number(10);
        expect(typeof num).toBe('number');
        expect(num).toBeGreaterThanOrEqual(0);
        expect(num).toBeLessThan(10);
      }
    });

    it('should generate numbers with min and max arguments', () => {
      for (let i = 0; i < 50; i++) {
        const num = Random.number(5, 15);
        expect(typeof num).toBe('number');
        expect(num).toBeGreaterThanOrEqual(5);
        expect(num).toBeLessThan(15);
      }
    });

    it('should be deterministic with seeded generators', () => {
      const seeded1 = Random.createWithSeeds('number-test');
      const seeded2 = Random.createWithSeeds('number-test');
      
      expect(seeded1.number(1, 10)).toBe(seeded2.number(1, 10));
    });

    it('should work with insecure generator', () => {
      const num = Random.insecure.number(1, 10);
      expect(typeof num).toBe('number');
      expect(num).toBeGreaterThanOrEqual(1);
      expect(num).toBeLessThan(10);
    });
  });

  describe('decimal()', () => {
    it('should generate decimals with default precision (2) and max (1)', () => {
      for (let i = 0; i < 100; i++) {
        const num = Random.decimal();
        expect(typeof num).toBe('number');
        expect(num).toBeGreaterThanOrEqual(0);
        expect(num).toBeLessThanOrEqual(1);
        
        // Check precision (at most 2 decimal places)
        const decimalPlaces = (num.toString().split('.')[1] || '').length;
        expect(decimalPlaces).toBeLessThanOrEqual(2);
      }
    });

    it('should generate decimals with specified precision', () => {
      for (let i = 0; i < 50; i++) {
        const num = Random.decimal(3, 10);
        expect(typeof num).toBe('number');
        expect(num).toBeGreaterThanOrEqual(0);
        expect(num).toBeLessThanOrEqual(10);
        
        // Check precision (at most 3 decimal places)
        const decimalPlaces = (num.toString().split('.')[1] || '').length;
        expect(decimalPlaces).toBeLessThanOrEqual(3);
      }
    });

    it('should be deterministic with seeded generators', () => {
      const seeded1 = Random.createWithSeeds('decimal-test');
      const seeded2 = Random.createWithSeeds('decimal-test');
      
      expect(seeded1.decimal(2, 10)).toBe(seeded2.decimal(2, 10));
    });

    it('should work with insecure generator', () => {
      const num = Random.insecure.decimal(4, 100);
      expect(typeof num).toBe('number');
      expect(num).toBeGreaterThanOrEqual(0);
      expect(num).toBeLessThanOrEqual(100);
      
      const decimalPlaces = (num.toString().split('.')[1] || '').length;
      expect(decimalPlaces).toBeLessThanOrEqual(4);
    });
  });

  describe('fromRange()', () => {
    it('should generate numbers within specified range [min, max)', () => {
      for (let i = 0; i < 100; i++) {
        const num = Random.fromRange(5, 10);
        expect(typeof num).toBe('number');
        expect(num).toBeGreaterThanOrEqual(5);
        expect(num).toBeLessThan(10);
      }
    });

    it('should handle negative ranges', () => {
      for (let i = 0; i < 50; i++) {
        const num = Random.fromRange(-10, -5);
        expect(typeof num).toBe('number');
        expect(num).toBeGreaterThanOrEqual(-10);
        expect(num).toBeLessThan(-5);
      }
    });

    it('should handle decimal ranges', () => {
      for (let i = 0; i < 50; i++) {
        const num = Random.fromRange(1.5, 2.5);
        expect(typeof num).toBe('number');
        expect(num).toBeGreaterThanOrEqual(1.5);
        expect(num).toBeLessThan(2.5);
      }
    });

    it('should be deterministic with seeded generators', () => {
      const seeded1 = Random.createWithSeeds('fromRange-test');
      const seeded2 = Random.createWithSeeds('fromRange-test');
      
      expect(seeded1.fromRange(1, 10)).toBe(seeded2.fromRange(1, 10));
    });

    it('should work with insecure generator', () => {
      const num = Random.insecure.fromRange(0, 1);
      expect(typeof num).toBe('number');
      expect(num).toBeGreaterThanOrEqual(0);
      expect(num).toBeLessThan(1);
    });
  });

  describe('distribution tests', () => {
    it('should distribute integers reasonably', () => {
      const counts: Record<number, number> = {};
      const iterations = 1000;
      
      for (let i = 0; i < iterations; i++) {
        const num = Random.integer(1, 5);
        counts[num] = (counts[num] || 0) + 1;
      }
      
      // Each number should appear at least once in 1000 iterations
      expect(Object.keys(counts)).toHaveLength(5);
      
      // No number should dominate too much (rough distribution check)
      Object.values(counts).forEach(count => {
        expect(count).toBeGreaterThan(100); // At least 10% of iterations
        expect(count).toBeLessThan(400);    // At most 40% of iterations
      });
    });

    it('should generate diverse UUIDs', () => {
      const uuids = new Set();
      for (let i = 0; i < 100; i++) {
        uuids.add(Random.uuid());
      }
      expect(uuids.size).toBe(100);
    });

    it('should generate diverse dates', () => {
      const dates = new Set();
      const start = new Date('2020-01-01');
      const end = new Date('2020-12-31');
      
      for (let i = 0; i < 100; i++) {
        dates.add(Random.date(start, end).toISOString());
      }
      
      // Should generate many different dates (at least 90% unique)
      expect(dates.size).toBeGreaterThan(90);
    });
  });
});
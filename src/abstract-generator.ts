/**
 * Random number generator and utilities
 * 
 * We use cryptographically strong PRNGs (crypto.getRandomBytes() on the server,
 * window.crypto.getRandomValues() in the browser) when available. If these
 * PRNGs fail, we fall back to the Alea PRNG, which is not cryptographically
 * strong, and we seed it with various sources such as the date, Math.random,
 * and window size on the client. When using crypto.getRandomValues(), our
 * primitive is hexString(), from which we construct fraction(). When using
 * window.crypto.getRandomValues() or alea, the primitive is fraction and we use
 * that to construct hex string.
 */

const UNMISTAKABLE_CHARS = '23456789ABCDEFGHJKLMNPQRSTWXYZabcdefghijkmnopqrstuvwxyz';
const BASE64_CHARS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ' +
  '0123456789-_';

export interface RandomGenerator {
  /**
   * Return a number between 0 and 1, like `Math.random`.
   */
  fraction(): number;

  /**
   * Return a random string of `n` hexadecimal digits.
   */
  hexString(digits: number): string;

  /**
   * Return a unique identifier, such as `"Jjwjg6gouWLXhMGKW"`, that is
   * likely to be unique in the whole world.
   */
  id(charsCount?: number): string;

  /**
   * Return a random string of printable characters with 6 bits of
   * entropy per character. Use `Random.secret` for security-critical secrets
   * that are intended for machine, rather than human, consumption.
   */
  secret(charsCount?: number): string;

  /**
   * Return a random element of the given array or string.
   */
  choice<T>(arrayOrString: T[]): T | undefined;
  choice(arrayOrString: string): string;
  choice<T>(arrayOrString: T[] | string): T | string | undefined;

  /**
   * Return a random RFC4122 version 4 UUID.
   */
  uuid(): string;

  /**
   * Return a random date between the given start and end dates.
   * If no dates are provided, returns a date within the last 100 years.
   */
  date(startDate?: Date, endDate?: Date): Date;

  /**
   * Return a random integer between min and max (inclusive).
   * If only one argument is provided, returns integer between 0 and that number.
   * If no arguments are provided, returns integer between 0 and 100.
   */
  integer(min?: number, max?: number): number;

  /**
   * Return a random cardinal (non-negative integer).
   * Equivalent to integer(0, max) where max defaults to 100.
   */
  cardinal(max?: number): number;

  /**
   * Return a random floating point number between min and max.
   * If only one argument is provided, returns number between 0 and that number.
   * If no arguments are provided, returns number between 0 and 1.
   */
  number(min?: number, max?: number): number;

  /**
   * Return a random decimal number with specified precision.
   * Returns a number between 0 and max with the given number of decimal places.
   */
  decimal(precision?: number, max?: number): number;

  /**
   * Return a random number within the specified range [min, max).
   */
  fromRange(min: number, max: number): number;

  /**
   * Create a non-cryptographically secure PRNG with given seeds (using the Alea algorithm)
   */
  createWithSeeds(...seeds: unknown[]): RandomGenerator;

  /**
   * A non-cryptographically secure but fast random generator
   */
  insecure: RandomGenerator;
}

/**
 * Abstract base class for random number generators
 */
export abstract class AbstractRandomGenerator implements RandomGenerator {
  public insecure!: RandomGenerator;

  /**
   * Return a number between 0 and 1, like `Math.random`.
   */
  abstract fraction(): number;

  /**
   * Return a random string of `n` hexadecimal digits.
   */
  hexString(digits: number): string {
    return this._randomString(digits, '0123456789abcdef');
  }

  private _randomString(charsCount: number, alphabet: string): string {
    let result = '';
    for (let i = 0; i < charsCount; i++) {
      result += this.choice(alphabet);
    }
    return result;
  }

  /**
   * Return a unique identifier, such as `"Jjwjg6gouWLXhMGKW"`, that is
   * likely to be unique in the whole world.
   */
  id(charsCount?: number): string {
    // 17 characters is around 96 bits of entropy, which is the amount of
    // state in the Alea PRNG.
    if (charsCount === undefined) {
      charsCount = 17;
    }

    return this._randomString(charsCount, UNMISTAKABLE_CHARS);
  }

  /**
   * Return a random string of printable characters with 6 bits of
   * entropy per character. Use `Random.secret` for security-critical secrets
   * that are intended for machine, rather than human, consumption.
   */
  secret(charsCount?: number): string {
    // Default to 256 bits of entropy, or 43 characters at 6 bits per
    // character.
    if (charsCount === undefined) {
      charsCount = 43;
    }

    return this._randomString(charsCount, BASE64_CHARS);
  }

  /**
   * Return a random element of the given array or string.
   */
  choice<T>(arrayOrString: T[]): T | undefined;
  choice(arrayOrString: string): string;
  choice<T>(arrayOrString: T[] | string): T | string | undefined {
    const index = Math.floor(this.fraction() * arrayOrString.length);
    if (typeof arrayOrString === 'string') {
      return arrayOrString.substr(index, 1);
    }
    return arrayOrString[index];
  }

  /**
   * Return a random RFC4122 version 4 UUID.
   */
  uuid(): string {
    // Generate 16 random bytes
    const bytes: number[] = [];
    for (let i = 0; i < 16; i++) {
      bytes.push(Math.floor(this.fraction() * 256));
    }
    
    // Set version (4) and variant bits according to RFC4122
    bytes[6] = (bytes[6] & 0x0f) | 0x40; // Version 4
    bytes[8] = (bytes[8] & 0x3f) | 0x80; // Variant bits
    
    // Convert to hex string with hyphens
    const hex = bytes.map(b => b.toString(16).padStart(2, '0')).join('');
    return [
      hex.substring(0, 8),
      hex.substring(8, 12),
      hex.substring(12, 16),
      hex.substring(16, 20),
      hex.substring(20, 32)
    ].join('-');
  }

  /**
   * Return a random date between the given start and end dates.
   * If no dates are provided, returns a date within the last 100 years.
   */
  date(startDate?: Date, endDate?: Date): Date {
    const now = new Date();
    const defaultStart = startDate || new Date(now.getFullYear() - 100, 0, 1);
    const defaultEnd = endDate || now;
    
    const startTime = defaultStart.getTime();
    const endTime = defaultEnd.getTime();
    const randomTime = startTime + this.fraction() * (endTime - startTime);
    
    return new Date(randomTime);
  }

  /**
   * Return a random integer between min and max (inclusive).
   * If only one argument is provided, returns integer between 0 and that number.
   * If no arguments are provided, returns integer between 0 and 100.
   */
  integer(min?: number, max?: number): number {
    let actualMin: number;
    let actualMax: number;
    
    if (min === undefined && max === undefined) {
      actualMin = 0;
      actualMax = 100;
    } else if (max === undefined) {
      actualMin = 0;
      actualMax = min!;
    } else {
      actualMin = min!;
      actualMax = max;
    }
    
    return Math.floor(this.fraction() * (actualMax - actualMin + 1)) + actualMin;
  }

  /**
   * Return a random cardinal (non-negative integer).
   * Equivalent to integer(0, max) where max defaults to 100.
   */
  cardinal(max?: number): number {
    return this.integer(0, max ?? 100);
  }

  /**
   * Return a random floating point number between min and max.
   * If only one argument is provided, returns number between 0 and that number.
   * If no arguments are provided, returns number between 0 and 1.
   */
  number(min?: number, max?: number): number {
    let actualMin: number;
    let actualMax: number;
    
    if (min === undefined && max === undefined) {
      return this.fraction();
    } else if (max === undefined) {
      actualMin = 0;
      actualMax = min!;
    } else {
      actualMin = min!;
      actualMax = max;
    }
    
    return actualMin + this.fraction() * (actualMax - actualMin);
  }

  /**
   * Return a random decimal number with specified precision.
   * Returns a number between 0 and max with the given number of decimal places.
   */
  decimal(precision?: number, max?: number): number {
    const actualPrecision = precision ?? 2;
    const actualMax = max ?? 1;
    const factor = Math.pow(10, actualPrecision);
    const randomValue = this.fraction() * actualMax;
    return Math.round(randomValue * factor) / factor;
  }

  /**
   * Return a random number within the specified range [min, max).
   */
  fromRange(min: number, max: number): number {
    return min + this.fraction() * (max - min);
  }

  /**
   * Create a non-cryptographically secure PRNG with given seeds (using the Alea algorithm)
   */
  createWithSeeds(...seeds: unknown[]): RandomGenerator {
    if (seeds.length === 0) {
      throw new Error('No seeds were provided');
    }
    // Import here to avoid circular dependency
    const { AleaRandomGenerator } = require('./alea-generator');
    return new AleaRandomGenerator({ seeds });
  }
}

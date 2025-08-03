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

import { AbstractRandomGenerator } from './abstract-generator';

/**
 * Node.js-based random number generator using crypto.randomBytes()
 * This provides cryptographically strong randomness on the server
 */
export class NodeRandomGenerator extends AbstractRandomGenerator {
  private crypto: typeof import('crypto');

  constructor() {
    super();
    // Dynamically import crypto to avoid issues in browser environments
    try {
      this.crypto = require('crypto');
    } catch {
      throw new Error('Node.js crypto module is not available');
    }
  }

  /**
   * Return a number between 0 and 1, like `Math.random`.
   * Uses crypto.randomBytes() for cryptographically strong randomness
   */
  fraction(): number {
    const numerator = Number.parseInt(this.hexString(8), 16);
    return numerator * 2.3283064365386963e-10; // 2^-32
  }

  /**
   * Return a random string of `n` hexadecimal digits.
   * Uses crypto.randomBytes() for cryptographically strong randomness
   */
  hexString(digits: number): string {
    const numBytes = Math.ceil(digits / 2);
    let bytes: Buffer;
    
    // Try to get cryptographically strong randomness. Fall back to
    // non-cryptographically strong if not available.
    try {
      bytes = this.crypto.randomBytes(numBytes);
    } catch {
      // XXX should re-throw any error except insufficient entropy
      // Note: crypto.pseudoRandomBytes was deprecated in Node.js, 
      // so we'll use randomBytes with a fallback to Math.random
      try {
        bytes = this.crypto.randomBytes(numBytes);
      } catch {
        // Ultimate fallback using Math.random (not cryptographically secure)
        const result = Array.from({ length: digits }, () => 
          Math.floor(Math.random() * 16).toString(16)
        ).join('');
        return result;
      }
    }
    
    const result = bytes.toString('hex');
    // If the number of digits is odd, we'll have generated an extra 4 bits
    // of randomness, so we need to trim the last digit.
    return result.substring(0, digits);
  }

  /**
   * Return a random RFC4122 version 4 UUID.
   * Uses crypto.randomUUID() when available (Node.js 15.6.0+) for optimal performance
   */
  uuid(): string {
    // Use native crypto.randomUUID() if available (Node.js 15.6.0+)
    if (this.crypto.randomUUID && typeof this.crypto.randomUUID === 'function') {
      try {
        return this.crypto.randomUUID();
      } catch {
        // Fall back to manual implementation if native UUID fails
      }
    }
    
    // Fall back to parent implementation
    return super.uuid();
  }
}

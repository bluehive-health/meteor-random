import { AbstractRandomGenerator } from './abstract-generator';

/**
 * Browser-based random number generator using window.crypto.getRandomValues()
 * This provides cryptographically strong randomness in modern browsers
 */
export class BrowserRandomGenerator extends AbstractRandomGenerator {
  /**
   * Return a number between 0 and 1, like `Math.random`.
   * Uses window.crypto.getRandomValues() for cryptographically strong randomness
   */
  fraction(): number {
    // Check if we're in a browser environment and crypto is available
    if (typeof window === 'undefined' || !window.crypto || !window.crypto.getRandomValues) {
      throw new Error('window.crypto.getRandomValues() is not available');
    }

    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    return array[0] * 2.3283064365386963e-10; // 2^-32
  }

  /**
   * Return a random RFC4122 version 4 UUID.
   * Uses crypto.randomUUID() when available for optimal performance
   */
  uuid(): string {
    // Check if we're in a browser environment and crypto is available
    if (typeof window !== 'undefined' && window.crypto && window.crypto.randomUUID) {
      try {
        return window.crypto.randomUUID();
      } catch {
        // Fall back to manual implementation if native UUID fails
      }
    }
    
    // Fall back to parent implementation
    return super.uuid();
  }
}

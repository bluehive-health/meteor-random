/**
 * @bluehive-health/random
 * 
 * Random number generator and utilities with cryptographically strong PRNGs
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

import { RandomGenerator } from './abstract-generator';
import { BrowserRandomGenerator } from './browser-generator';
import { NodeRandomGenerator } from './node-generator';
import { createAleaGeneratorWithGeneratedSeed } from './create-alea-generator';
import { createRandom } from './create-random';

// Environment detection
function isNode(): boolean {
  return typeof globalThis !== 'undefined' && 
         typeof (globalThis as Record<string, unknown>).process !== 'undefined' && 
         Boolean((globalThis as Record<string, unknown>).process) && 
         typeof (globalThis as Record<string, unknown>).process === 'object';
}

function isBrowser(): boolean {
  return typeof window !== 'undefined' && 
         typeof window.crypto !== 'undefined' &&
         typeof window.crypto.getRandomValues === 'function';
}

/**
 * Create the appropriate random generator based on the environment
 */
function createGenerator(): RandomGenerator {
  if (isNode()) {
    try {
      return new NodeRandomGenerator();
    } catch {
      // Fall back to Alea if Node crypto is not available
      return createAleaGeneratorWithGeneratedSeed();
    }
  } else if (isBrowser()) {
    try {
      return new BrowserRandomGenerator();
    } catch {
      // Fall back to Alea if browser crypto is not available
      return createAleaGeneratorWithGeneratedSeed();
    }
  } else {
    // Fallback environment - use Alea
    return createAleaGeneratorWithGeneratedSeed();
  }
}

// Create the main Random instance
const generator = createGenerator();
export const Random = createRandom(generator);

// Export types and classes for advanced usage
export { RandomGenerator } from './abstract-generator';
export { AbstractRandomGenerator } from './abstract-generator';
export { AleaRandomGenerator } from './alea-generator';
export { BrowserRandomGenerator } from './browser-generator';
export { NodeRandomGenerator } from './node-generator';
export { createRandom } from './create-random';
export { createAleaGeneratorWithGeneratedSeed } from './create-alea-generator';

// Default export
export default Random;

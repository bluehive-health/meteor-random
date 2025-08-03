import { AleaRandomGenerator } from './alea-generator';

/**
 * Create an Alea generator with automatically generated seeds
 * Heuristically collect entropy from various sources when a
 * cryptographic PRNG isn't available.
 */

// Client-side entropy sources
function getClientEntropy(): unknown[] {
  const height = (typeof window !== 'undefined' && window.innerHeight) ||
        (typeof document !== 'undefined' &&
         document.documentElement &&
         document.documentElement.clientHeight) ||
        (typeof document !== 'undefined' &&
         document.body &&
         document.body.clientHeight) ||
        1;

  const width = (typeof window !== 'undefined' && window.innerWidth) ||
        (typeof document !== 'undefined' &&
         document.documentElement &&
         document.documentElement.clientWidth) ||
        (typeof document !== 'undefined' &&
         document.body &&
         document.body.clientWidth) ||
        1;

  const agent = (typeof navigator !== 'undefined' && navigator.userAgent) || '';

  return [new Date(), height, width, agent, Math.random()];
}

/**
 * Create an Alea generator with automatically generated seeds
 */
export function createAleaGeneratorWithGeneratedSeed(): AleaRandomGenerator {
  return new AleaRandomGenerator({
    seeds: getClientEntropy(),
  });
}

import { RandomGenerator } from './abstract-generator';
import { AleaRandomGenerator } from './alea-generator';
import { createAleaGeneratorWithGeneratedSeed } from './create-alea-generator';

/**
 * Create a Random instance with enhanced functionality
 */
export function createRandom(generator: RandomGenerator): RandomGenerator {
  // Create a non-cryptographically secure PRNG with a given seed (using
  // the Alea algorithm)
  generator.createWithSeeds = (...seeds: any[]): RandomGenerator => {
    if (seeds.length === 0) {
      throw new Error('No seeds were provided');
    }
    return new AleaRandomGenerator({ seeds });
  };

  // Used like `Random`, but much faster and not cryptographically
  // secure
  generator.insecure = createAleaGeneratorWithGeneratedSeed();

  return generator;
}

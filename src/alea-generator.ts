import { AbstractRandomGenerator } from './abstract-generator';

/**
 * Alea PRNG implementation
 * See http://baagoe.org/en/wiki/Better_random_numbers_for_javascript
 * for a full discussion and Alea implementation.
 * 
 * This is not cryptographically strong but provides reproducible sequences.
 */

interface AleaFunction {
  (): number;
  uint32(): number;
  fract53(): number;
  version: string;
  args: unknown[];
}

function createAlea(seeds: unknown[]): AleaFunction {
  function Mash(): (data: unknown) => number {
    let n = 0xefc8249d;

    const mash = (data: unknown): number => {
      const dataStr = String(data);
      for (let i = 0; i < dataStr.length; i++) {
        n += dataStr.charCodeAt(i);
        let h = 0.02519603282416938 * n;
        n = h >>> 0;
        h -= n;
        h *= n;
        n = h >>> 0;
        h -= n;
        n += h * 0x100000000; // 2^32
      }
      return (n >>> 0) * 2.3283064365386963e-10; // 2^-32
    };

    return mash;
  }

  let s0 = 0;
  let s1 = 0;
  let s2 = 0;
  let c = 1;
  
  if (seeds.length === 0) {
    seeds = [+new Date()];
  }
  
  let mash = Mash();
  s0 = mash(' ');
  s1 = mash(' ');
  s2 = mash(' ');

  for (let i = 0; i < seeds.length; i++) {
    s0 -= mash(seeds[i]);
    if (s0 < 0) {
      s0 += 1;
    }
    s1 -= mash(seeds[i]);
    if (s1 < 0) {
      s1 += 1;
    }
    s2 -= mash(seeds[i]);
    if (s2 < 0) {
      s2 += 1;
    }
  }

  const random = (): number => {
    const t = (2091639 * s0) + (c * 2.3283064365386963e-10); // 2^-32
    s0 = s1;
    s1 = s2;
    return s2 = t - (c = t | 0);
  };

  const aleaFunction = random as AleaFunction;
  aleaFunction.uint32 = (): number => random() * 0x100000000; // 2^32
  aleaFunction.fract53 = (): number => random() +
        ((random() * 0x200000 | 0) * 1.1102230246251565e-16); // 2^-53

  aleaFunction.version = 'Alea 0.9';
  aleaFunction.args = seeds;
  
  return aleaFunction;
}

export interface AleaGeneratorOptions {
  seeds?: unknown[];
}

/**
 * Alea-based random number generator
 * Not cryptographically strong, but provides reproducible sequences
 */
export class AleaRandomGenerator extends AbstractRandomGenerator {
  private alea: AleaFunction;

  constructor(options: AleaGeneratorOptions = {}) {
    super();
    const { seeds = [] } = options;
    
    // Allow empty seeds array to test the internal fallback behavior
    this.alea = createAlea(seeds);
  }

  /**
   * Return a number between 0 and 1, like `Math.random`.
   */
  fraction(): number {
    return this.alea();
  }
}

// random-standalone.js - Standalone version of @bluehive/random for browser examples
// This is a simplified implementation for demonstration purposes

(function(global) {
    'use strict';

    const UNMISTAKABLE_CHARS = '23456789ABCDEFGHJKLMNPQRSTWXYZabcdefghijkmnopqrstuvwxyz';
    const BASE64_CHARS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_';

    class AbstractRandomGenerator {
        constructor() {
            this.insecure = new InsecureRandomGenerator();
        }

        fraction() {
            throw new Error('fraction() must be implemented by subclass');
        }

        hexString(digits) {
            return this._randomString(digits, '0123456789abcdef');
        }

        _randomString(charsCount, alphabet) {
            let result = '';
            for (let i = 0; i < charsCount; i++) {
                result += this.choice(alphabet);
            }
            return result;
        }

        id(charsCount = 17) {
            return this._randomString(charsCount, UNMISTAKABLE_CHARS);
        }

        secret(charsCount = 43) {
            return this._randomString(charsCount, BASE64_CHARS);
        }

        choice(arrayOrString) {
            const index = Math.floor(this.fraction() * arrayOrString.length);
            if (typeof arrayOrString === 'string') {
                return arrayOrString.substr(index, 1);
            }
            return arrayOrString[index];
        }

        createWithSeeds(...seeds) {
            if (seeds.length === 0) {
                throw new Error('No seeds were provided');
            }
            return new AleaRandomGenerator({ seeds });
        }
    }

    class BrowserRandomGenerator extends AbstractRandomGenerator {
        fraction() {
            if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
                const array = new Uint32Array(1);
                crypto.getRandomValues(array);
                return array[0] / (0xffffffff + 1);
            }
            // Fallback to Math.random if crypto is not available
            return Math.random();
        }
    }

    class InsecureRandomGenerator extends AbstractRandomGenerator {
        fraction() {
            return Math.random();
        }
    }

    class AleaRandomGenerator extends AbstractRandomGenerator {
        constructor(options = {}) {
            super();
            this.seeds = options.seeds || [];
            this._initializeState();
        }

        _initializeState() {
            // Simple hash function for seeds
            let seed = 0;
            for (const s of this.seeds) {
                const str = String(s);
                for (let i = 0; i < str.length; i++) {
                    seed = ((seed << 5) - seed + str.charCodeAt(i)) & 0xffffffff;
                }
            }
            
            // Initialize LCG state
            this._state = Math.abs(seed) || 1;
        }

        fraction() {
            // Simple Linear Congruential Generator
            this._state = (this._state * 1664525 + 1013904223) % Math.pow(2, 32);
            return this._state / Math.pow(2, 32);
        }
    }

    function createRandom(generator) {
        return {
            id: (charsCount) => generator.id(charsCount),
            secret: (charsCount) => generator.secret(charsCount),
            fraction: () => generator.fraction(),
            hexString: (digits) => generator.hexString(digits),
            choice: (arrayOrString) => generator.choice(arrayOrString),
            createWithSeeds: (...seeds) => {
                const aleaGen = generator.createWithSeeds(...seeds);
                return createRandom(aleaGen);
            },
            insecure: {
                id: (charsCount) => generator.insecure.id(charsCount),
                secret: (charsCount) => generator.insecure.secret(charsCount),
                fraction: () => generator.insecure.fraction(),
                hexString: (digits) => generator.insecure.hexString(digits),
                choice: (arrayOrString) => generator.insecure.choice(arrayOrString)
            }
        };
    }

    // Environment detection and setup
    function createGenerator() {
        if (typeof window !== 'undefined' && typeof window.crypto !== 'undefined') {
            try {
                return new BrowserRandomGenerator();
            } catch (e) {
                return new AleaRandomGenerator({ seeds: [Date.now(), Math.random()] });
            }
        } else {
            return new AleaRandomGenerator({ seeds: [Date.now(), Math.random()] });
        }
    }

    // Create and expose the Random object
    const generator = createGenerator();
    const Random = createRandom(generator);

    // Export for different module systems
    if (typeof module !== 'undefined' && module.exports) {
        // CommonJS
        module.exports = { Random };
        module.exports.Random = Random;
        module.exports.default = Random;
    } else if (typeof define === 'function' && define.amd) {
        // AMD
        define([], function() {
            return { Random: Random };
        });
    } else {
        // Browser global
        global.Random = Random;
        global.BlueHiveRandom = { Random: Random };
    }

})(typeof window !== 'undefined' ? window : this);

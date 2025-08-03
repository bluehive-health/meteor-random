/**
 * Example usage of @bluehive/random
 * 
 * This file demonstrates how to use the random number generator in various scenarios.
 */

const { Random } = require('./dist/index');

console.log('=== Basic Random Generation ===');

// Generate unique IDs
console.log('Random ID (default):', Random.id());
console.log('Random ID (10 chars):', Random.id(10));

// Generate secrets
console.log('Random secret (default):', Random.secret());
console.log('Random secret (20 chars):', Random.secret(20));

// Generate fractions
console.log('Random fraction:', Random.fraction());

// Generate hex strings
console.log('Random hex (8 chars):', Random.hexString(8));

// Make choices
const colors = ['red', 'green', 'blue', 'yellow', 'purple'];
console.log('Random color:', Random.choice(colors));
console.log('Random letter:', Random.choice('abcdefghijklmnop'));

console.log('\n=== Deterministic (Seeded) Generation ===');

// Create seeded generators for reproducible results
const seeded1 = Random.createWithSeeds(42);
const seeded2 = Random.createWithSeeds(42);

console.log('Seeded generator 1 - ID:', seeded1.id());
console.log('Seeded generator 2 - ID:', seeded2.id());
console.log('Both should be identical!');

console.log('Seeded generator 1 - Fraction:', seeded1.fraction());
console.log('Seeded generator 2 - Fraction:', seeded2.fraction());
console.log('Both should be identical!');

console.log('\n=== Fast Insecure Generation ===');

// Use the fast, non-cryptographic generator
console.log('Insecure ID:', Random.insecure.id());
console.log('Insecure fraction:', Random.insecure.fraction());
console.log('Insecure hex:', Random.insecure.hexString(16));

console.log('\n=== Multiple Seeded Generators ===');

// Different seeds produce different sequences
const gen1 = Random.createWithSeeds('seed1');
const gen2 = Random.createWithSeeds('seed2');
const gen3 = Random.createWithSeeds('seed1'); // Same as gen1

console.log('Generator 1 (seed1):', gen1.id());
console.log('Generator 2 (seed2):', gen2.id());
console.log('Generator 3 (seed1):', gen3.id());
console.log('Generators 1 and 3 should be identical!');

console.log('\n=== Testing Original Meteor Compatibility ===');

// Test the specific sequence that Meteor generates
const meteorCompatible = Random.createWithSeeds(0);
console.log('Meteor-compatible sequence with seed 0:');
console.log('  ID 1:', meteorCompatible.id()); // Should be 'cp9hWvhg8GSvuZ9os'
console.log('  ID 2:', meteorCompatible.id()); // Should be '3f3k6Xo7rrHCifQhR'
console.log('  ID 3:', meteorCompatible.id()); // Should be 'shxDnjWWmnKPEoLhM'
console.log('  ID 4:', meteorCompatible.id()); // Should be '6QTjB8C5SEqhmz4ni'

console.log('\n=== Character Set Validation ===');

// Validate character sets
const id = Random.id(1000);
const hasConfusingChars = /[01IlO]/.test(id);
console.log('ID contains confusing characters (0,1,I,l,O):', hasConfusingChars);

const secret = Random.secret(1000);
const isValidBase64 = /^[a-zA-Z0-9_-]+$/.test(secret);
console.log('Secret uses valid base64 characters:', isValidBase64);

const hex = Random.hexString(1000);
const isValidHex = /^[0-9a-f]+$/.test(hex);
console.log('Hex string uses valid hex characters:', isValidHex);

console.log('\n=== Performance Test ===');

console.time('Generate 1000 IDs (secure)');
for (let i = 0; i < 1000; i++) {
  Random.id();
}
console.timeEnd('Generate 1000 IDs (secure)');

console.time('Generate 1000 IDs (insecure)');
for (let i = 0; i < 1000; i++) {
  Random.insecure.id();
}
console.timeEnd('Generate 1000 IDs (insecure)');

console.log('\nExample completed successfully!');

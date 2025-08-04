# @bluehive/random

A TypeScript npm package for generating random numbers with cryptographically strong PRNGs. This is a port of the Meteor.js `random` package with full TypeScript support, comprehensive unit testing, and modern npm packaging.

[![npm version](https://badge.fury.io/js/%40bluehive-health%2Frandom.svg)](https://badge.fury.io/js/%40bluehive-health%2Frandom)
[![TypeScript](https://img.shields.io/badge/TypeScript-ready-blue.svg)](https://www.typescriptlang.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 📖 Documentation & Examples

🌐 **[Live Examples & Documentation](https://bluehive-health.github.io/meteor-random/)**

Interactive examples and complete API documentation are available at the link above.

## Features

- **Cryptographically Strong**: Uses `crypto.randomBytes()` on Node.js and `window.crypto.getRandomValues()` in browsers
- **Fallback Support**: Falls back to Alea PRNG when cryptographic randomness is not available
- **Cross-Platform**: Works in Node.js, browsers, and other JavaScript environments
- **TypeScript**: Full TypeScript support with complete type definitions
- **Deterministic Testing**: Supports seeded random generation for reproducible tests
- **Zero Dependencies**: No external runtime dependencies

## Installation

```bash
npm install @bluehive/random
```

> 💡 **Try it online!** Check out the [interactive examples and documentation](https://bluehive-health.github.io/meteor-random/) to see the library in action.

## Usage

### Basic Usage

```typescript
import { Random } from '@bluehive/random';

// Generate a unique identifier (default length: 17)
const id = Random.id(); // "Jjwjg6gouWLXhMGKW"

// Generate a unique identifier with custom length
const shortId = Random.id(10); // "3kRtz8fGd2"

// Generate a cryptographically secure secret (default length: 43)
const secret = Random.secret(); // "dWx8fQ_kNZ4..."

// Generate a secure secret with custom length
const shortSecret = Random.secret(20); // "mK3oT9qZ..."

// Generate a random number between 0 and 1
const fraction = Random.fraction(); // 0.7851294...

// Generate a random hex string
const hex = Random.hexString(8); // "a1b2c3d4"

// Choose a random element from an array
const colors = ['red', 'green', 'blue'];
const color = Random.choice(colors); // "green"

// Choose a random character from a string
const char = Random.choice('abcdef'); // "c"
```

### Seeded Random Generation (Deterministic)

For testing or when you need reproducible sequences:

```typescript
import { Random } from '@bluehive/random';

// Create a seeded generator for reproducible results
const seededRandom = Random.createWithSeeds(42);

// These will always produce the same sequence with seed 42
console.log(seededRandom.id()); // Always the same result
console.log(seededRandom.fraction()); // Always the same result

// Multiple seeds can be used
const multiSeeded = Random.createWithSeeds('test', 123, 'more-entropy');
```

### Fast Insecure Random (for non-cryptographic use)

When you need speed over security:

```typescript
import { Random } from '@bluehive/random';

// Use the fast, non-cryptographic generator
const fastId = Random.insecure.id();
const fastFraction = Random.insecure.fraction();
const fastHex = Random.insecure.hexString(16);
```

### Advanced Usage

For advanced use cases, you can directly instantiate specific generators:

```typescript
import { 
  NodeRandomGenerator, 
  BrowserRandomGenerator, 
  AleaRandomGenerator 
} from '@bluehive/random';

// Force Node.js crypto (server-side only)
const nodeGen = new NodeRandomGenerator();

// Force browser crypto (client-side only)
const browserGen = new BrowserRandomGenerator();

// Use Alea PRNG with specific seeds
const aleaGen = new AleaRandomGenerator({ seeds: ['custom', 'seeds'] });
```

## API Reference

### Random.id(n?)

Returns a unique identifier that is likely to be unique in the whole world.

- `n` (optional): Length of the identifier in characters (default: 17)
- Returns: String using characters that avoid confusion (excludes 0, 1, I, l, O)

### Random.secret(n?)

Returns a random string of printable characters with 6 bits of entropy per character. Use for security-critical secrets intended for machine consumption.

- `n` (optional): Length of the secret string (default: 43, which provides 256 bits of entropy)
- Returns: String using base64 characters (a-z, A-Z, 0-9, -, _)

### Random.fraction()

Returns a number between 0 and 1, like `Math.random()`.

- Returns: Number in the range [0, 1)

### Random.hexString(n)

Returns a random string of hexadecimal digits.

- `n`: Length of the hex string
- Returns: String of lowercase hex characters (0-9, a-f)

### Random.choice(arrayOrString)

Returns a random element from the given array or string.

- `arrayOrString`: Array or string to choose from
- Returns: Random element from array, or random character from string

### Random.createWithSeeds(...seeds)

Creates a deterministic random generator using the Alea algorithm.

- `...seeds`: One or more seed values (any type, will be converted to strings)
- Returns: New RandomGenerator instance that produces deterministic sequences

### Random.insecure

A pre-instantiated fast random generator that's not cryptographically secure but suitable for non-security-critical applications.

## Environment Detection

The package automatically detects the environment and uses the most appropriate random source:

1. **Node.js**: Uses `crypto.randomBytes()` for cryptographically strong randomness
2. **Modern Browsers**: Uses `window.crypto.getRandomValues()` for cryptographically strong randomness
3. **Fallback**: Uses Alea PRNG seeded with various entropy sources (date, Math.random, window dimensions, user agent)

## Character Sets

- **ID Generation**: Uses "unmistakable" characters: `23456789ABCDEFGHJKLMNPQRSTWXYZabcdefghijkmnopqrstuvwxyz`
  - Excludes: 0, 1, I, l, O (to avoid confusion)
- **Secret Generation**: Uses base64 characters: `abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_`
- **Hex Strings**: Uses lowercase hex: `0123456789abcdef`

## Testing

The package includes comprehensive tests covering all functionality:

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## Compatibility with Meteor Random

This package maintains API compatibility with Meteor's `random` package:

```typescript
// Meteor code
import { Random } from 'meteor/random';

// Equivalent with this package
import { Random } from '@bluehive/random';

// All the same methods work identically
const id = Random.id();
const seeded = Random.createWithSeeds(0);
```

The deterministic sequences generated by seeded generators are identical to those produced by Meteor's implementation.

## Security Considerations

- Use `Random.secret()` for cryptographically secure secrets
- Use `Random.id()` for unique identifiers that don't need to be secret
- Use `Random.createWithSeeds()` only for testing or when reproducibility is required
- The `Random.insecure` generator should not be used for security-critical applications

## License

MIT License. See [LICENSE](LICENSE) file for details.

## Migration from Meteor

If you're migrating from Meteor's `random` package:

1. Install this package: `npm install @bluehive/random`
2. Replace imports: `import { Random } from 'meteor/random'` → `import { Random } from '@bluehive/random'`
3. All existing code should work without changes

## Examples

For interactive examples and live demos, visit: **[https://bluehive-health.github.io/meteor-random/](https://bluehive-health.github.io/meteor-random/)**

## Development

```bash
# Clone and install dependencies
git clone https://github.com/bluehive-health/meteor-random.git
cd meteor-random
npm install

# Build TypeScript
npm run build

# Run tests
npm test

# Build and watch for changes
npm run dev
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
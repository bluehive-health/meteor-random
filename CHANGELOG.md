# @bluehive/random

## [1.0.0] - 2025-08-02

### Added
- Initial TypeScript port of Meteor.js random package
- Full TypeScript support with comprehensive type definitions
- Cross-platform support (Node.js, browsers, other JS environments)
- Cryptographically strong random number generation
- Fallback to Alea PRNG when crypto is not available
- Deterministic seeded random generation for testing
- Comprehensive test suite with 79 tests and full coverage
- Zero runtime dependencies
- API compatibility with Meteor's random package
- Character sets optimized for different use cases:
  - Unmistakable characters for IDs (no 0, 1, I, l, O)
  - Base64 characters for secrets
  - Lowercase hex for hex strings

### Features
- `Random.id(n?)` - Generate unique identifiers
- `Random.secret(n?)` - Generate cryptographically secure secrets
- `Random.fraction()` - Generate numbers between 0 and 1
- `Random.hexString(n)` - Generate hex strings
- `Random.choice(arrayOrString)` - Choose random elements
- `Random.createWithSeeds(...seeds)` - Create deterministic generators
- `Random.insecure` - Fast non-cryptographic generator
- Environment detection and automatic fallback
- Full compatibility with original Meteor implementation

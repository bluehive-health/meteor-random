# @bluehive/random - Copilot Instructions

@bluehive/random is a TypeScript npm package providing cryptographically strong random number generation. It's a complete port of Meteor.js random package with full TypeScript support, comprehensive testing, and modern npm packaging that outputs multiple formats (CommonJS, ESM, UMD).

**Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.**

## Working Effectively

### Bootstrap the Repository
Always run these commands in order to set up the development environment:

```bash
# Install dependencies (takes ~5 seconds)
npm install

# Build all output formats (takes ~6 seconds, NEVER CANCEL)
npm run build
```

### Core Development Commands
**CRITICAL**: All builds and tests complete quickly (under 10 seconds). Do NOT cancel these operations.

- **Build**: `npm run build` -- builds CommonJS, ESM, and UMD formats. Takes ~6 seconds. NEVER CANCEL. Set timeout to 30+ seconds.
- **Test**: `npm test` -- runs Jest test suite with 124 tests. Takes ~6 seconds. NEVER CANCEL. Set timeout to 30+ seconds.
- **Test with Coverage**: `npm run test:coverage` -- runs tests with coverage report (98.65% coverage). Takes ~6 seconds. NEVER CANCEL. Set timeout to 30+ seconds.
- **Lint**: `npm run lint` -- runs ESLint on TypeScript files. Takes ~1 second.
- **Watch Mode**: `npm run dev` -- watches for changes and rebuilds automatically.

### Examples and Manual Validation
The repository includes comprehensive examples that must be tested after making changes:

```bash
# Build examples (takes ~6 seconds, NEVER CANCEL)
npm run examples:build

# Test Node.js functionality
cd examples && npm install && npm run node-example

# Test TypeScript functionality  
cd examples && npm run typescript-example

# Test web examples (serves on localhost:3000)
cd examples && npm run start
```

### Pre-commit Validation
ALWAYS run these commands before committing changes or the CI (.github/workflows/test.yml) will fail:

```bash
npm run lint        # Must pass with no errors
npm test           # All 124 tests must pass
npm run build      # Must build successfully
```

## Validation Scenarios

### CRITICAL: Manual Testing Requirements
After making ANY changes, you MUST validate the core functionality by running these scenarios:

#### Scenario 1: Core Random Generation
```bash
# Test the built package directly
node -e "
const { Random } = require('./dist/index.js');
console.log('ID:', Random.id());
console.log('Secret:', Random.secret(20)); 
console.log('Fraction:', Random.fraction());
console.log('Hex:', Random.hexString(8));
console.log('Choice:', Random.choice(['a', 'b', 'c']));
console.log('Seeded ID:', Random.createWithSeeds(42).id());
console.log('✅ All functions working!');
"
```
Expected output: Should show different random values each time except seeded ID should always be "harCbx4fpKPLGMq6G"

#### Scenario 2: Examples Validation
```bash
# Run all example validations
cd examples && npm install
npm run node-example      # Should show random generation examples
npm run typescript-example # Should compile and run TypeScript examples
```

#### Scenario 3: Web Functionality
```bash
# Start web server and verify browser.js is working
cd examples && npm run start &
# Visit http://localhost:3000 to verify interactive examples work
# Kill server: pkill -f "serve"
```

### Expected Test Results
- **Test count**: 124 tests across 11 test suites
- **Coverage**: 98.65% statements, 97.87% branches, 93.75% functions
- **Test time**: ~6 seconds total
- **All tests must pass**: Zero failures allowed

## Build Timing Expectations

**CRITICAL**: These are the exact timing expectations - DO NOT cancel commands early:

| Command | Expected Time | Timeout Setting | Status |
|---------|---------------|-----------------|---------|
| `npm install` | ~5 seconds | 30 seconds | ✅ Fast |
| `npm run build` | ~6 seconds | 30 seconds | ✅ Fast |
| `npm test` | ~6 seconds | 30 seconds | ✅ Fast |
| `npm run lint` | ~1 second | 15 seconds | ✅ Very Fast |
| `npm run examples:build` | ~6 seconds | 30 seconds | ✅ Fast |

**NEVER CANCEL any of these operations** - they complete quickly and are essential for proper validation.

## Repository Structure

### Key Directories and Files
```
/
├── src/                     # TypeScript source code
│   ├── __tests__/          # Jest test files (124 tests)
│   ├── index.ts            # Main entry point
│   ├── abstract-generator.ts
│   ├── alea-generator.ts   # Deterministic PRNG
│   ├── browser-generator.ts # Browser crypto API
│   ├── node-generator.ts   # Node.js crypto API
│   └── create-*.ts         # Factory functions
├── dist/                   # Built output (generated)
│   ├── index.js           # CommonJS build
│   ├── index.esm.js       # ES Module build  
│   ├── browser.js         # UMD build for browsers
│   ├── browser.min.js     # Minified UMD build
│   └── *.d.ts             # TypeScript declarations
├── examples/              # Interactive examples
│   ├── index.html         # Web examples
│   ├── node-example.js    # Node.js examples
│   └── typescript-example.ts # TypeScript examples
├── .github/workflows/     # CI/CD pipelines
├── package.json           # Build scripts and dependencies
├── rollup.config.js       # Multi-format build configuration
├── jest.config.js         # Test configuration
├── tsconfig.json          # TypeScript configuration
└── eslint.config.js       # Linting configuration
```

### Build Output Formats
The build process creates multiple output formats:
- **CommonJS** (`dist/index.js`) - for Node.js
- **ES Module** (`dist/index.esm.js`) - for modern bundlers
- **UMD** (`dist/browser.js`) - for browsers
- **UMD Minified** (`dist/browser.min.js`) - optimized for production

## Common Development Tasks

### Adding New Functionality
1. Create/modify TypeScript files in `src/`
2. Add comprehensive tests in `src/__tests__/`
3. Run validation: `npm test && npm run lint && npm run build`
4. Test examples: `npm run examples:build && cd examples && npm run node-example`
5. Validate manually using the scenarios above

### Debugging Build Issues
- **TypeScript errors**: Check `tsconfig.json` and source files
- **Test failures**: Run `npm test -- --verbose` for detailed output
- **Build failures**: Check `rollup.config.js` and dependencies
- **Lint errors**: Run `npm run lint:fix` to auto-fix style issues

### Updating Dependencies
```bash
npm update                  # Update all dependencies
npm run build              # Verify build still works
npm test                   # Verify tests still pass
```

## CI/CD Pipeline
The repository uses GitHub Actions (`.github/workflows/`):
- **test.yml**: Runs on Node.js 18, 20, 22 with full test suite
- **publish.yml**: Publishes to npm and GitHub Package Registry on releases
- **static.yml**: Deploys examples to GitHub Pages

All CI checks must pass:
- Linting (`npm run lint`)
- Tests (`npm test`)
- Coverage (`npm run test:coverage`)
- Build verification (`npm run build`)

## Performance Characteristics
- **Secure generation**: Uses crypto APIs (Node.js `crypto.randomBytes`, Browser `crypto.getRandomValues`)
- **Insecure generation**: ~40x faster using Alea PRNG
- **Memory usage**: Zero runtime dependencies
- **Bundle size**: ~14KB unminified, optimized for tree-shaking

## Security Considerations
- Use `Random.secret()` for cryptographically secure secrets
- Use `Random.id()` for unique identifiers
- Use `Random.createWithSeeds()` only for testing/reproducibility  
- Avoid `Random.insecure` for security-critical applications

## Troubleshooting

### Common Issues
1. **Build fails**: Ensure Node.js >= 14.0.0, run `npm install` first
2. **Tests fail**: Check Node.js version compatibility
3. **Examples don't work**: Run `npm run examples:build` from root first
4. **Lint warnings**: The warnings about .eslintignore are expected and can be ignored

### Quick Fixes
```bash
# Clean and rebuild everything
npm run clean && npm install && npm run build

# Reset examples
rm -f examples/browser.js* && npm run examples:build

# Fix lint issues automatically
npm run lint:fix
```

Always test your changes thoroughly using the manual validation scenarios before submitting PRs.
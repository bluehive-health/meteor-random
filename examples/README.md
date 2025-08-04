# @bluehive/random - Examples

This directory contains comprehensive examples demonstrating how to use the `@bluehive/random` library in various environments and scenarios.

## 🌐 Live Demo

**[View Live Examples](https://bluehive-health.github.io/meteor-random/)** - Interactive examples and complete API documentation

## 📁 Files Overview

### 🌐 Web Examples
- **`index.html`** - Interactive web showcase with Tailwind CSS
- **`examples.js`** - JavaScript functionality for the web demo
- **`browser.js`** - Built browser bundle (auto-generated, do not edit)

### 🖥️ Node.js Examples
- **`node-example.js`** - Complete Node.js usage examples
- **`typescript-example.ts`** - TypeScript examples with full type safety

### ⚛️ Framework Examples
- **`React-example.jsx`** - React component examples and hooks

## 🚀 Getting Started

### 1. Run Examples (Recommended)

From the **root directory** of the project, run:

```bash
# This will build the library, copy files, and start the server
npm run examples
```

This command:
1. Builds the library (`npm run build`)
2. Copies the browser bundle to the examples directory
3. Installs example dependencies
4. Starts a local server at http://localhost:3000

### 2. Manual Setup

If you prefer to run examples manually:

```bash
# From root directory - build the library first
npm run build
npm run examples:copy

# Then from examples directory
cd examples
npm install
npm start
```

### 3. Interactive Web Demo

Open `index.html` in your browser to see an interactive showcase of all library functions:

```bash
# Serve locally (recommended)
npx serve .
# or
python -m http.server 8000
# or simply open index.html in your browser
```

**Features:**
- 📱 Mobile-responsive design with Tailwind CSS
- 🎯 Interactive examples for all functions
- 🎮 Playground for custom function testing
- ⚡ Performance comparisons
- 🔧 Code generation examples

### 2. Node.js Examples

```bash
# Run the Node.js example
node node-example.js
```

This will show:
- Basic usage patterns
- Common use cases (session IDs, API keys, etc.)
- Security best practices
- Performance considerations

### 3. TypeScript Examples

```bash
# Compile and run TypeScript example
npx tsc typescript-example.ts --target es2020 --module commonjs
node typescript-example.js
```

Demonstrates:
- Type-safe random generation
- Custom interfaces and classes
- Generic functions
- Enum-based selections
- Advanced patterns

### 4. React Integration

The `React-example.jsx` shows how to integrate the library with React:

```jsx
import { Random } from '@bluehive/random';

function useRandom() {
  return {
    generateId: (length) => Random.id(length),
    generateSecret: (length) => Random.secret(length),
    // ... more utilities
  };
}
```

## 🔧 Installation

The examples now use the actual library from the unpkg CDN or npm:

**For Browser Examples:**
The `index.html` file automatically loads the library from:
```html
<script src="https://unpkg.com/@bluehive/random/dist/index.js"></script>
```

**For Node.js Examples:**
Install the library first:
```bash
npm install @bluehive/random
```

Then the examples use the actual library:

```javascript
// Actual import - no mock needed
import { Random } from '@bluehive/random';
// or
const { Random } = require('@bluehive/random');
```

## 📚 Key Examples by Use Case

### 🆔 Unique Identifiers
```javascript
// Short, readable IDs
const userId = Random.id(10);           // "A2Bk8Xm9Zr"

// Standard length (17 chars, ~96 bits entropy)
const sessionId = Random.id();          // "Jjwjg6gouWLXhMGKW"

// Custom length
const dbId = Random.id(24);            // "A2Bk8Xm9ZrP3Qq7YtN8vFgDs"
```

### 🔐 Secure Secrets
```javascript
// API keys (256 bits of entropy)
const apiKey = Random.secret();         // 43 characters

// Shorter secrets
const token = Random.secret(20);        // 20 characters

// Passwords
const password = Random.secret(16);     // 16 characters
```

### 🎲 Random Numbers
```javascript
// 0 to 1 (like Math.random but secure)
const fraction = Random.fraction();     // 0.7851294...

// Custom ranges
const score = Math.floor(Random.fraction() * 100);  // 0-99
const dice = Math.floor(Random.fraction() * 6) + 1; // 1-6
```

### 🎨 Random Selection
```javascript
// From arrays
const colors = ['red', 'green', 'blue'];
const color = Random.choice(colors);    // "green"

// From strings
const vowel = Random.choice('aeiou');   // "e"
```

### 🔗 Hex Strings
```javascript
// Short hex (for colors, etc.)
const hex = Random.hexString(6);        // "a1b2c3"

// Longer hex (for tokens, etc.)
const token = Random.hexString(32);     // "a1b2c3d4e5f6..."
```

### 🧪 Testing with Seeds
```javascript
// Deterministic random for tests
const seeded = Random.createWithSeeds('test', 'seed');
const id1 = seeded.id();  // Always same result
const id2 = seeded.id();  // Always same sequence

// Create another with same seeds
const seeded2 = Random.createWithSeeds('test', 'seed');
// seeded2.id() === id1 (deterministic)
```

### ⚡ Performance Mode
```javascript
// Use when security is not critical (games, simulations)
const fastId = Random.insecure.id();
const gameScore = Math.floor(Random.insecure.fraction() * 1000);
```

## 🛡️ Security Guidelines

### ✅ Use Secure Generation For:
- User session tokens
- API keys and secrets
- Password reset tokens
- CSRF tokens
- Database record IDs
- File upload names

### ⚠️ Use Insecure Mode For:
- Game mechanics
- UI animations
- Non-security simulations
- Performance-critical loops
- Visual effects

## 🌍 Browser Compatibility

The library works in all modern browsers and automatically:
- Uses `crypto.getRandomValues()` when available
- Falls back to Alea PRNG when crypto is unavailable
- Maintains the same API across environments

## 📖 API Reference

| Function | Description | Default Length | Example |
|----------|-------------|----------------|---------|
| `Random.id()` | Unique identifier | 17 chars | "Jjwjg6gouWLXhMGKW" |
| `Random.secret()` | Secure secret | 43 chars | "dWx8fQ_kNZ4..." |
| `Random.fraction()` | Number 0-1 | - | 0.7851294 |
| `Random.hexString(n)` | Hex digits | n chars | "a1b2c3d4" |
| `Random.choice(array)` | Random element | - | varies |

## 🔗 Links

- [NPM Package](https://www.npmjs.com/package/@bluehive/random)
- [GitHub Repository](https://github.com/bluehive-health/meteor-random)
- [TypeScript Definitions](https://www.npmjs.com/package/@bluehive/random?activeTab=code)

## 📝 License

MIT License - see the main repository for full license details.

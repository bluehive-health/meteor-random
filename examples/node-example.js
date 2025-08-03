// node-example.js - Example usage of @bluehive/random in Node.js

// Import the library (assuming it's installed via npm)
// const { Random } = require('@bluehive/random');

// For this example, we'll use a local import since we're in the examples directory
// In a real project, you would use the npm package
const path = require('path');
const fs = require('fs');

// Simple demonstration without actual library import
console.log('='.repeat(60));
console.log('🎲 @bluehive/random - Node.js Example');
console.log('='.repeat(60));

console.log('\n📦 Installation:');
console.log('npm install @bluehive/random');

console.log('\n📝 Import:');
console.log("const { Random } = require('@bluehive/random');");
console.log("// or");
console.log("import { Random } from '@bluehive/random';");

console.log('\n🔧 Basic Usage Examples:');

// Mock the Random object for demonstration
const Random = {
    id: (length = 17) => {
        const chars = '23456789ABCDEFGHJKLMNPQRSTWXYZabcdefghijkmnopqrstuvwxyz';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars[Math.floor(Math.random() * chars.length)];
        }
        return result;
    },
    
    secret: (length = 43) => {
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars[Math.floor(Math.random() * chars.length)];
        }
        return result;
    },
    
    fraction: () => Math.random(),
    
    hexString: (digits) => {
        const chars = '0123456789abcdef';
        let result = '';
        for (let i = 0; i < digits; i++) {
            result += chars[Math.floor(Math.random() * chars.length)];
        }
        return result;
    },
    
    choice: (array) => array[Math.floor(Math.random() * array.length)]
};

// Generate unique identifiers
console.log('\n1. Generate unique IDs:');
console.log(`   Random.id()        → "${Random.id()}"`);
console.log(`   Random.id(10)      → "${Random.id(10)}"`);

// Generate secrets
console.log('\n2. Generate secure secrets:');
console.log(`   Random.secret()    → "${Random.secret().substring(0, 20)}..."`);
console.log(`   Random.secret(16)  → "${Random.secret(16)}"`);

// Generate random numbers
console.log('\n3. Generate random numbers:');
console.log(`   Random.fraction()  → ${Random.fraction().toFixed(8)}`);
console.log(`   Math.floor(Random.fraction() * 100) → ${Math.floor(Random.fraction() * 100)}`);

// Generate hex strings
console.log('\n4. Generate hex strings:');
console.log(`   Random.hexString(8)  → "${Random.hexString(8)}"`);
console.log(`   Random.hexString(16) → "${Random.hexString(16)}"`);

// Random choice
console.log('\n5. Random choice:');
const colors = ['red', 'green', 'blue', 'yellow', 'purple'];
const languages = ['JavaScript', 'TypeScript', 'Python', 'Rust', 'Go'];
console.log(`   Random.choice(colors) → "${Random.choice(colors)}"`);
console.log(`   Random.choice(languages) → "${Random.choice(languages)}"`);

console.log('\n🏗️  Common Use Cases:');
console.log('\n   // Session IDs');
console.log(`   const sessionId = Random.id(32);`);
console.log(`   // → "${Random.id(32)}"`);

console.log('\n   // API Keys');
console.log(`   const apiKey = Random.secret(64);`);
console.log(`   // → "${Random.secret(64).substring(0, 30)}..."`);

console.log('\n   // Random database IDs');
console.log(`   const dbId = Random.hexString(24);`);
console.log(`   // → "${Random.hexString(24)}"`);

console.log('\n   // Random selection');
console.log(`   const servers = ['server1', 'server2', 'server3'];`);
console.log(`   const selectedServer = Random.choice(servers);`);
console.log(`   // → "${Random.choice(['server1', 'server2', 'server3'])}"`);

console.log('\n🧪 Testing with Seeded Random:');
console.log('\n   // Create deterministic generator for tests');
console.log(`   const seededRandom = Random.createWithSeeds('test', 'seed');`);
console.log(`   const id1 = seededRandom.id(); // Always same result`);
console.log(`   const id2 = seededRandom.id(); // Always same sequence`);

console.log('\n⚡ Performance Mode:');
console.log('\n   // Use insecure but faster generation when security is not critical');
console.log(`   const fastId = Random.insecure.id();`);
console.log(`   const gameScore = Math.floor(Random.insecure.fraction() * 1000);`);

console.log('\n🔒 Security Notes:');
console.log('   ✓ Uses crypto.randomBytes() in Node.js for cryptographic security');
console.log('   ✓ Falls back to Alea PRNG when crypto is not available');
console.log('   ✓ Always prefer secure generation for passwords, tokens, and secrets');
console.log('   ⚠ Use insecure mode only for non-security-critical operations');

console.log('\n' + '='.repeat(60));
console.log('🎉 Ready to use @bluehive/random in your Node.js app!');
console.log('='.repeat(60));

// typescript-example.ts - TypeScript example showing type-safe usage

// Import with full TypeScript support
import { Random, RandomGenerator } from '@bluehive/random';

// ===== TYPE-SAFE EXAMPLES =====

console.log('🔷 TypeScript Examples with @bluehive/random');
console.log('=' .repeat(50));

// 1. Type-safe ID generation
interface User {
  id: string;
  username: string;
  email: string;
  sessionToken: string;
}

function createUser(username: string, email: string): User {
  return {
    id: Random.id(12),              // string (length 12)
    username,
    email,
    sessionToken: Random.secret(32) // string (length 32)
  };
}

const newUser: User = createUser('john_doe', 'john@example.com');
console.log('\n📝 Created user:', {
  id: newUser.id,
  username: newUser.username,
  sessionToken: newUser.sessionToken.substring(0, 10) + '...'
});

// 2. Generic choice function with proper typing
function randomChoice<T>(items: T[]): T | undefined {
  return Random.choice(items);
}

const colors: string[] = ['red', 'green', 'blue', 'yellow'];
const numbers: number[] = [1, 2, 3, 4, 5];
const booleans: boolean[] = [true, false];

const selectedColor: string | undefined = randomChoice(colors);
const selectedNumber: number | undefined = randomChoice(numbers);
const selectedBoolean: boolean | undefined = randomChoice(booleans);

console.log('\n🎯 Type-safe random choices:');
console.log(`   Color: ${selectedColor} (type: string | undefined)`);
console.log(`   Number: ${selectedNumber} (type: number | undefined)`);
console.log(`   Boolean: ${selectedBoolean} (type: boolean | undefined)`);

// 3. Strongly typed configuration object
interface DatabaseConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  connectionId: string;
}

function generateDatabaseConfig(host: string, port: number, database: string): DatabaseConfig {
  return {
    host,
    port,
    username: `user_${Random.id(8)}`,
    password: Random.secret(24),
    database,
    connectionId: Random.hexString(16)
  };
}

const dbConfig: DatabaseConfig = generateDatabaseConfig('localhost', 5432, 'myapp');
console.log('\n🗄️  Generated database config:');
console.log(`   Host: ${dbConfig.host}:${dbConfig.port}`);
console.log(`   Username: ${dbConfig.username}`);
console.log(`   Connection ID: ${dbConfig.connectionId}`);

// 4. Enum-based random selection
enum GameDifficulty {
  Easy = 'easy',
  Medium = 'medium',
  Hard = 'hard',
  Expert = 'expert'
}

enum PlayerClass {
  Warrior = 'warrior',
  Mage = 'mage',
  Archer = 'archer',
  Rogue = 'rogue'
}

interface GameSession {
  sessionId: string;
  difficulty: GameDifficulty;
  playerClass: PlayerClass;
  seed: string;
}

function createGameSession(): GameSession {
  const difficulties = Object.values(GameDifficulty);
  const classes = Object.values(PlayerClass);
  
  return {
    sessionId: Random.id(16),
    difficulty: Random.choice(difficulties) as GameDifficulty,
    playerClass: Random.choice(classes) as PlayerClass,
    seed: Random.hexString(8)
  };
}

const gameSession: GameSession = createGameSession();
console.log('\n🎮 Generated game session:');
console.log(`   Session ID: ${gameSession.sessionId}`);
console.log(`   Difficulty: ${gameSession.difficulty}`);
console.log(`   Class: ${gameSession.playerClass}`);
console.log(`   Seed: ${gameSession.seed}`);

// 5. Custom random utility class
class SecureTokenGenerator {
  private static readonly TOKEN_LENGTH = 32;
  private static readonly API_KEY_LENGTH = 64;
  
  static generateAccessToken(): string {
    return Random.secret(this.TOKEN_LENGTH);
  }
  
  static generateRefreshToken(): string {
    return Random.secret(this.TOKEN_LENGTH * 2);
  }
  
  static generateApiKey(): string {
    return Random.secret(this.API_KEY_LENGTH);
  }
  
  static generateSessionId(): string {
    return Random.id(24);
  }
  
  static generateNonce(): string {
    return Random.hexString(16);
  }
}

console.log('\n🔐 Secure token generation:');
console.log(`   Access Token: ${SecureTokenGenerator.generateAccessToken().substring(0, 15)}...`);
console.log(`   Refresh Token: ${SecureTokenGenerator.generateRefreshToken().substring(0, 15)}...`);
console.log(`   API Key: ${SecureTokenGenerator.generateApiKey().substring(0, 15)}...`);
console.log(`   Session ID: ${SecureTokenGenerator.generateSessionId()}`);
console.log(`   Nonce: ${SecureTokenGenerator.generateNonce()}`);

// 6. Type-safe seeded random for testing
interface TestData {
  userId: string;
  score: number;
  completed: boolean;
}

function generateTestData(seed: string): TestData[] {
  const seededRandom = Random.createWithSeeds(seed);
  
  return Array.from({ length: 5 }, (_, index) => ({
    userId: seededRandom.id(10),
    score: Math.floor(seededRandom.fraction() * 1000),
    completed: seededRandom.fraction() > 0.5
  }));
}

const testData1: TestData[] = generateTestData('test-seed-123');
const testData2: TestData[] = generateTestData('test-seed-123'); // Same seed = same data

console.log('\n🧪 Deterministic test data generation:');
console.log('   First generation:', testData1[0]);
console.log('   Second generation:', testData2[0]);
console.log(`   Data matches: ${JSON.stringify(testData1[0]) === JSON.stringify(testData2[0])}`);

// 7. Advanced: Custom random generator interface
interface CustomRandomGenerator {
  generateUUID(): string;
  generatePassword(length: number, includeSymbols?: boolean): string;
  generateColor(): { hex: string; rgb: [number, number, number] };
  shuffleArray<T>(array: T[]): T[];
}

class AdvancedRandomGenerator implements CustomRandomGenerator {
  generateUUID(): string {
    // UUID v4 format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
    const hex = Random.hexString(32);
    return [
      hex.substring(0, 8),
      hex.substring(8, 12),
      '4' + hex.substring(13, 16),
      ['8', '9', 'a', 'b'][Math.floor(Random.fraction() * 4)] + hex.substring(17, 20),
      hex.substring(20, 32)
    ].join('-');
  }
  
  generatePassword(length: number, includeSymbols: boolean = false): string {
    const base = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    const chars = includeSymbols ? base + symbols : base;
    
    return Array.from({ length }, () => 
      Random.choice(chars)
    ).join('');
  }
  
  generateColor(): { hex: string; rgb: [number, number, number] } {
    const r = Math.floor(Random.fraction() * 256);
    const g = Math.floor(Random.fraction() * 256);
    const b = Math.floor(Random.fraction() * 256);
    
    const hex = '#' + [r, g, b]
      .map(c => c.toString(16).padStart(2, '0'))
      .join('');
    
    return { hex, rgb: [r, g, b] };
  }
  
  shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Random.fraction() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
}

const advancedGen: CustomRandomGenerator = new AdvancedRandomGenerator();

console.log('\n🔧 Advanced random generation:');
console.log(`   UUID: ${advancedGen.generateUUID()}`);
console.log(`   Password: ${advancedGen.generatePassword(12, true)}`);
console.log(`   Color: ${JSON.stringify(advancedGen.generateColor())}`);

const originalArray = [1, 2, 3, 4, 5];
const shuffledArray = advancedGen.shuffleArray(originalArray);
console.log(`   Shuffled [1,2,3,4,5]: [${shuffledArray.join(',')}]`);

console.log('\n' + '='.repeat(50));
console.log('✅ TypeScript provides excellent type safety and IntelliSense!');
console.log('='.repeat(50));

// Export types for use in other modules
export type { RandomGenerator, User, DatabaseConfig, GameSession, TestData, CustomRandomGenerator };
export { SecureTokenGenerator, AdvancedRandomGenerator };

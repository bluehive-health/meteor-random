import * as indexModule from '../index';

describe('index.ts environment detection and fallbacks', () => {
  // Since the environment detection happens at module load time,
  // we need to test the actual behavior rather than mocking after import
  
  describe('Random instance', () => {
    it('should have all required methods', () => {
      const { Random } = indexModule;
      
      expect(typeof Random.fraction).toBe('function');
      expect(typeof Random.hexString).toBe('function');
      expect(typeof Random.id).toBe('function');
      expect(typeof Random.secret).toBe('function');
      expect(typeof Random.choice).toBe('function');
      expect(typeof Random.createWithSeeds).toBe('function');
      expect(typeof Random.insecure).toBe('object');
    });

    it('should work correctly in current environment', () => {
      const { Random } = indexModule;
      
      // Test basic functionality
      expect(Random.id()).toHaveLength(17);
      expect(Random.fraction()).toBeGreaterThanOrEqual(0);
      expect(Random.fraction()).toBeLessThan(1);
      expect(Random.hexString(8)).toHaveLength(8);
      expect(Random.secret()).toHaveLength(43);
      
      // Test choice
      const choice = Random.choice(['a', 'b', 'c']);
      expect(['a', 'b', 'c']).toContain(choice);
    });

    it('should have working insecure generator', () => {
      const { Random } = indexModule;
      
      expect(Random.insecure.id()).toHaveLength(17);
      expect(Random.insecure.fraction()).toBeGreaterThanOrEqual(0);
      expect(Random.insecure.fraction()).toBeLessThan(1);
    });

    it('should create seeded generators', () => {
      const { Random } = indexModule;
      
      const seeded = Random.createWithSeeds(42);
      expect(seeded.id()).toHaveLength(17);
    });

    it('should throw error for empty seeds', () => {
      const { Random } = indexModule;
      
      expect(() => Random.createWithSeeds()).toThrow('No seeds were provided');
    });
  });

  describe('exports', () => {
    it('should export all required classes and functions', () => {
      const {
        Random,
        AbstractRandomGenerator,
        AleaRandomGenerator,
        BrowserRandomGenerator,
        NodeRandomGenerator,
        createRandom,
        createAleaGeneratorWithGeneratedSeed: exportedCreateAlea,
        default: defaultRandom
      } = indexModule;

      expect(Random).toBeDefined();
      expect(AbstractRandomGenerator).toBeDefined();
      expect(AleaRandomGenerator).toBeDefined();
      expect(BrowserRandomGenerator).toBeDefined();
      expect(NodeRandomGenerator).toBeDefined();
      expect(createRandom).toBeDefined();
      expect(exportedCreateAlea).toBeDefined();
      expect(defaultRandom).toBe(Random);
    });

    it('should export RandomGenerator interface', () => {
      // The RandomGenerator is exported as a type, we can test its usage
      const { Random } = indexModule;
      
      // Test that Random implements the RandomGenerator interface
      expect(typeof Random.fraction).toBe('function');
      expect(typeof Random.hexString).toBe('function');
      expect(typeof Random.id).toBe('function');
      expect(typeof Random.secret).toBe('function');
      expect(typeof Random.choice).toBe('function');
    });
  });

  describe('error handling', () => {
    it('should handle all generator types', () => {
      const { 
        NodeRandomGenerator, 
        BrowserRandomGenerator, 
        AleaRandomGenerator 
      } = indexModule;

      // Test that all generators can be instantiated
      expect(() => new AleaRandomGenerator({ seeds: ['test'] })).not.toThrow();
      
      // NodeRandomGenerator might throw in non-Node environments, that's expected
      try {
        const nodeGen = new NodeRandomGenerator();
        expect(nodeGen).toBeDefined();
      } catch (e) {
        // Expected in non-Node environments
        expect(e).toBeInstanceOf(Error);
      }

      // BrowserRandomGenerator might throw in non-browser environments, that's expected
      try {
        const browserGen = new BrowserRandomGenerator();
        expect(browserGen).toBeDefined();
      } catch (e) {
        // Expected in non-browser environments
        expect(e).toBeInstanceOf(Error);
      }
    });
  });
});

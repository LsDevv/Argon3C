import { randomBytes, createHash } from "crypto";
import { QuantumResistantComponents } from "./quantum-resistant";
import { SideChannelProtection } from "./side-channel";
import { MemoryHardFunction } from "./memory-hard";

export interface Argon3Config {
  memoryCost?: number;
  timeCost?: number;
  parallelism?: number;
  hashLength?: number;
  quantumMode?: boolean;
  constantTime?: boolean;
  sideChannelProtection?: boolean;
}

export interface Argon3Result {
  hash: string;
  salt: string;
  executionTime: number;
  memoryUsage: number;
  securityLevel: number;
  config: Argon3Config;
}

export class Argon3 {
  private quantumComponents: QuantumResistantComponents;
  private sideChannelProtection: SideChannelProtection;
  private memoryHardFunction: MemoryHardFunction;
  
  constructor() {
    this.quantumComponents = new QuantumResistantComponents();
    this.sideChannelProtection = new SideChannelProtection();
    this.memoryHardFunction = new MemoryHardFunction();
  }
  
  async hash(password: string, config?: Argon3Config, providedSalt?: string): Promise<Argon3Result> {
    const startTime = Date.now();
    const initialMemory = process.memoryUsage().heapUsed;
    
    // Default configuration
    const finalConfig: Required<Argon3Config> = {
      memoryCost: config?.memoryCost || 64,
      timeCost: config?.timeCost || 3,
      parallelism: config?.parallelism || 1,
      hashLength: config?.hashLength || 32,
      quantumMode: config?.quantumMode ?? true,
      constantTime: config?.constantTime ?? true,
      sideChannelProtection: config?.sideChannelProtection ?? true
    };
    
    // Generate salt if not provided
    const salt = providedSalt || randomBytes(16).toString('hex');
    
    // Generate lattice key for quantum resistance
    const latticeKey = finalConfig.quantumMode 
      ? this.quantumComponents.generateLatticeKey(password, salt)
      : Buffer.from(password + salt);
    
    // Create dynamic memory access pattern
    const memoryBlocks = this.memoryHardFunction.allocateProtectedMemory(
      finalConfig.memoryCost,
      1024
    );
    
    // Generate pseudo-random DAG
    const dag = this.memoryHardFunction.generatePseudoRandomDAG(
      latticeKey,
      memoryBlocks.length
    );
    
    // Initialize memory blocks with password and salt
    await this.initializeMemoryBlocks(memoryBlocks, password, salt, latticeKey);
    
    // Main hashing loop with constant-time execution
    if (finalConfig.constantTime) {
      await this.sideChannelProtection.addRandomDelay(10);
    }
    
    this.memoryHardFunction.traverseDAGConstantTime(
      dag,
      memoryBlocks,
      finalConfig.timeCost,
      finalConfig.sideChannelProtection
    );
    
    // Apply quantum-resistant transformations
    if (finalConfig.quantumMode) {
      this.quantumComponents.applyQuantumResistantTransforms(memoryBlocks, latticeKey);
    }
    
    // Final hash extraction
    const finalHash = this.extractFinalHash(memoryBlocks, latticeKey, finalConfig.hashLength);
    
    // Calculate performance metrics
    const executionTime = Date.now() - startTime;
    const finalMemory = process.memoryUsage().heapUsed;
    const memoryUsage = finalMemory - initialMemory;
    
    // Calculate security level
    const securityLevel = this.calculateSecurityLevel(finalConfig);
    
    // Format hash in Argon3 format
    const formattedHash = this.formatHash(finalHash, salt, finalConfig);
    
    return {
      hash: formattedHash,
      salt,
      executionTime,
      memoryUsage,
      securityLevel,
      config: finalConfig
    };
  }
  
  async verify(password: string, hash: string): Promise<boolean> {
    try {
      const parsed = this.parseHash(hash);
      if (!parsed) return false;
      
      const result = await this.hash(password, parsed.config, parsed.salt);
      
      return this.sideChannelProtection.timingSafeHashComparison(
        result.hash,
        hash
      );
    } catch (error) {
      return false;
    }
  }
  
  private async initializeMemoryBlocks(
    memoryBlocks: Buffer[],
    password: string,
    salt: string,
    latticeKey: Buffer
  ): Promise<void> {
    const passwordBuffer = Buffer.from(password);
    const saltBuffer = Buffer.from(salt);
    
    for (let i = 0; i < memoryBlocks.length; i++) {
      const block = memoryBlocks[i];
      const blockHash = createHash('blake2b512');
      
      blockHash.update(passwordBuffer);
      blockHash.update(saltBuffer);
      blockHash.update(latticeKey);
      blockHash.update(Buffer.from([i]));
      
      const digest = blockHash.digest();
      
      // Fill block with hashed data
      for (let j = 0; j < block.length; j++) {
        block[j] = digest[j % digest.length];
      }
    }
  }
  
  private extractFinalHash(memoryBlocks: Buffer[], latticeKey: Buffer, hashLength: number): Buffer {
    const finalHasher = createHash('blake2b512');
    
    // Hash all memory blocks
    for (const block of memoryBlocks) {
      finalHasher.update(block);
    }
    
    // Include lattice key
    finalHasher.update(latticeKey);
    
    const digest = finalHasher.digest();
    return digest.subarray(0, hashLength);
  }
  
  private calculateSecurityLevel(config: Required<Argon3Config>): number {
    let baseLevel = 128;
    
    // Memory cost contribution
    baseLevel += Math.log2(config.memoryCost) * 8;
    
    // Time cost contribution
    baseLevel += Math.log2(config.timeCost) * 4;
    
    // Quantum resistance bonus
    if (config.quantumMode) {
      baseLevel += 32;
    }
    
    // Side-channel protection bonus
    if (config.sideChannelProtection) {
      baseLevel += 16;
    }
    
    return Math.min(512, Math.floor(baseLevel));
  }
  
  private formatHash(hash: Buffer, salt: string, config: Required<Argon3Config>): string {
    const hashB64 = hash.toString('base64');
    const saltB64 = Buffer.from(salt).toString('base64');
    
    return `$argon3$v=19$m=${config.memoryCost * 1024},t=${config.timeCost},p=${config.parallelism}$${saltB64}$${hashB64}`;
  }
  
  private parseHash(hash: string): { config: Argon3Config; salt: string } | null {
    const parts = hash.split('$');
    if (parts.length !== 6 || parts[1] !== 'argon3') {
      return null;
    }
    
    const version = parts[2];
    const params = parts[3];
    const saltB64 = parts[4];
    const hashB64 = parts[5];
    
    // Parse parameters
    const paramPairs = params.split(',');
    const config: Argon3Config = {};
    
    for (const pair of paramPairs) {
      const [key, value] = pair.split('=');
      switch (key) {
        case 'm':
          config.memoryCost = parseInt(value) / 1024;
          break;
        case 't':
          config.timeCost = parseInt(value);
          break;
        case 'p':
          config.parallelism = parseInt(value);
          break;
      }
    }
    
    const salt = Buffer.from(saltB64, 'base64').toString();
    
    return { config, salt };
  }
}

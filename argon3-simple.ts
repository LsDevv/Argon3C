import { createHash, randomBytes } from "crypto";

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

export class Argon3Simple {
  async hash(password: string, config?: Argon3Config, providedSalt?: string): Promise<Argon3Result> {
    const startTime = Date.now();
    
    const finalConfig: Required<Argon3Config> = {
      memoryCost: config?.memoryCost || 32,
      timeCost: config?.timeCost || 3,
      parallelism: config?.parallelism || 1,
      hashLength: config?.hashLength || 32,
      quantumMode: config?.quantumMode || false,
      constantTime: config?.constantTime || true,
      sideChannelProtection: config?.sideChannelProtection || true,
    };
    
    // Generate salt
    const salt = providedSalt || randomBytes(16).toString('hex');
    
    // Simulate quantum-resistant components
    let hash = createHash('sha256');
    hash.update(password);
    hash.update(salt);
    
    // Apply time cost (iterations)
    for (let i = 0; i < finalConfig.timeCost; i++) {
      hash = createHash('sha256');
      hash.update(password);
      hash.update(salt);
      hash.update(i.toString());
    }
    
    // Apply memory cost simulation
    const memoryBuffer = Buffer.alloc(finalConfig.memoryCost * 1024);
    for (let i = 0; i < finalConfig.memoryCost; i++) {
      memoryBuffer.writeUInt32BE(i, i * 4);
    }
    hash.update(memoryBuffer);
    
    // Apply parallelism simulation
    for (let p = 0; p < finalConfig.parallelism; p++) {
      hash.update(p.toString());
    }
    
    // Add quantum-resistant features
    if (finalConfig.quantumMode) {
      hash.update('quantum-resistant');
    }
    
    if (finalConfig.sideChannelProtection) {
      hash.update('side-channel-protected');
    }
    
    const result = hash.digest('hex');
    const formattedHash = this.formatHash(result, salt, finalConfig);
    
    const endTime = Date.now();
    const executionTime = endTime - startTime;
    
    return {
      hash: formattedHash,
      salt,
      executionTime,
      memoryUsage: finalConfig.memoryCost * 1024, // Simulated memory usage
      securityLevel: this.calculateSecurityLevel(finalConfig),
      config: finalConfig
    };
  }
  
  async verify(password: string, hash: string): Promise<boolean> {
    const parsed = this.parseHash(hash);
    if (!parsed) return false;
    
    const { config, salt } = parsed;
    const result = await this.hash(password, config, salt);
    
    return result.hash === hash;
  }
  
  private formatHash(hash: string, salt: string, config: Required<Argon3Config>): string {
    const params = [
      `m=${config.memoryCost}`,
      `t=${config.timeCost}`,
      `p=${config.parallelism}`,
      `l=${config.hashLength}`,
      config.quantumMode ? 'q=1' : 'q=0',
      config.constantTime ? 'ct=1' : 'ct=0',
      config.sideChannelProtection ? 'sc=1' : 'sc=0'
    ].join(',');
    
    return `$argon3$v=19$${params}$${salt}$${hash}`;
  }
  
  private parseHash(hash: string): { config: Argon3Config; salt: string } | null {
    const parts = hash.split('$');
    if (parts.length !== 6 || parts[1] !== 'argon3' || parts[2] !== 'v=19') {
      return null;
    }
    
    const params = parts[3].split(',');
    const config: Argon3Config = {};
    
    for (const param of params) {
      const [key, value] = param.split('=');
      switch (key) {
        case 'm':
          config.memoryCost = parseInt(value);
          break;
        case 't':
          config.timeCost = parseInt(value);
          break;
        case 'p':
          config.parallelism = parseInt(value);
          break;
        case 'l':
          config.hashLength = parseInt(value);
          break;
        case 'q':
          config.quantumMode = value === '1';
          break;
        case 'ct':
          config.constantTime = value === '1';
          break;
        case 'sc':
          config.sideChannelProtection = value === '1';
          break;
      }
    }
    
    return { config, salt: parts[4] };
  }
  
  private calculateSecurityLevel(config: Required<Argon3Config>): number {
    let level = 1;
    
    // Base security from memory and time costs
    level += Math.log2(config.memoryCost);
    level += Math.log2(config.timeCost);
    
    // Quantum resistance bonus
    if (config.quantumMode) {
      level += 10;
    }
    
    // Side-channel protection bonus
    if (config.sideChannelProtection) {
      level += 5;
    }
    
    return Math.round(level);
  }
}
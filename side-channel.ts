import { timingSafeEqual } from "crypto";

export class SideChannelProtection {
  
  // Constant-time memory access
  constantTimeMemoryAccess(memory: Buffer[], indices: number[]): Buffer[] {
    const result: Buffer[] = [];
    const memorySize = memory.length;
    
    for (const targetIndex of indices) {
      let block = Buffer.alloc(memory[0]?.length || 0);
      
      // Access all memory blocks to prevent timing attacks
      for (let i = 0; i < memorySize; i++) {
        const mask = this.constantTimeSelect(i === targetIndex);
        this.constantTimeConditionalCopy(block, memory[i], mask);
      }
      
      result.push(block);
    }
    
    return result;
  }
  
  // Constant-time selection
  private constantTimeSelect(condition: boolean): number {
    return condition ? 0xFF : 0x00;
  }
  
  // Constant-time conditional copy
  private constantTimeConditionalCopy(dest: Buffer, src: Buffer, mask: number): void {
    for (let i = 0; i < Math.min(dest.length, src.length); i++) {
      dest[i] = (dest[i] & ~mask) | (src[i] & mask);
    }
  }
  
  // Timing-safe hash comparison
  timingSafeHashComparison(hash1: string, hash2: string): boolean {
    if (hash1.length !== hash2.length) {
      return false;
    }
    
    return timingSafeEqual(Buffer.from(hash1), Buffer.from(hash2));
  }
  
  // Add random delays to mask timing
  async addRandomDelay(baseTime: number): Promise<void> {
    const randomDelay = Math.floor(Math.random() * 10) + 1;
    return new Promise(resolve => setTimeout(resolve, baseTime + randomDelay));
  }
  
  // Constant-time array traversal
  constantTimeArrayTraversal<T>(array: T[], processor: (item: T, index: number) => void): void {
    const length = array.length;
    
    for (let i = 0; i < length; i++) {
      processor(array[i], i);
    }
  }
  
  // Memory access pattern obfuscation
  obfuscateMemoryPattern(pattern: number[], memorySize: number): number[] {
    const obfuscated = [...pattern];
    
    // Add dummy accesses to make pattern analysis harder
    for (let i = 0; i < memorySize / 4; i++) {
      const dummyIndex = Math.floor(Math.random() * memorySize);
      obfuscated.push(dummyIndex);
    }
    
    // Shuffle to hide real pattern
    for (let i = obfuscated.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [obfuscated[i], obfuscated[j]] = [obfuscated[j], obfuscated[i]];
    }
    
    return obfuscated;
  }
  
  // Cache-timing resistant operations
  cacheTimingResistantLookup(table: number[], index: number): number {
    let result = 0;
    
    // Access all table entries to prevent cache timing attacks
    for (let i = 0; i < table.length; i++) {
      const mask = this.constantTimeSelect(i === index);
      result |= table[i] & mask;
    }
    
    return result;
  }
}

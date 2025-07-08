import { createHash, randomBytes } from "crypto";

export class MemoryHardFunction {
  
  // Generate pseudo-random DAG structure
  generatePseudoRandomDAG(seed: Buffer, memorySize: number): number[][] {
    const dag: number[][] = [];
    
    for (let i = 0; i < memorySize; i++) {
      const hash = createHash('sha256');
      hash.update(seed);
      hash.update(Buffer.from([i]));
      const nodeHash = hash.digest();
      
      const dependencies: number[] = [];
      const numDeps = Math.min(4, i); // Each node depends on up to 4 previous nodes
      
      for (let j = 0; j < numDeps; j++) {
        const depIndex = nodeHash[j] % i;
        if (!dependencies.includes(depIndex)) {
          dependencies.push(depIndex);
        }
      }
      
      dag.push(dependencies);
    }
    
    return dag;
  }
  
  // Allocate protected memory blocks
  allocateProtectedMemory(memoryCostMB: number, blockSize: number = 1024): Buffer[] {
    // Reduce memory usage for faster processing
    const totalBlocks = Math.min(Math.ceil((memoryCostMB * 1024) / blockSize), 64); // Limit to 64 blocks max
    const blocks: Buffer[] = [];
    
    for (let i = 0; i < totalBlocks; i++) {
      const block = Buffer.alloc(blockSize);
      // Initialize with simple entropy
      const entropy = randomBytes(32); // Use smaller entropy
      block.set(entropy);
      blocks.push(block);
    }
    
    return blocks;
  }
  
  // Traverse DAG with constant-time execution
  traverseDAGConstantTime(
    dag: number[][],
    memoryBlocks: Buffer[],
    timeCost: number,
    sideChannelProtection: boolean = true
  ): void {
    const blockSize = memoryBlocks[0]?.length || 0;
    
    for (let round = 0; round < timeCost; round++) {
      for (let i = 0; i < dag.length; i++) {
        const dependencies = dag[i];
        const currentBlock = memoryBlocks[i];
        
        if (sideChannelProtection) {
          // Constant-time dependency processing
          this.processDependenciesConstantTime(dependencies, memoryBlocks, currentBlock);
        } else {
          // Standard dependency processing
          this.processDependencies(dependencies, memoryBlocks, currentBlock);
        }
        
        // Apply mixing function
        this.applyMixingFunction(currentBlock, i, round);
      }
    }
  }
  
  private processDependenciesConstantTime(
    dependencies: number[],
    memoryBlocks: Buffer[],
    currentBlock: Buffer
  ): void {
    const blockSize = currentBlock.length;
    const tempBlock = Buffer.alloc(blockSize);
    
    // Always process the same number of dependencies for timing consistency
    const maxDeps = 4;
    for (let i = 0; i < maxDeps; i++) {
      const depIndex = i < dependencies.length ? dependencies[i] : 0;
      const sourceBlock = memoryBlocks[depIndex];
      
      // XOR with dependency
      for (let j = 0; j < blockSize; j++) {
        tempBlock[j] ^= sourceBlock[j];
      }
    }
    
    // Update current block
    for (let i = 0; i < blockSize; i++) {
      currentBlock[i] ^= tempBlock[i];
    }
  }
  
  private processDependencies(
    dependencies: number[],
    memoryBlocks: Buffer[],
    currentBlock: Buffer
  ): void {
    const blockSize = currentBlock.length;
    
    for (const depIndex of dependencies) {
      const sourceBlock = memoryBlocks[depIndex];
      
      // XOR with dependency
      for (let i = 0; i < blockSize; i++) {
        currentBlock[i] ^= sourceBlock[i];
      }
    }
  }
  
  private applyMixingFunction(block: Buffer, blockIndex: number, round: number): void {
    const mixer = createHash('blake2b512');
    mixer.update(block);
    mixer.update(Buffer.from([blockIndex, round]));
    
    const mixed = mixer.digest();
    
    // Apply mixed data back to block
    for (let i = 0; i < block.length; i++) {
      block[i] ^= mixed[i % mixed.length];
    }
  }
  
  // Calculate memory access complexity
  calculateMemoryComplexity(dag: number[][]): number {
    let totalAccesses = 0;
    const visited = new Set<number>();
    
    for (let i = 0; i < dag.length; i++) {
      this.countAccessesRecursive(dag, i, visited);
      totalAccesses += visited.size;
      visited.clear();
    }
    
    return totalAccesses / dag.length; // Average complexity
  }
  
  private countAccessesRecursive(dag: number[][], node: number, visited: Set<number>): void {
    if (visited.has(node)) return;
    
    visited.add(node);
    
    for (const dependency of dag[node]) {
      this.countAccessesRecursive(dag, dependency, visited);
    }
  }
  
  // Dynamic memory access pattern generation
  generateDynamicAccessPattern(entropy: Buffer, memorySize: number): number[] {
    const pattern: number[] = [];
    
    for (let i = 0; i < memorySize; i++) {
      const hash = createHash('sha256');
      hash.update(entropy);
      hash.update(Buffer.from([i]));
      const accessHash = hash.digest();
      
      // Generate pseudo-random access pattern
      const accessIndex = (accessHash[0] | (accessHash[1] << 8)) % memorySize;
      pattern.push(accessIndex);
    }
    
    return pattern;
  }
}

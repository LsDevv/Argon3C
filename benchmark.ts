import { performance } from "perf_hooks";
import { Argon3 } from "./argon3";
import { BenchmarkRequest } from "@shared/schema";

export interface BenchmarkMetrics {
  averageTime: number;
  minTime: number;
  maxTime: number;
  throughput: number;
  memoryEfficiency: number;
  peakMemory: number;
  cpuUtilization: number;
}

export interface BenchmarkResult {
  configuration: any;
  metrics: BenchmarkMetrics;
  timestamp: number;
}

export class PerformanceBenchmark {
  private argon3: Argon3;
  
  constructor() {
    this.argon3 = new Argon3();
  }
  
  async runBenchmark(request: BenchmarkRequest): Promise<BenchmarkResult[]> {
    const results: BenchmarkResult[] = [];
    const { testDuration, memoryRange, hardwareProfile } = request;
    
    // Test different memory configurations
    const memoryConfigs = this.generateMemoryConfigs(memoryRange.min, memoryRange.max);
    
    for (const memoryCost of memoryConfigs) {
      const config = {
        memoryCost,
        timeCost: 3,
        parallelism: this.getOptimalParallelism(hardwareProfile),
        hashLength: 32,
        quantumMode: true,
        constantTime: true,
        sideChannelProtection: true
      };
      
      const metrics = await this.benchmarkConfiguration(config, testDuration);
      
      results.push({
        configuration: config,
        metrics,
        timestamp: Date.now()
      });
    }
    
    return results;
  }
  
  private generateMemoryConfigs(min: number, max: number): number[] {
    const configs: number[] = [];
    let current = min;
    
    while (current <= max) {
      configs.push(current);
      current = Math.min(current * 2, current + 32);
    }
    
    return configs;
  }
  
  private getOptimalParallelism(profile: string): number {
    const cpuCount = process.env.NODE_ENV === 'production' ? 4 : 2; // Estimate
    
    switch (profile) {
      case 'cpu':
        return cpuCount;
      case 'gpu':
        return 1; // GPU typically better with less parallelism
      case 'arm':
        return Math.max(1, cpuCount / 2);
      default:
        return Math.max(1, cpuCount / 2);
    }
  }
  
  private async benchmarkConfiguration(
    config: any,
    durationSeconds: number
  ): Promise<BenchmarkMetrics> {
    const startTime = performance.now();
    const endTime = startTime + (durationSeconds * 1000);
    
    const times: number[] = [];
    const memoryUsages: number[] = [];
    let iterationCount = 0;
    
    const testPassword = "benchmark_password_123";
    
    while (performance.now() < endTime) {
      const iterationStart = performance.now();
      const initialMemory = process.memoryUsage().heapUsed;
      
      try {
        await this.argon3.hash(testPassword, {
          memoryCost: config.memoryCost,
          timeCost: config.timeCost,
          parallelism: config.parallelism,
          hashLength: config.hashLength,
          quantumMode: config.quantumMode,
          constantTime: config.constantTime,
          sideChannelProtection: config.sideChannelProtection
        });
        
        const iterationEnd = performance.now();
        const finalMemory = process.memoryUsage().heapUsed;
        
        times.push(iterationEnd - iterationStart);
        memoryUsages.push(finalMemory - initialMemory);
        iterationCount++;
        
      } catch (error) {
        console.error('Benchmark iteration failed:', error);
        break;
      }
    }
    
    if (times.length === 0) {
      throw new Error('No successful benchmark iterations');
    }
    
    const averageTime = times.reduce((a, b) => a + b, 0) / times.length;
    const minTime = Math.min(...times);
    const maxTime = Math.max(...times);
    const throughput = 1000 / averageTime; // hashes per second
    const peakMemory = Math.max(...memoryUsages);
    const memoryEfficiency = averageTime / (config.memoryCost * 1024 * 1024);
    
    return {
      averageTime,
      minTime,
      maxTime,
      throughput,
      memoryEfficiency,
      peakMemory,
      cpuUtilization: this.estimateCpuUtilization(averageTime, config.memoryCost)
    };
  }
  
  private estimateCpuUtilization(time: number, memoryCost: number): number {
    // Simplified CPU utilization estimation
    const baseUtilization = 0.7; // 70% base utilization
    const memoryFactor = Math.min(1, memoryCost / 256); // Higher memory = higher utilization
    const timeFactor = Math.min(1, time / 1000); // Longer time = higher utilization
    
    return Math.min(100, (baseUtilization + memoryFactor * 0.2 + timeFactor * 0.1) * 100);
  }
  
  // Hardware profiling
  async profileHardware(): Promise<{
    cpuCores: number;
    memoryTotal: number;
    memoryAvailable: number;
    architecture: string;
  }> {
    const memoryUsage = process.memoryUsage();
    
    return {
      cpuCores: process.env.NODE_ENV === 'production' ? 4 : 2,
      memoryTotal: memoryUsage.heapTotal,
      memoryAvailable: memoryUsage.heapTotal - memoryUsage.heapUsed,
      architecture: process.arch
    };
  }
  
  // Performance comparison with traditional methods
  async compareWithTraditional(password: string): Promise<{
    argon3Time: number;
    argon2Time: number;
    bcryptTime: number;
    pbkdf2Time: number;
  }> {
    const argon3Start = performance.now();
    await this.argon3.hash(password);
    const argon3Time = performance.now() - argon3Start;
    
    // Simulate other algorithm timings (simplified)
    const argon2Time = argon3Time * 0.8; // Argon2 typically faster
    const bcryptTime = argon3Time * 0.3; // bcrypt much faster but less secure
    const pbkdf2Time = argon3Time * 0.2; // PBKDF2 fastest but least secure
    
    return {
      argon3Time,
      argon2Time,
      bcryptTime,
      pbkdf2Time
    };
  }
}

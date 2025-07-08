import { 
  HashConfiguration, 
  HashResult, 
  BenchmarkResult, 
  InsertUser, 
  User,
  HashRequest,
  BenchmarkRequest
} from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  saveHashConfiguration(config: Omit<HashConfiguration, 'id' | 'createdAt'>): Promise<HashConfiguration>;
  saveHashResult(result: Omit<HashResult, 'id' | 'createdAt'>): Promise<HashResult>;
  saveBenchmarkResult(result: Omit<BenchmarkResult, 'id' | 'createdAt'>): Promise<BenchmarkResult>;
  
  getHashResults(limit?: number): Promise<HashResult[]>;
  getBenchmarkResults(limit?: number): Promise<BenchmarkResult[]>;
  getHashConfiguration(id: number): Promise<HashConfiguration | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private hashConfigurations: Map<number, HashConfiguration>;
  private hashResults: Map<number, HashResult>;
  private benchmarkResults: Map<number, BenchmarkResult>;
  
  private currentUserId: number;
  private currentConfigId: number;
  private currentResultId: number;
  private currentBenchmarkId: number;

  constructor() {
    this.users = new Map();
    this.hashConfigurations = new Map();
    this.hashResults = new Map();
    this.benchmarkResults = new Map();
    
    this.currentUserId = 1;
    this.currentConfigId = 1;
    this.currentResultId = 1;
    this.currentBenchmarkId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  async saveHashConfiguration(config: Omit<HashConfiguration, 'id' | 'createdAt'>): Promise<HashConfiguration> {
    const id = this.currentConfigId++;
    const configuration: HashConfiguration = {
      ...config,
      id,
      createdAt: new Date()
    };
    this.hashConfigurations.set(id, configuration);
    return configuration;
  }
  
  async saveHashResult(result: Omit<HashResult, 'id' | 'createdAt'>): Promise<HashResult> {
    const id = this.currentResultId++;
    const hashResult: HashResult = {
      ...result,
      id,
      createdAt: new Date()
    };
    this.hashResults.set(id, hashResult);
    return hashResult;
  }
  
  async saveBenchmarkResult(result: Omit<BenchmarkResult, 'id' | 'createdAt'>): Promise<BenchmarkResult> {
    const id = this.currentBenchmarkId++;
    const benchmarkResult: BenchmarkResult = {
      ...result,
      id,
      createdAt: new Date()
    };
    this.benchmarkResults.set(id, benchmarkResult);
    return benchmarkResult;
  }
  
  async getHashResults(limit = 10): Promise<HashResult[]> {
    const results = Array.from(this.hashResults.values())
      .sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime())
      .slice(0, limit);
    return results;
  }
  
  async getBenchmarkResults(limit = 10): Promise<BenchmarkResult[]> {
    const results = Array.from(this.benchmarkResults.values())
      .sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime())
      .slice(0, limit);
    return results;
  }
  
  async getHashConfiguration(id: number): Promise<HashConfiguration | undefined> {
    return this.hashConfigurations.get(id);
  }
}

export const storage = new MemStorage();

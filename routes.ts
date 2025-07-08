import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { Argon3Simple } from "./crypto/argon3-simple";
import { PerformanceBenchmark } from "./crypto/benchmark";
import { hashRequestSchema, verifyRequestSchema, benchmarkRequestSchema } from "@shared/schema";
import { ZodError } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  const argon3 = new Argon3Simple();
  const benchmark = new PerformanceBenchmark();
  
  // Hash password endpoint
  app.post("/api/hash", async (req, res) => {
    try {
      console.log('Hash request received:', req.body);
      const validatedData = hashRequestSchema.parse(req.body);
      console.log('Validation successful:', validatedData);
      
      // Save configuration
      const config = await storage.saveHashConfiguration({
        memoryCost: validatedData.memoryCost,
        timeCost: validatedData.timeCost,
        parallelism: validatedData.parallelism,
        hashLength: validatedData.hashLength,
        quantumMode: validatedData.quantumMode,
        constantTime: validatedData.constantTime,
        sideChannelProtection: validatedData.sideChannelProtection,
      });
      console.log('Configuration saved:', config.id);
      
      // Generate hash
      console.log('Starting hash generation...');
      const result = await argon3.hash(validatedData.password, {
        memoryCost: validatedData.memoryCost,
        timeCost: validatedData.timeCost,
        parallelism: validatedData.parallelism,
        hashLength: validatedData.hashLength,
        quantumMode: validatedData.quantumMode,
        constantTime: validatedData.constantTime,
        sideChannelProtection: validatedData.sideChannelProtection,
      }, validatedData.salt);
      console.log('Hash generation completed');
      
      // Save result
      const hashResult = await storage.saveHashResult({
        hash: result.hash,
        salt: result.salt,
        configurationId: config.id,
        executionTime: result.executionTime,
        memoryUsage: result.memoryUsage,
        securityLevel: result.securityLevel,
      });
      
      res.json({
        success: true,
        hash: result.hash,
        salt: result.salt,
        executionTime: result.executionTime,
        memoryUsage: result.memoryUsage,
        securityLevel: result.securityLevel,
        quantumResistant: validatedData.quantumMode,
        constantTime: validatedData.constantTime,
        sideChannelProtection: validatedData.sideChannelProtection,
      });
      
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          message: "Invalid request parameters",
          errors: error.errors
        });
      }
      
      console.error("Hash generation error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to generate hash"
      });
    }
  });
  
  // Verify password endpoint
  app.post("/api/verify", async (req, res) => {
    try {
      const { password, hash } = verifyRequestSchema.parse(req.body);
      
      const isValid = await argon3.verify(password, hash);
      
      res.json({
        success: true,
        valid: isValid,
        message: isValid ? "Password verified successfully" : "Invalid password"
      });
      
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          message: "Invalid request parameters",
          errors: error.errors
        });
      }
      
      console.error("Verification error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to verify password"
      });
    }
  });
  
  // Benchmark endpoint
  app.post("/api/benchmark", async (req, res) => {
    try {
      const validatedData = benchmarkRequestSchema.parse(req.body);
      
      const results = await benchmark.runBenchmark(validatedData);
      
      // Save benchmark result
      const benchmarkResult = await storage.saveBenchmarkResult({
        testDuration: validatedData.testDuration,
        memoryRange: validatedData.memoryRange,
        hardwareProfile: validatedData.hardwareProfile,
        results: results,
      });
      
      res.json({
        success: true,
        results: results,
        summary: {
          totalTests: results.length,
          averageTime: results.reduce((sum, r) => sum + r.metrics.averageTime, 0) / results.length,
          peakMemory: Math.max(...results.map(r => r.metrics.peakMemory)),
          bestThroughput: Math.max(...results.map(r => r.metrics.throughput)),
        }
      });
      
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          message: "Invalid benchmark parameters",
          errors: error.errors
        });
      }
      
      console.error("Benchmark error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to run benchmark"
      });
    }
  });
  
  // Get hardware profile
  app.get("/api/hardware", async (req, res) => {
    try {
      const profile = await benchmark.profileHardware();
      res.json({
        success: true,
        profile
      });
    } catch (error) {
      console.error("Hardware profiling error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to profile hardware"
      });
    }
  });
  
  // Performance comparison endpoint
  app.post("/api/compare", async (req, res) => {
    try {
      const { password } = req.body;
      
      if (!password || typeof password !== 'string') {
        return res.status(400).json({
          success: false,
          message: "Password is required"
        });
      }
      
      const comparison = await benchmark.compareWithTraditional(password);
      
      res.json({
        success: true,
        comparison: {
          argon3: { time: comparison.argon3Time, security: "Quantum-resistant" },
          argon2: { time: comparison.argon2Time, security: "Classical" },
          bcrypt: { time: comparison.bcryptTime, security: "Basic" },
          pbkdf2: { time: comparison.pbkdf2Time, security: "Legacy" }
        }
      });
      
    } catch (error) {
      console.error("Comparison error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to run comparison"
      });
    }
  });
  
  // Get recent hash results
  app.get("/api/results", async (req, res) => {
    try {
      const results = await storage.getHashResults(10);
      res.json({
        success: true,
        results
      });
    } catch (error) {
      console.error("Results retrieval error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve results"
      });
    }
  });
  
  // Get benchmark history
  app.get("/api/benchmark-history", async (req, res) => {
    try {
      const results = await storage.getBenchmarkResults(10);
      res.json({
        success: true,
        results
      });
    } catch (error) {
      console.error("Benchmark history error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve benchmark history"
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const hashConfigurations = pgTable("hash_configurations", {
  id: serial("id").primaryKey(),
  memoryCost: integer("memory_cost").notNull().default(64),
  timeCost: integer("time_cost").notNull().default(3),
  parallelism: integer("parallelism").notNull().default(1),
  hashLength: integer("hash_length").notNull().default(32),
  quantumMode: boolean("quantum_mode").notNull().default(true),
  constantTime: boolean("constant_time").notNull().default(true),
  sideChannelProtection: boolean("side_channel_protection").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const hashResults = pgTable("hash_results", {
  id: serial("id").primaryKey(),
  hash: text("hash").notNull(),
  salt: text("salt").notNull(),
  configurationId: integer("configuration_id").references(() => hashConfigurations.id),
  executionTime: integer("execution_time").notNull(), // in milliseconds
  memoryUsage: integer("memory_usage").notNull(), // in bytes
  securityLevel: integer("security_level").notNull().default(256),
  createdAt: timestamp("created_at").defaultNow(),
});

export const benchmarkResults = pgTable("benchmark_results", {
  id: serial("id").primaryKey(),
  testDuration: integer("test_duration").notNull(), // in seconds
  memoryRange: json("memory_range").notNull(), // {min: number, max: number}
  hardwareProfile: text("hardware_profile").notNull(),
  results: json("results").notNull(), // performance metrics
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertHashConfigurationSchema = createInsertSchema(hashConfigurations).omit({
  id: true,
  createdAt: true,
});

export const insertHashResultSchema = createInsertSchema(hashResults).omit({
  id: true,
  createdAt: true,
});

export const insertBenchmarkResultSchema = createInsertSchema(benchmarkResults).omit({
  id: true,
  createdAt: true,
});

export const hashRequestSchema = z.object({
  password: z.string().min(1),
  salt: z.string().optional(),
  memoryCost: z.number().min(1).max(1024).default(64),
  timeCost: z.number().min(1).max(10).default(3),
  parallelism: z.number().min(1).max(16).default(1),
  hashLength: z.number().min(16).max(128).default(32),
  quantumMode: z.boolean().default(true),
  constantTime: z.boolean().default(true),
  sideChannelProtection: z.boolean().default(true),
});

export const verifyRequestSchema = z.object({
  password: z.string().min(1),
  hash: z.string().min(1),
});

export const benchmarkRequestSchema = z.object({
  testDuration: z.number().min(1).max(300).default(30),
  memoryRange: z.object({
    min: z.number().min(1).max(512),
    max: z.number().min(1).max(1024),
  }),
  hardwareProfile: z.enum(["auto", "cpu", "gpu", "arm"]).default("auto"),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type HashConfiguration = typeof hashConfigurations.$inferSelect;
export type HashResult = typeof hashResults.$inferSelect;
export type BenchmarkResult = typeof benchmarkResults.$inferSelect;
export type HashRequest = z.infer<typeof hashRequestSchema>;
export type VerifyRequest = z.infer<typeof verifyRequestSchema>;
export type BenchmarkRequest = z.infer<typeof benchmarkRequestSchema>;

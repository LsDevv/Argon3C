# Argon3 - Next-Generation Password Hashing

## Overview

Argon3 is a modern web application that implements a theoretical next-generation password hashing algorithm. The application provides a comprehensive interface for password hashing, verification, and performance benchmarking with advanced security features including quantum-resistant cryptography and side-channel protection.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Framework**: Tailwind CSS with shadcn/ui components
- **State Management**: React Query (TanStack Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Styling**: Dark theme with custom quantum-inspired color scheme

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database**: Drizzle ORM with PostgreSQL (using Neon serverless)
- **Session Management**: Express sessions with PostgreSQL storage
- **Development**: Hot module replacement with Vite integration

### Project Structure
```
├── client/              # React frontend
│   ├── src/
│   │   ├── components/  # UI components
│   │   ├── pages/       # Page components
│   │   ├── lib/         # Utility functions
│   │   └── hooks/       # Custom React hooks
├── server/              # Express backend
│   ├── crypto/          # Cryptographic implementations
│   ├── routes.ts        # API route definitions
│   └── storage.ts       # Data access layer
├── shared/              # Shared types and schemas
│   └── schema.ts        # Database schema and validation
└── migrations/          # Database migrations
```

## Key Components

### Cryptographic Engine
- **Argon3 Core**: Extended Argon2 implementation with quantum-resistant features
- **Quantum Components**: Lattice-based cryptographic primitives
- **Memory-Hard Functions**: Dynamic DAG-based memory access patterns
- **Side-Channel Protection**: Constant-time execution guarantees

### User Interface Components
- **Hash Interface**: Password hashing with configurable parameters
- **Verification System**: Hash validation and comparison
- **Benchmark Tool**: Performance testing across different configurations
- **Documentation**: Comprehensive algorithm documentation

### API Endpoints
- `POST /api/hash` - Generate password hash with custom parameters
- `POST /api/verify` - Verify password against existing hash
- `POST /api/benchmark` - Run performance benchmarks

## Data Flow

### Hash Generation Flow
1. User submits password and configuration parameters
2. Backend validates input using Zod schemas
3. Argon3 engine generates hash with quantum-resistant features
4. Configuration and result stored in database
5. Hash result returned to frontend with metrics

### Verification Flow
1. User provides password and hash for verification
2. Backend extracts parameters from hash
3. Argon3 engine recomputes hash with same parameters
4. Timing-safe comparison performed
5. Verification result returned with security metrics

### Benchmark Flow
1. User configures test parameters and hardware profile
2. Backend runs multiple hash operations with varying configurations
3. Performance metrics collected (execution time, memory usage, throughput)
4. Results aggregated and returned with optimization recommendations

## External Dependencies

### Frontend Dependencies
- **React Ecosystem**: React, React DOM, React Query
- **UI Components**: Radix UI primitives, Lucide React icons
- **Utilities**: clsx, tailwind-merge, date-fns
- **Development**: TypeScript, Vite, PostCSS

### Backend Dependencies
- **Core**: Express.js, TypeScript, tsx (development)
- **Database**: Drizzle ORM, @neondatabase/serverless
- **Security**: Argon2 (base), crypto (Node.js built-in)
- **Session**: express-session, connect-pg-simple
- **Validation**: Zod, drizzle-zod

### Database Schema
- **users**: User authentication and management
- **hash_configurations**: Algorithm parameter sets
- **hash_results**: Generated hashes with metadata
- **benchmark_results**: Performance test results

## Deployment Strategy

### Development Environment
- **Local Development**: `npm run dev` with hot reloading
- **Database**: Neon serverless PostgreSQL
- **Build Process**: Vite for frontend, esbuild for backend
- **Type Checking**: TypeScript with strict mode enabled

### Production Configuration
- **Build Command**: `npm run build` (frontend + backend bundling)
- **Start Command**: `npm start` (runs production build)
- **Database Migrations**: `npm run db:push` (Drizzle Kit)
- **Environment Variables**: DATABASE_URL required

### Performance Considerations
- **Memory Management**: Configurable memory allocation for hashing
- **Constant-Time Operations**: Side-channel attack prevention
- **Hardware Optimization**: Adaptive parallelism based on system capabilities
- **Caching Strategy**: React Query for client-side caching

## Changelog

Changelog:
- July 08, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.
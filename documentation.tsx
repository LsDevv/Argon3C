import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

export default function Documentation() {
  const [activeSection, setActiveSection] = useState("overview");
  
  const sections = [
    { id: "overview", title: "Overview", badge: null },
    { id: "algorithm", title: "Algorithm Details", badge: "Technical" },
    { id: "quantum", title: "Quantum Resistance", badge: "Security" },
    { id: "sidechannel", title: "Side-Channel Protection", badge: "Security" },
    { id: "memory", title: "Memory Access Patterns", badge: "Technical" },
    { id: "hardware", title: "Hardware Optimization", badge: "Performance" },
    { id: "api", title: "API Reference", badge: "Development" },
  ];
  
  const getSectionContent = (sectionId: string) => {
    switch (sectionId) {
      case "overview":
        return (
          <div className="prose prose-invert max-w-none">
            <h4 className="text-2xl font-bold mb-6">Argon3 Overview</h4>
            <p className="text-slate-300 mb-6 leading-relaxed">
              Argon3 is a next-generation password hashing algorithm that extends Argon2 with quantum-resistant 
              properties and enhanced side-channel protection mechanisms. It incorporates lattice-based cryptographic 
              primitives to ensure security against both classical and quantum attacks.
            </p>
            
            <h5 className="text-xl font-semibold mb-4 text-blue-400">Key Improvements over Argon2</h5>
            <ul className="list-disc list-inside space-y-2 text-slate-300 mb-6">
              <li>Post-quantum cryptographic primitives integration</li>
              <li>Dynamic memory access patterns based on input entropy</li>
              <li>Pseudo-randomly generated DAG structure</li>
              <li>Enhanced constant-time execution guarantees</li>
              <li>Adaptive hardware profiling and optimization</li>
            </ul>
            
            <h5 className="text-xl font-semibold mb-4 text-blue-400">Security Properties</h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="bg-slate-700 rounded-lg p-4">
                <h6 className="font-semibold text-emerald-400 mb-2">Quantum Resistance</h6>
                <p className="text-sm text-slate-300">Leverages lattice-based cryptography to resist quantum attacks</p>
              </div>
              <div className="bg-slate-700 rounded-lg p-4">
                <h6 className="font-semibold text-emerald-400 mb-2">Side-Channel Protection</h6>
                <p className="text-sm text-slate-300">Constant-time execution prevents timing attacks</p>
              </div>
              <div className="bg-slate-700 rounded-lg p-4">
                <h6 className="font-semibold text-emerald-400 mb-2">Memory Hardness</h6>
                <p className="text-sm text-slate-300">Dynamic DAG structure increases attack complexity</p>
              </div>
              <div className="bg-slate-700 rounded-lg p-4">
                <h6 className="font-semibold text-emerald-400 mb-2">Hardware Adaptive</h6>
                <p className="text-sm text-slate-300">Optimizes for different processor architectures</p>
              </div>
            </div>
          </div>
        );
      
      case "algorithm":
        return (
          <div className="prose prose-invert max-w-none">
            <h4 className="text-2xl font-bold mb-6">Algorithm Structure</h4>
            <div className="bg-slate-700 rounded-lg p-4 mb-6">
              <pre className="text-sm text-emerald-400 font-mono overflow-x-auto">
                <code>{`Argon3(password, salt, memory_cost, time_cost, parallelism, 
       quantum_mode=true, constant_time=true) {
    
    // Initialize quantum-resistant components
    lattice_key = generate_lattice_key(password, salt)
    
    // Create dynamic memory access pattern
    dag = generate_pseudo_random_dag(lattice_key, memory_cost)
    
    // Memory allocation with side-channel protection
    memory_blocks = allocate_protected_memory(memory_cost)
    
    // Main hashing loop with constant-time execution
    for (i = 0; i < time_cost; i++) {
        traverse_dag_constant_time(dag, memory_blocks)
        apply_quantum_resistant_transforms(memory_blocks)
    }
    
    // Final hash extraction
    return extract_hash(memory_blocks, lattice_key)
}`}</code>
              </pre>
            </div>
            
            <h5 className="text-xl font-semibold mb-4 text-blue-400">Implementation Details</h5>
            <p className="text-slate-300 mb-4">
              The algorithm uses a three-phase approach: initialization with quantum-resistant key generation,
              memory traversal with dynamic patterns, and final hash extraction with post-quantum transformations.
            </p>
          </div>
        );
      
      case "quantum":
        return (
          <div className="prose prose-invert max-w-none">
            <h4 className="text-2xl font-bold mb-6">Quantum Resistance</h4>
            <p className="text-slate-300 mb-6">
              Argon3 integrates lattice-based cryptographic primitives to provide resistance against 
              quantum computer attacks, ensuring long-term security even as quantum computing advances.
            </p>
            
            <h5 className="text-xl font-semibold mb-4 text-blue-400">Quantum-Resistant Components</h5>
            <ul className="list-disc list-inside space-y-2 text-slate-300 mb-6">
              <li>Lattice-based key generation using Learning With Errors (LWE)</li>
              <li>Post-quantum cryptographic transformations</li>
              <li>Quantum-resistant pseudorandom number generation</li>
              <li>Enhanced security margins against quantum attacks</li>
            </ul>
            
            <div className="bg-slate-700 rounded-lg p-4 mb-6">
              <h6 className="font-semibold text-emerald-400 mb-2">Security Analysis</h6>
              <p className="text-sm text-slate-300">
                The quantum resistance is achieved through carefully designed lattice problems that are 
                believed to be hard even for quantum computers, providing at least 256-bit post-quantum security.
              </p>
            </div>
          </div>
        );
      
      case "sidechannel":
        return (
          <div className="prose prose-invert max-w-none">
            <h4 className="text-2xl font-bold mb-6">Side-Channel Protection</h4>
            <p className="text-slate-300 mb-6">
              Argon3 implements comprehensive side-channel protection mechanisms to prevent 
              timing attacks, cache-based attacks, and other side-channel vulnerabilities.
            </p>
            
            <h5 className="text-xl font-semibold mb-4 text-blue-400">Protection Mechanisms</h5>
            <div className="space-y-4">
              <div className="bg-slate-700 rounded-lg p-4">
                <h6 className="font-semibold text-blue-400 mb-2">Constant-Time Execution</h6>
                <p className="text-sm text-slate-300">
                  All operations are performed in constant time to prevent timing analysis attacks.
                </p>
              </div>
              <div className="bg-slate-700 rounded-lg p-4">
                <h6 className="font-semibold text-blue-400 mb-2">Cache-Timing Resistance</h6>
                <p className="text-sm text-slate-300">
                  Memory access patterns are obfuscated to prevent cache-timing attacks.
                </p>
              </div>
              <div className="bg-slate-700 rounded-lg p-4">
                <h6 className="font-semibold text-blue-400 mb-2">Power Analysis Protection</h6>
                <p className="text-sm text-slate-300">
                  Uniform memory access patterns help protect against power analysis attacks.
                </p>
              </div>
            </div>
          </div>
        );
      
      case "memory":
        return (
          <div className="prose prose-invert max-w-none">
            <h4 className="text-2xl font-bold mb-6">Memory Access Patterns</h4>
            <p className="text-slate-300 mb-6">
              Unlike Argon2's fixed memory graph, Argon3 uses dynamically generated memory access 
              patterns based on input entropy to increase attack complexity.
            </p>
            
            <h5 className="text-xl font-semibold mb-4 text-blue-400">Dynamic DAG Generation</h5>
            <p className="text-slate-300 mb-4">
              The algorithm generates a pseudo-random Directed Acyclic Graph (DAG) for each hash operation,
              making it impossible for attackers to predict memory access patterns.
            </p>
            
            <div className="bg-slate-700 rounded-lg p-4 mb-6">
              <h6 className="font-semibold text-emerald-400 mb-2">Benefits</h6>
              <ul className="text-sm text-slate-300 space-y-1">
                <li>• Increased resistance to memory-based attacks</li>
                <li>• Higher computational complexity for attackers</li>
                <li>• Better utilization of available memory bandwidth</li>
                <li>• Adaptive optimization for different hardware</li>
              </ul>
            </div>
          </div>
        );
      
      case "hardware":
        return (
          <div className="prose prose-invert max-w-none">
            <h4 className="text-2xl font-bold mb-6">Hardware Optimization</h4>
            <p className="text-slate-300 mb-6">
              Argon3 includes hardware profiling capabilities to optimize performance across 
              different processor architectures while maintaining security guarantees.
            </p>
            
            <h5 className="text-xl font-semibold mb-4 text-blue-400">Supported Architectures</h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <div className="bg-slate-700 rounded-lg p-4">
                <h6 className="font-semibold text-blue-400 mb-2">CPU Optimization</h6>
                <p className="text-sm text-slate-300">
                  Optimized for modern x86-64 processors with AVX2 support.
                </p>
              </div>
              <div className="bg-slate-700 rounded-lg p-4">
                <h6 className="font-semibold text-blue-400 mb-2">GPU Acceleration</h6>
                <p className="text-sm text-slate-300">
                  Parallel processing optimizations for CUDA and OpenCL.
                </p>
              </div>
              <div className="bg-slate-700 rounded-lg p-4">
                <h6 className="font-semibold text-blue-400 mb-2">ARM Support</h6>
                <p className="text-sm text-slate-300">
                  Optimized for ARM processors with NEON instructions.
                </p>
              </div>
            </div>
          </div>
        );
      
      case "api":
        return (
          <div className="prose prose-invert max-w-none">
            <h4 className="text-2xl font-bold mb-6">API Reference</h4>
            
            <div className="space-y-6">
              <div className="bg-slate-700 rounded-lg p-4">
                <h5 className="text-lg font-semibold mb-3 text-blue-400">POST /api/hash</h5>
                <p className="text-sm text-slate-300 mb-3">Generate an Argon3 hash</p>
                <div className="bg-slate-800 rounded p-3 text-sm font-mono text-emerald-400">
                  {`{
  "password": "string",
  "salt": "string (optional)",
  "memoryCost": 64,
  "timeCost": 3,
  "parallelism": 1,
  "hashLength": 32,
  "quantumMode": true,
  "constantTime": true,
  "sideChannelProtection": true
}`}
                </div>
              </div>
              
              <div className="bg-slate-700 rounded-lg p-4">
                <h5 className="text-lg font-semibold mb-3 text-blue-400">POST /api/verify</h5>
                <p className="text-sm text-slate-300 mb-3">Verify a password against an Argon3 hash</p>
                <div className="bg-slate-800 rounded p-3 text-sm font-mono text-emerald-400">
                  {`{
  "password": "string",
  "hash": "string"
}`}
                </div>
              </div>
              
              <div className="bg-slate-700 rounded-lg p-4">
                <h5 className="text-lg font-semibold mb-3 text-blue-400">POST /api/benchmark</h5>
                <p className="text-sm text-slate-300 mb-3">Run performance benchmarks</p>
                <div className="bg-slate-800 rounded p-3 text-sm font-mono text-emerald-400">
                  {`{
  "testDuration": 30,
  "memoryRange": {"min": 16, "max": 256},
  "hardwareProfile": "auto"
}`}
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return <div>Content not found</div>;
    }
  };
  
  return (
    <section id="docs" className="py-12 sm:py-16 bg-slate-800/50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">Documentation</h3>
          
          <div className="grid lg:grid-cols-4 gap-6 sm:gap-8">
            {/* Sidebar Navigation */}
            <Card className="bg-slate-800 border-slate-700 lg:sticky lg:top-20 lg:h-fit">
              <CardHeader>
                <CardTitle className="text-lg">Topics</CardTitle>
              </CardHeader>
              <CardContent>
                <nav className="space-y-2">
                  {sections.map((section) => (
                    <Button
                      key={section.id}
                      variant={activeSection === section.id ? "default" : "ghost"}
                      onClick={() => setActiveSection(section.id)}
                      className="w-full justify-start text-left text-sm sm:text-base"
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="truncate">{section.title}</span>
                        {section.badge && (
                          <Badge variant="secondary" className="ml-2 text-xs hidden sm:inline">
                            {section.badge}
                          </Badge>
                        )}
                      </div>
                    </Button>
                  ))}
                </nav>
              </CardContent>
            </Card>
            
            {/* Documentation Content */}
            <div className="lg:col-span-3">
              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="p-4 sm:p-6">
                  <ScrollArea className="h-[400px] sm:h-[600px] pr-2 sm:pr-4">
                    {getSectionContent(activeSection)}
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

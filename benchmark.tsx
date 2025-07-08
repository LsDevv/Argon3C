import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Play, BarChart3 } from "lucide-react";

interface BenchmarkResult {
  success: boolean;
  results: Array<{
    configuration: any;
    metrics: {
      averageTime: number;
      minTime: number;
      maxTime: number;
      throughput: number;
      memoryEfficiency: number;
      peakMemory: number;
      cpuUtilization: number;
    };
  }>;
  summary: {
    totalTests: number;
    averageTime: number;
    peakMemory: number;
    bestThroughput: number;
  };
}

export default function Benchmark() {
  const [testDuration, setTestDuration] = useState(30);
  const [memoryMin, setMemoryMin] = useState(16);
  const [memoryMax, setMemoryMax] = useState(256);
  const [hardwareProfile, setHardwareProfile] = useState("auto");
  const [result, setResult] = useState<BenchmarkResult | null>(null);
  
  const { toast } = useToast();
  
  const benchmarkMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/benchmark", {
        testDuration,
        memoryRange: { min: memoryMin, max: memoryMax },
        hardwareProfile
      });
      return response.json();
    },
    onSuccess: (data) => {
      setResult(data);
      toast({
        title: "Benchmark Completed",
        description: `Completed ${data.summary.totalTests} tests in ${testDuration} seconds`,
      });
    },
    onError: (error) => {
      toast({
        title: "Benchmark Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  const formatTime = (ms: number) => {
    if (ms < 1000) return `${ms.toFixed(0)}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };
  
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  return (
    <section id="benchmark" className="py-12 sm:py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">Performance Benchmark</h3>
          
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl text-center">Benchmark Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
                
                {/* Configuration Panel */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold mb-4">Test Configuration</h4>
                  
                  <div>
                    <Label htmlFor="duration" className="text-slate-300">Test Duration (seconds)</Label>
                    <Select value={testDuration.toString()} onValueChange={(value) => setTestDuration(Number(value))}>
                      <SelectTrigger className="bg-slate-700 border-slate-600">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10 seconds</SelectItem>
                        <SelectItem value="30">30 seconds</SelectItem>
                        <SelectItem value="60">1 minute</SelectItem>
                        <SelectItem value="300">5 minutes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label className="text-slate-300">Memory Range (MB)</Label>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        value={memoryMin}
                        onChange={(e) => setMemoryMin(Number(e.target.value))}
                        placeholder="Min MB"
                        min="1"
                        max="512"
                        className="bg-slate-700 border-slate-600 text-slate-100"
                      />
                      <Input
                        type="number"
                        value={memoryMax}
                        onChange={(e) => setMemoryMax(Number(e.target.value))}
                        placeholder="Max MB"
                        min="1"
                        max="1024"
                        className="bg-slate-700 border-slate-600 text-slate-100"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="hardware" className="text-slate-300">Hardware Profile</Label>
                    <Select value={hardwareProfile} onValueChange={setHardwareProfile}>
                      <SelectTrigger className="bg-slate-700 border-slate-600">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="auto">Auto-detect</SelectItem>
                        <SelectItem value="cpu">CPU Optimized</SelectItem>
                        <SelectItem value="gpu">GPU Optimized</SelectItem>
                        <SelectItem value="arm">ARM Optimized</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button
                    onClick={() => benchmarkMutation.mutate()}
                    disabled={benchmarkMutation.isPending}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                  >
                    {benchmarkMutation.isPending ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Running Benchmark...
                      </>
                    ) : (
                      <>
                        <Play className="mr-2" size={16} />
                        Start Benchmark
                      </>
                    )}
                  </Button>
                </div>
                
                {/* Results Panel */}
                <div className="lg:col-span-2">
                  <h4 className="text-lg font-semibold mb-4">Performance Results</h4>
                  
                  {result ? (
                    <div className="space-y-6">
                      {/* Chart Placeholder */}
                      <div className="bg-slate-700 rounded-lg p-6 h-80 flex items-center justify-center">
                        <div className="text-center">
                          <BarChart3 className="mx-auto text-blue-400 mb-4" size={48} />
                          <p className="text-slate-300">Performance visualization</p>
                          <p className="text-sm text-slate-400">
                            {result.summary.totalTests} tests completed
                          </p>
                        </div>
                      </div>
                      
                      {/* Performance Stats */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-slate-700 rounded-lg p-3 sm:p-4 text-center">
                          <div className="text-xl sm:text-2xl font-bold text-blue-400">
                            {formatTime(result.summary.averageTime)}
                          </div>
                          <div className="text-xs sm:text-sm text-slate-400">Avg Time</div>
                        </div>
                        <div className="bg-slate-700 rounded-lg p-3 sm:p-4 text-center">
                          <div className="text-xl sm:text-2xl font-bold text-purple-400">
                            {formatBytes(result.summary.peakMemory)}
                          </div>
                          <div className="text-xs sm:text-sm text-slate-400">Peak Memory</div>
                        </div>
                        <div className="bg-slate-700 rounded-lg p-3 sm:p-4 text-center">
                          <div className="text-xl sm:text-2xl font-bold text-emerald-400">
                            {result.summary.bestThroughput.toFixed(2)}
                          </div>
                          <div className="text-xs sm:text-sm text-slate-400">Hashes/sec</div>
                        </div>
                      </div>
                      
                      {/* Detailed Results */}
                      <div className="bg-slate-700 rounded-lg p-4">
                        <h5 className="font-semibold mb-3">Test Results</h5>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                          {result.results.map((test, index) => (
                            <div key={index} className="flex justify-between items-center text-sm">
                              <span className="text-slate-300">
                                {test.configuration.memoryCost}MB Memory
                              </span>
                              <span className="text-blue-400">
                                {formatTime(test.metrics.averageTime)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-slate-700 rounded-lg p-6 h-80 flex items-center justify-center">
                      <div className="text-center text-slate-400">
                        <BarChart3 className="mx-auto mb-4" size={48} />
                        <p>Performance chart will appear here</p>
                        <p className="text-sm">Run benchmark to see results</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

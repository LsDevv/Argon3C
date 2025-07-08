import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Key, Fingerprint, Eye, EyeOff, Dice6, Copy, Settings, ChevronDown } from "lucide-react";

interface HashResult {
  success: boolean;
  hash: string;
  salt: string;
  executionTime: number;
  memoryUsage: number;
  securityLevel: number;
  quantumResistant: boolean;
  constantTime: boolean;
  sideChannelProtection: boolean;
}

export default function HashInterface() {
  const [password, setPassword] = useState("");
  const [salt, setSalt] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [memoryCost, setMemoryCost] = useState(64);
  const [timeCost, setTimeCost] = useState(3);
  const [parallelism, setParallelism] = useState(1);
  const [hashLength, setHashLength] = useState(32);
  const [quantumMode, setQuantumMode] = useState(true);
  const [constantTime, setConstantTime] = useState(true);
  const [sideChannelProtection, setSideChannelProtection] = useState(true);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [result, setResult] = useState<HashResult | null>(null);
  
  const { toast } = useToast();
  
  const hashMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/hash", {
        password,
        salt: salt || undefined,
        memoryCost,
        timeCost,
        parallelism,
        hashLength,
        quantumMode,
        constantTime,
        sideChannelProtection
      });
      return response.json();
    },
    onSuccess: (data) => {
      setResult(data);
      toast({
        title: "Hash Generated Successfully",
        description: `Completed in ${data.executionTime}ms with ${data.securityLevel}-bit security`,
      });
    },
    onError: (error) => {
      toast({
        title: "Hash Generation Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  const generateSalt = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 32; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setSalt(result);
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to Clipboard",
      description: "Hash has been copied to your clipboard",
    });
  };
  
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  return (
    <section id="hash" className="py-12 sm:py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
            
            {/* Password Hashing Panel */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center text-2xl">
                  <Key className="text-blue-400 mr-3" size={24} />
                  Password Hashing
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                
                {/* Password Input */}
                <div>
                  <Label htmlFor="password" className="text-slate-300">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password to hash"
                      className="bg-slate-700 border-slate-600 text-slate-100 pr-12"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-200"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </Button>
                  </div>
                </div>

                {/* Salt Input */}
                <div>
                  <Label htmlFor="salt" className="text-slate-300">Salt (Optional)</Label>
                  <div className="flex gap-2">
                    <Input
                      id="salt"
                      type="text"
                      value={salt}
                      onChange={(e) => setSalt(e.target.value)}
                      placeholder="Auto-generated if empty"
                      className="bg-slate-700 border-slate-600 text-slate-100 font-mono text-sm"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={generateSalt}
                      className="border-slate-600 text-slate-400 hover:bg-slate-700"
                    >
                      <Dice6 size={16} />
                    </Button>
                  </div>
                </div>

                {/* Algorithm Parameters */}
                <div>
                  <h4 className="text-lg font-semibold mb-4">Algorithm Parameters</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="memory" className="text-slate-300 text-sm">Memory Cost (MB)</Label>
                      <Input
                        id="memory"
                        type="number"
                        value={memoryCost}
                        onChange={(e) => setMemoryCost(Number(e.target.value))}
                        min="1"
                        max="1024"
                        className="bg-slate-700 border-slate-600 text-slate-100"
                      />
                    </div>
                    <div>
                      <Label htmlFor="time" className="text-slate-300 text-sm">Time Cost</Label>
                      <Input
                        id="time"
                        type="number"
                        value={timeCost}
                        onChange={(e) => setTimeCost(Number(e.target.value))}
                        min="1"
                        max="10"
                        className="bg-slate-700 border-slate-600 text-slate-100"
                      />
                    </div>
                    <div>
                      <Label htmlFor="parallelism" className="text-slate-300 text-sm">Parallelism</Label>
                      <Input
                        id="parallelism"
                        type="number"
                        value={parallelism}
                        onChange={(e) => setParallelism(Number(e.target.value))}
                        min="1"
                        max="16"
                        className="bg-slate-700 border-slate-600 text-slate-100"
                      />
                    </div>
                    <div>
                      <Label htmlFor="hashLength" className="text-slate-300 text-sm">Hash Length</Label>
                      <Input
                        id="hashLength"
                        type="number"
                        value={hashLength}
                        onChange={(e) => setHashLength(Number(e.target.value))}
                        min="16"
                        max="128"
                        className="bg-slate-700 border-slate-600 text-slate-100"
                      />
                    </div>
                  </div>
                </div>

                {/* Advanced Options */}
                <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" className="flex items-center text-blue-400 hover:text-blue-300 p-0">
                      <Settings className="mr-2" size={16} />
                      Advanced Options
                      <ChevronDown className={`ml-2 h-4 w-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-4 mt-4">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="quantum-mode"
                        checked={quantumMode}
                        onCheckedChange={setQuantumMode}
                      />
                      <Label htmlFor="quantum-mode" className="text-slate-300">Enable Quantum-Resilient Mode</Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="constant-time"
                        checked={constantTime}
                        onCheckedChange={setConstantTime}
                      />
                      <Label htmlFor="constant-time" className="text-slate-300">Constant-Time Execution</Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="side-channel"
                        checked={sideChannelProtection}
                        onCheckedChange={setSideChannelProtection}
                      />
                      <Label htmlFor="side-channel" className="text-slate-300">Side-Channel Protection</Label>
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                {/* Hash Button */}
                <Button
                  onClick={() => hashMutation.mutate()}
                  disabled={!password || hashMutation.isPending}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {hashMutation.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Generating Hash...
                    </>
                  ) : (
                    <>
                      <Key className="mr-2" size={16} />
                      Generate Hash
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Results Panel */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center text-2xl">
                  <Fingerprint className="text-emerald-400 mr-3" size={24} />
                  Results
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">

                {/* Hash Output */}
                {result ? (
                  <>
                    <div>
                      <Label className="text-slate-300">Generated Hash</Label>
                      <div className="bg-slate-700 rounded-lg p-4 border border-slate-600">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-slate-400">Argon3 Hash</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(result.hash)}
                            className="text-slate-400 hover:text-slate-200"
                          >
                            <Copy size={16} />
                          </Button>
                        </div>
                        <code className="text-sm text-emerald-400 font-mono break-all block">
                          {result.hash}
                        </code>
                      </div>
                    </div>

                    {/* Performance Metrics */}
                    <div>
                      <h4 className="text-lg font-semibold mb-4">Performance Metrics</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div className="bg-slate-700 rounded-lg p-3 sm:p-4">
                          <div className="text-xs sm:text-sm text-slate-400">Execution Time</div>
                          <div className="text-lg sm:text-2xl font-bold text-blue-400">{result.executionTime}ms</div>
                        </div>
                        <div className="bg-slate-700 rounded-lg p-3 sm:p-4">
                          <div className="text-xs sm:text-sm text-slate-400">Memory Usage</div>
                          <div className="text-lg sm:text-2xl font-bold text-purple-400">{formatBytes(result.memoryUsage)}</div>
                        </div>
                        <div className="bg-slate-700 rounded-lg p-3 sm:p-4">
                          <div className="text-xs sm:text-sm text-slate-400">Security Level</div>
                          <div className="text-lg sm:text-2xl font-bold text-emerald-400">{result.securityLevel}-bit</div>
                        </div>
                        <div className="bg-slate-700 rounded-lg p-3 sm:p-4">
                          <div className="text-xs sm:text-sm text-slate-400">Quantum Resistant</div>
                          <div className="text-lg sm:text-2xl font-bold text-emerald-400">
                            {result.quantumResistant ? 'Yes' : 'No'}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Security Analysis */}
                    <div>
                      <h4 className="text-lg font-semibold mb-4">Security Analysis</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-300">Constant-Time Execution</span>
                          <span className="text-emerald-400">
                            {result.constantTime ? '✓' : '✗'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-300">Side-Channel Protection</span>
                          <span className="text-emerald-400">
                            {result.sideChannelProtection ? '✓' : '✗'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-300">Memory Access Pattern</span>
                          <span className="text-emerald-400">Dynamic</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-300">Post-Quantum Primitives</span>
                          <span className="text-emerald-400">
                            {result.quantumResistant ? 'Active' : 'Disabled'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-slate-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Fingerprint className="text-slate-400" size={32} />
                    </div>
                    <p className="text-slate-400">Enter a password and click "Generate Hash" to see results</p>
                  </div>
                )}

              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}

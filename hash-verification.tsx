import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { CheckCircle, XCircle, HelpCircle } from "lucide-react";

interface VerificationResult {
  success: boolean;
  valid: boolean;
  message: string;
}

export default function HashVerification() {
  const [password, setPassword] = useState("");
  const [hash, setHash] = useState("");
  const [result, setResult] = useState<VerificationResult | null>(null);
  
  const { toast } = useToast();
  
  const verifyMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/verify", {
        password,
        hash
      });
      return response.json();
    },
    onSuccess: (data) => {
      setResult(data);
      toast({
        title: data.valid ? "Verification Successful" : "Verification Failed",
        description: data.message,
        variant: data.valid ? "default" : "destructive",
      });
    },
    onError: (error) => {
      toast({
        title: "Verification Error",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  const getResultIcon = () => {
    if (!result) return <HelpCircle className="text-slate-400" size={32} />;
    return result.valid 
      ? <CheckCircle className="text-emerald-400" size={32} />
      : <XCircle className="text-red-400" size={32} />;
  };
  
  const getResultText = () => {
    if (!result) return "Enter password and hash to verify";
    return result.message;
  };
  
  const getResultColor = () => {
    if (!result) return "text-slate-400";
    return result.valid ? "text-emerald-400" : "text-red-400";
  };
  
  return (
    <section id="verify" className="py-12 sm:py-16 bg-slate-800/50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">Hash Verification</h3>
          
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl text-center">Verify Argon3 Hash</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
                
                {/* Input Section */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="verify-password" className="text-slate-300">Password</Label>
                    <Input
                      id="verify-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password to verify"
                      className="bg-slate-700 border-slate-600 text-slate-100"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="verify-hash" className="text-slate-300">Hash</Label>
                    <Textarea
                      id="verify-hash"
                      value={hash}
                      onChange={(e) => setHash(e.target.value)}
                      placeholder="Paste Argon3 hash here"
                      rows={3}
                      className="bg-slate-700 border-slate-600 text-slate-100 font-mono text-sm"
                    />
                  </div>
                  
                  <Button
                    onClick={() => verifyMutation.mutate()}
                    disabled={!password || !hash || verifyMutation.isPending}
                    className="w-full bg-emerald-600 hover:bg-emerald-700"
                  >
                    {verifyMutation.isPending ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Verifying...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="mr-2" size={16} />
                        Verify Hash
                      </>
                    )}
                  </Button>
                </div>
                
                {/* Result Section */}
                <div className="bg-slate-700 rounded-lg p-6">
                  <h4 className="text-lg font-semibold mb-4">Verification Result</h4>
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-slate-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      {getResultIcon()}
                    </div>
                    <p className={`font-medium ${getResultColor()}`}>
                      {getResultText()}
                    </p>
                    
                    {result && (
                      <div className="mt-6 p-4 bg-slate-800 rounded-lg">
                        <div className="text-sm text-slate-400 mb-2">Status</div>
                        <div className={`text-lg font-semibold ${getResultColor()}`}>
                          {result.valid ? "✓ Valid" : "✗ Invalid"}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

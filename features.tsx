import { Card, CardContent } from "@/components/ui/card";
import { Atom, MemoryStick, Shield } from "lucide-react";

export default function Features() {
  const features = [
    {
      icon: Atom,
      title: "Quantum-Resilient",
      description: "Integrates lattice-based cryptographic components to resist quantum brute-force attacks.",
      color: "bg-purple-600"
    },
    {
      icon: MemoryStick,
      title: "Dynamic MemoryStick-Hard",
      description: "Uses pseudo-randomly generated DAG to traverse memory blocks unpredictably.",
      color: "bg-blue-600"
    },
    {
      icon: Shield,
      title: "Side-Channel Protection",
      description: "Constant-time execution with adaptive memory access patterns for enhanced security.",
      color: "bg-emerald-600"
    }
  ];
  
  return (
    <section className="py-12 sm:py-16 bg-slate-800/50">
      <div className="container mx-auto px-4">
        <h3 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">Advanced Security Features</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature) => (
            <Card key={feature.title} className="bg-slate-800 border-slate-700">
              <CardContent className="p-4 sm:p-6">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 ${feature.color} rounded-lg flex items-center justify-center mb-3 sm:mb-4`}>
                  <feature.icon className="text-white" size={20} />
                </div>
                <h4 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">{feature.title}</h4>
                <p className="text-sm sm:text-base text-slate-300">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

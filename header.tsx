import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Shield, Menu } from "lucide-react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  
  const navItems = [
    { href: "#hash", label: "Hash" },
    { href: "#verify", label: "Verify" },
    { href: "#benchmark", label: "Benchmark" },
    { href: "#docs", label: "Documentation" },
  ];
  
  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false);
  };
  
  return (
    <header className="bg-slate-800 border-b border-slate-700 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 quantum-gradient rounded-lg flex items-center justify-center">
              <Shield className="text-white" size={16} />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gradient">Argon3</h1>
              <p className="text-xs text-slate-400 hidden sm:block">Quantum-Resilient Password Hashing</p>
            </div>
          </div>
          
          <nav className="hidden lg:flex space-x-6">
            {navItems.map((item) => (
              <button
                key={item.href}
                onClick={() => scrollToSection(item.href)}
                className="text-slate-300 hover:text-blue-400 transition-colors text-sm"
              >
                {item.label}
              </button>
            ))}
          </nav>
          
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] sm:w-[320px]">
              <nav className="flex flex-col space-y-4 mt-8">
                {navItems.map((item) => (
                  <button
                    key={item.href}
                    onClick={() => scrollToSection(item.href)}
                    className="text-left text-slate-300 hover:text-blue-400 transition-colors py-3 text-lg border-b border-slate-700 last:border-b-0"
                  >
                    {item.label}
                  </button>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

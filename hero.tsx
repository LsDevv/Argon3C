import { Button } from "@/components/ui/button";
import { Lock, BookOpen } from "lucide-react";

export default function Hero() {
  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  return (
    <section className="py-12 sm:py-16 hero-gradient">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-gradient">
            Next-Generation Password Hashing
          </h2>
          <p className="text-lg sm:text-xl text-slate-300 mb-6 sm:mb-8 leading-relaxed px-4">
            Argon3 integrates post-quantum cryptographic primitives with dynamic memory-hard functions 
            to provide quantum-resilient password hashing with advanced side-channel protection.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            <Button 
              onClick={() => scrollToSection('#hash')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-3 font-semibold w-full sm:w-auto"
            >
              <Lock className="mr-2 h-4 w-4" />
              Start Hashing
            </Button>
            <Button 
              onClick={() => scrollToSection('#docs')}
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-700 px-6 sm:px-8 py-3 font-semibold w-full sm:w-auto"
            >
              <BookOpen className="mr-2 h-4 w-4" />
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

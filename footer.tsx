import { Shield } from "lucide-react";

export default function Footer() {
  const footerSections = [
    {
      title: "Documentation",
      links: [
        { name: "API Reference", href: "#" },
        { name: "Algorithm Details", href: "#" },
        { name: "Security Analysis", href: "#" },
        { name: "Performance Guide", href: "#" },
      ]
    },
    {
      title: "Tools",
      links: [
        { name: "Hash Generator", href: "#hash" },
        { name: "Hash Verifier", href: "#verify" },
        { name: "Benchmark Tool", href: "#benchmark" },
        { name: "Parameter Calculator", href: "#" },
      ]
    },
    {
      title: "Community",
      links: [
        { name: "GitHub Repository", href: "#" },
        { name: "Research Papers", href: "#" },
        { name: "Security Advisories", href: "#" },
        { name: "Contact", href: "#" },
      ]
    }
  ];
  
  const scrollToSection = (href: string) => {
    if (href.startsWith("#") && href.length > 1) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };
  
  return (
    <footer className="bg-slate-800 border-t border-slate-700 py-8 sm:py-12">
      <div className="container mx-auto px-4">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 quantum-gradient rounded-lg flex items-center justify-center">
                <Shield className="text-white" size={16} />
              </div>
              <span className="text-xl font-bold text-gradient">Argon3</span>
            </div>
            <p className="text-slate-400 text-sm">
              Next-generation quantum-resilient password hashing for secure authentication.
            </p>
          </div>
          
          {footerSections.map((section) => (
            <div key={section.title}>
              <h5 className="font-semibold text-slate-300 mb-4">{section.title}</h5>
              <ul className="space-y-2 text-sm">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <button
                      onClick={() => scrollToSection(link.href)}
                      className="text-slate-400 hover:text-blue-400 transition-colors text-left"
                    >
                      {link.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="border-t border-slate-700 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center text-slate-400 text-sm">
          <p>&copy; 2025 Argon3. Cryptographic security for the quantum age.</p>
        </div>
      </div>
    </footer>
  );
}

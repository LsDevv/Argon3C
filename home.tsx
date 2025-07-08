import Header from "@/components/header";
import Hero from "@/components/hero";
import Features from "@/components/features";
import HashInterface from "@/components/hash-interface";
import HashVerification from "@/components/hash-verification";
import Benchmark from "@/components/benchmark";
import Documentation from "@/components/documentation";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <Header />
      <main>
        <Hero />
        <Features />
        <HashInterface />
        <HashVerification />
        <Benchmark />
        <Documentation />
      </main>
      <Footer />
    </div>
  );
}

import { usePortfolio } from "@/hooks/usePortfolio";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/features/Hero";
import About from "@/components/features/About";
import Services from "@/components/features/Services";
import Projects from "@/components/features/Projects";
import Contact from "@/components/features/Contact";

export default function Home() {
  const { data } = usePortfolio();

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero data={data} />
        <About data={data} />
        <Projects data={data} />
        <Services data={data} />
        <Contact data={data} />
      </main>
      <Footer data={data} />
    </div>
  );
}

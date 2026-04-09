import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import LiveProducts from "@/components/LiveProducts";
import Experience from "@/components/Experience";
import Education from "@/components/Education";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-background pt-20 text-foreground">
      <Navbar />

      <ScrollReveal>
        <Hero />
      </ScrollReveal>

      <ScrollReveal delay={0.03}>
        <Skills />
      </ScrollReveal>

      <ScrollReveal delay={0.05}>
        <Projects />
      </ScrollReveal>

      <ScrollReveal delay={0.07}>
        <LiveProducts />
      </ScrollReveal>

      <ScrollReveal delay={0.09}>
        <Experience />
      </ScrollReveal>

      <ScrollReveal delay={0.11}>
        <Education />
      </ScrollReveal>

      <ScrollReveal delay={0.13}>
        <Contact />
      </ScrollReveal>

      <ScrollReveal delay={0.15}>
        <Footer />
      </ScrollReveal>
    </main>
  );
}

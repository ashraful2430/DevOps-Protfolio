import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import LiveProducts from "@/components/LiveProducts";
import Experience from "@/components/Experience";
import Education from "@/components/Education";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-background pt-20 text-foreground">
      <Navbar />
      <Hero />
      <Skills />
      <Projects />
      <LiveProducts />
      <Experience />
      <Education />
      <Contact />
      <Footer />
    </main>
  );
}
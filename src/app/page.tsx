import About from "@/components/about";
import Contact from "@/components/contact";
import BestSellers from "./_components/BestSellers";
import Hero from "./_components/Hero";

export default function Home() {
  return (
    <div >
      <Hero />
      <BestSellers />
      <About />
      <Contact />
    </div>
  );
}

import About from "@/app/components/About";
import Faq from "@/app/components/Faq";
import Hero from "@/app/components/Hero";
import Glimpses from "@/app/components/Glimpses";
import Navbar from "@/app/components/Navbar";
import Stacks from "@/app/components/Stacks";

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="main">
        <Hero />
        <About />
        <Stacks />
        <Glimpses />
        <Faq />
      </main>
    </>
  );
}

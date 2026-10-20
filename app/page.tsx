import Hero from "@/app/components/Hero";
import Navbar from "@/app/components/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="main">
        <Hero />
      </main>
    </>
  );
}

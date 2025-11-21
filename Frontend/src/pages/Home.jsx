import React from "react";
import Hero from "../components/Hero";
import MarqueeSection from "../components/MarqueeSection";
import CardsSwap from "../components/CardsSwap";
import DigitalProducts from "../components/DigitalProducts";
import RoadmapSection from "../components/RoadmapSection";
import FAQSection from "../components/FAQSection";

const Home = () => {
  // Common class for every full-screen section
  const sectionClass =
    "w-full min-h-screen snap-start snap-always flex flex-col justify-center relative";

  return (
    <main className="w-full">
      {/* Section 1: Hero */}
      <section className={sectionClass}>
        <Hero />
      </section>

      {/* Section 2: Marquee + Book (Combined if they fit, or separate) */}
      {/* Marquee is small, so we can group it with the next one or give it its own small snap space */}
      <section className="w-full snap-start">
        <MarqueeSection />
      </section>

      {/* Section 3: The Syllabus Book */}
      <section className={sectionClass}>
        <CardsSwap />
      </section>

      {/* Section 4: Products */}
      <section className={sectionClass}>
        <DigitalProducts />
      </section>

      {/* Section 5: Roadmap */}
      <section className={sectionClass}>
        <RoadmapSection />
      </section>

      {/* Section 6: FAQ */}
      <section className={sectionClass}>
        <FAQSection />
      </section>
    </main>
  );
};

export default Home;

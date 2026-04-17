"use client";

import { useRef, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Hero from "@/sections/Hero";
import StackedSection from "@/components/StackedSection";
import Manifesto from "@/sections/Manifesto";
import FeaturedGallery from "@/sections/FeaturedGallery";
import TechSpecs from "@/sections/TechSpecs";
import Services from "@/sections/Services";
import Marquee from "@/sections/Marquee";

export default function Home() {
  const whiteZoneRef = useRef<HTMLDivElement>(null);
  
  // -- ZONE 1: Gallery & TechSpecs (Unified White Transition) --
  const { scrollYProgress } = useScroll({
    target: whiteZoneRef,
    // "start 60%" -> Begins fading to white well before entering
    // "start 20%" -> Solid white by the time Gallery is centered
    // "end 80%"   -> Stays white throughout Gallery and TechSpecs
    // "end 45%"   -> Fades back to black as Services enters
    offset: ["start 65%", "start 25%", "end 85%", "end 45%"]
  });

  const bgColor = useTransform(
    scrollYProgress,
    [0, 0.25, 0.75, 1],
    ["#030303", "#f5f5f5", "#f5f5f5", "#030303"]
  );

  const textColor = useTransform(
    scrollYProgress,
    [0, 0.2, 0.8, 1],
    ["#ffffff", "#000000", "#000000", "#ffffff"]
  );

  const mutedColor = useTransform(
    scrollYProgress,
    [0, 0.25, 0.75, 1],
    ["rgba(232, 232, 230, 0.1)", "rgba(0, 0, 0, 0.1)", "rgba(0, 0, 0, 0.1)", "rgba(232, 232, 230, 0.1)"]
  );

  const secondaryTextColor = useTransform(
    scrollYProgress,
    [0, 0.25, 0.75, 1],
    ["rgba(255, 255, 255, 0.6)", "rgba(0, 0, 0, 0.6)", "rgba(0, 0, 0, 0.6)", "rgba(255, 255, 255, 0.6)"]
  );

  return (
    <main style={{ position: "relative" }}>
      <Navigation />

      <StackedSection zIndex={20} color="#030303">
        <Hero />
      </StackedSection>

      {/* Main Orchestrated Container */}
      <motion.div 
        style={{ 
          position: "relative", 
          zIndex: 10, 
          backgroundColor: bgColor,
          borderTopLeftRadius: "40px", 
          borderTopRightRadius: "40px",
          willChange: "background-color",
          backfaceVisibility: "hidden"
        }}
      >
        <div style={{ position: "relative", zIndex: 20 }}>
          <Manifesto textColor={textColor} mutedColor={mutedColor} />
        </div>
        
        {/* Unified White Zone */}
        <div ref={whiteZoneRef} style={{ position: "relative" }}>
          <section id="products">
            <FeaturedGallery textColor={textColor} />
          </section>

          <TechSpecs textColor={textColor} mutedColor={secondaryTextColor} />
        </div>

        <Services />
        <Marquee />
        <Footer />
      </motion.div>
    </main>
  );
}
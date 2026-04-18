"use client";

import { useRef, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Navigation from "@/components/layout/Navigation/Navigation";
import Footer from "@/components/layout/Footer/Footer";
import Hero from "@/sections/Hero/Hero";
import Manifesto from "@/sections/Manifesto/Manifesto";
import FeaturedGallery from "@/sections/FeaturedGallery/FeaturedGallery";
import TechSpecs from "@/sections/TechSpecs/TechSpecs";
import Services from "@/sections/Services/Services";
import Marquee from "@/sections/Marquee/Marquee";
import ScrollFog from "@/components/layout/ScrollFog/ScrollFog";

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

  // TRANSISI WARNA AKSEN: Lime -> Dark Neutral -> Dark Neutral -> Lime
  const accentColor = useTransform(
    scrollYProgress,
    [0, 0.25, 0.75, 1],
    ["#dfff00", "#0a0a0a", "#0a0a0a", "#dfff00"]
  );

  return (
    <main style={{ position: "relative" }}>
      <Navigation />
      <ScrollFog />

      <Hero />

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
        } as any}
      >
        <div style={{ position: "relative", zIndex: 20 }}>
          <Manifesto textColor={textColor} mutedColor={mutedColor} />
        </div>

        {/* Unified White Zone */}
        <div ref={whiteZoneRef} style={{ position: "relative" }}>
          <section id="products">
            {/* Teruskan accentColor ke FeaturedGallery */}
            <FeaturedGallery textColor={textColor} accentColor={accentColor} />
          </section>

          <TechSpecs textColor={textColor} mutedColor={secondaryTextColor} accentColor={accentColor} />
        </div>

        <Services />
        <Marquee />
        <Footer />
      </motion.div>
    </main>
  );
}
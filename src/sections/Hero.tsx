"use client";

import { useRef, useState, useEffect, MouseEvent } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, CameraShake } from "@react-three/drei";
import { useScroll, useTransform, motion, useMotionValueEvent } from "framer-motion";
import { useLenis } from "lenis/react";
import { Particles } from "../components/CurlNoise3D/Particles";
import styles from "./Hero.module.css";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [particleSize, setParticleSize] = useState(256);
  const [isCanvasActive, setIsCanvasActive] = useState(true);
  const [scrollVal, setScrollVal] = useState(0);

  useEffect(() => {
    // Determine particle count based on device heuristics
    const isMobile = window.innerWidth < 768;
    const cores = navigator.hardwareConcurrency || 4;

    if (isMobile) {
      setParticleSize(220); // Lower particle count for mobile
    } else if (cores >= 8) {
      setParticleSize(420); // High-end devices
    } else {
      setParticleSize(320); // Mid-range laptops
    }

    // Performance Guard: Matikan render 3D jika di luar viewport
    const handleScrollOptimize = () => {
      if (window.scrollY > window.innerHeight) {
        setIsCanvasActive(false);
      } else {
        setIsCanvasActive(true);
      }
    };

    window.addEventListener("scroll", handleScrollOptimize, { passive: true });
    return () => window.removeEventListener("scroll", handleScrollOptimize);
  }, []);

  const lenis = useLenis();

  const handleScroll = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const href = e.currentTarget.getAttribute("href");
    if (!href) return;
    
    lenis?.scrollTo(href, {
      duration: 2.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
  };

  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end start"] });
  
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setScrollVal(latest);
  });
  
  // Depth & Divergence Transforms
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.3]);
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const x1 = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const x2 = useTransform(scrollYProgress, [0, 1], [0, 40]);
  
  // Optical Effects: Fade and Blur (Focus Pull)
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const blurValue = useTransform(scrollYProgress, [0, 0.8], [0, 8]);
  const blur = useTransform(blurValue, (v) => `blur(${v}px)`);

  // Foot / Layout Exits: Deep coordinated transitions
  const globalOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const footerOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const footerBlurValue = useTransform(scrollYProgress, [0, 0.3], [0, 3]);
  const footerBlur = useTransform(footerBlurValue, (v) => `blur(${v}px)`);

  // Detect Mobile for heavy effect stripping
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    setIsMobile(window.innerWidth < 1024);
  }, []);

  return (
    <motion.section 
      className={styles['hero-section']} 
      id="home" 
      ref={containerRef}
      style={{ opacity: globalOpacity }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5, ease: "easeOut" }}
    >
      <div className={styles['hero-fullscreen-3d']}>
        <Canvas 
          frameloop={isCanvasActive ? "always" : "never"} 
          camera={{ position: [0, 0, 4], fov: 45 }}
          resize={{ offsetSize: true }}
          gl={{ antialias: !isMobile, powerPreference: "high-performance" }}
        >
          <color attach="background" args={['#030303']} />
          <ambientLight intensity={1} />
          <Particles 
            speed={0.1} 
            fov={150} 
            aperture={4.5} 
            focus={3.1} 
            curl={0.25} 
            size={particleSize} 
            scroll={isMobile ? 0 : scrollVal} // Prevent heavy divergence spread on mobile during scroll
            interactive={!isMobile} // Disable scattering interaction on mobile
          />
          {!isMobile && (
            <OrbitControls 
              makeDefault 
              autoRotate 
              autoRotateSpeed={1} 
              enableZoom={false} 
              enablePan={false} 
              enableRotate={false} 
            />
          )}
          <CameraShake yawFrequency={1} maxYaw={0.05} pitchFrequency={1} maxPitch={0.05} rollFrequency={0.5} maxRoll={0.5} intensity={0.2} />
        </Canvas>
      </div>

      <motion.div 
        className={styles['hero-brutalist-text']} 
        style={{ 
          opacity: isMobile ? 1 : opacity, 
          scale: isMobile ? 1 : scale, 
          filter: isMobile ? "none" : blur 
        }}
      >
        <div className={styles['title-group']}>
          <motion.h1 
            className={`${styles['giant-text']} ${styles['primary-text']}`} 
            style={{ 
              y: isMobile ? 0 : y1, 
              x: isMobile ? 0 : x1 
            }}
          >
            TINARRA
          </motion.h1>
          <motion.h1 
            className={`${styles['giant-text']} ${styles['outline-text']} ${styles['offset-text']}`} 
            style={{ 
              y: isMobile ? 0 : y2, 
              x: isMobile ? 0 : x2 
            }}
          >
            STUDIO
          </motion.h1>
        </div>
        <div className={styles['hero-subtext-wrapper']}>
          <WordReveal text="A Micro-Factory for Digital Craftsmanship." delay={1.5} />
        </div>
      </motion.div>

      <div className={styles['hero-footer']}>
        <motion.div 
          className={styles['hero-footer-content']}
          style={{ 
            opacity: isMobile ? 1 : footerOpacity, 
            filter: isMobile ? "none" : footerBlur 
          }}
        >
          <div className={styles['hero-scroll-wrapper']}>
            <a href="#story" onClick={handleScroll} className={styles['scroll-indicator-link']}>
              <div className={styles['scroll-indicator']}>
                <motion.div 
                  className={styles['scroll-dot']}
                  style={{ transformOrigin: "top" }}
                  animate={{ 
                    height: [6, 20, 6, 6], // Natural pill stretch
                    y: [0, 0, 14, 0],      // Catch-up effect
                  }}
                  transition={{ 
                    duration: 2.4,
                    repeat: Infinity,
                    times: [0, 0.4, 0.7, 1],
                    ease: [0.16, 1, 0.3, 1] // Custom cubic-bezier for a 'liquid' snap
                  }}
                />
              </div>
            </a>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
function WordReveal({ text, delay = 0 }: { text: string, delay?: number }) {
  const words = text.split(" ");
  return (
    <motion.div
      initial="initial"
      animate="enter"
      variants={{
        enter: { transition: { staggerChildren: 0.1, delayChildren: delay } }
      }}
      className={styles['word-reveal']}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          variants={{
            initial: { opacity: 0, filter: "blur(8px)", y: 10 },
            enter: { opacity: 1, filter: "blur(0px)", y: 0 }
          }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] as any }}
          className={styles['reveal-word']}
        >
          {word}&nbsp;
        </motion.span>
      ))}
    </motion.div>
  );
}

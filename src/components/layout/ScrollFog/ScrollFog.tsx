"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useEffect, useState } from "react";
import styles from "./ScrollFog.module.css";

/**
 * ScrollFog component creates a persistent bottom gradient (fog) 
 * that dynamically blurs the background only during specific sections.
 */
export default function ScrollFog() {
  const { scrollYProgress } = useScroll();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Define the blur active zones based on global scroll position (approximate)
  // Gallery/Tech starts around 0.3 - 0.7
  // Footer starts around 0.95 - 1.0
  // Note: These values are mapped specifically in the styles to ensure 
  // the blur fades in and out smoothly.
  
  const blurAmount = useTransform(
    scrollYProgress,
    [0, 0.2, 0.3, 0.7, 0.8, 0.9, 0.95, 1],
    [0, 0, 8, 8, 0, 0, 8, 8] // Blurs at 0.3-0.7 (Gallery/Tech) and 0.95-1 (Footer)
  );

  const springBlur = useSpring(blurAmount, { damping: 30, stiffness: 200 });
  const blurFilter = useTransform(springBlur, (v) => `blur(${v}px)`);

  if (isMobile) return null;

  return (
    <div className={styles['fog-wrapper']}>
      {/* Permanent Gradient Layer */}
      <div className={styles['fog-gradient']} />
      
      {/* Conditional Blur Layer */}
      <motion.div 
        className={styles['fog-blur']} 
        style={{ backdropFilter: blurFilter } as any}
      />
    </div>
  );
}

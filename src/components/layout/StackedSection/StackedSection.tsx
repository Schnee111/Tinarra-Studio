"use client";

import { useRef, ReactNode } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import styles from "./StackedSection.module.css";

interface StackedSectionProps {
  children: ReactNode;
  zIndex: number;
  color: string;
  borderTop?: boolean;
}

export default function StackedSection({ children, zIndex, color, borderTop = false }: StackedSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"], // Triggers while this section scrolls up
  });

  // Scale down the card to look like it's being pushed back
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);
  
  // Darken slightly as it pushes back using an overlay opacity
  const overlayOpacity = useTransform(scrollYProgress, [0, 1], [0, 0.5]);

  return (
    <div
      ref={containerRef}
      className={styles['stacked-wrapper']}
      style={{ zIndex }}
    >
      <motion.div
        className={styles['stacked-card']}
        style={{
          scale,
          z: 0, // Force GPU layer consistency to prevent flicker on top scroll
          backgroundColor: color,
          borderTopLeftRadius: borderTop ? "40px" : "0px",
          borderTopRightRadius: borderTop ? "40px" : "0px",
        }}
      >
        <motion.div className={styles['stacked-overlay']} style={{ opacity: overlayOpacity }} />
        {children}
      </motion.div>
    </div>
  );
}

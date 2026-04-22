"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { useIsMobile } from "@/hooks/useIsMobile";
import styles from "./Manifesto.module.css";

const text = "We turn digital polygons into physical realities. Precision-crafted in our local micro-factory.";

export default function Manifesto({ textColor, mutedColor }: { textColor?: MotionValue<string>, mutedColor?: MotionValue<string> }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: isMobile ? ["start 70%", "end 60%"] : ["start 45%", "end 85%"]
  });

  const words = text.split(" ");

  return (
    <section className={styles['manifesto-section']} ref={containerRef} id="story">
      <h2 className={styles['manifesto-text']}>
        {words.map((word, i) => {
          const start = i / (words.length + 3); 
          const end = (i + 3) / (words.length + 3); 
          
          return (
            <Word 
              key={i} 
              word={word} 
              progress={scrollYProgress} 
              range={[start, end]}
              activeColor={textColor}
              inactiveColor={mutedColor}
              isMobile={isMobile}
            />
          );
        })}
      </h2>
    </section>
  );
}

function Word({ word, progress, range, activeColor, inactiveColor, isMobile }: { word: string, progress: MotionValue<number>, range: [number, number], activeColor?: MotionValue<string>, inactiveColor?: MotionValue<string>, isMobile: boolean }) {
  // Fix: Move the 'reveal' logic to Opacity, letting the Prop handle the base color.
  const revealProgress = useTransform(progress, range, [0, 1]);
  const opacity = useTransform(revealProgress, [0, 1], [0.1, 1]);
  const blur = useTransform(revealProgress, [0, 1], ["blur(4px)", "blur(0px)"]);

  // We use the activeColor (which is a MotionValue representing the global white/black state)
  // as the base color for the text.
  return (
    <span className={styles['word-wrapper']}>
      <motion.span 
        className={styles['char']} 
        style={{ 
          color: activeColor, 
          opacity, 
          filter: isMobile ? "none" : blur, 
          willChange: "opacity, filter",
          transform: "translateZ(0)"
        }}
      >
        {word}
      </motion.span>
    </span>
  );
}
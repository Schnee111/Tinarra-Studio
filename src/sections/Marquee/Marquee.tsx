"use client";

import { useRef, useEffect } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  useAnimationFrame,
  useMotionValue
} from "framer-motion";
import { wrap } from "framer-motion";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useIsMobile } from "@/hooks/useIsMobile";
import styles from "./Marquee.module.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* -------------------------------------------------------------------------- */
/* ScrollVelocity                               */
/* -------------------------------------------------------------------------- */

interface VelocityTextProps {
  children: string;
  baseVelocity: number;
  damping?: number;
  stiffness?: number;
  numCopies?: number;
}

function VelocityText({
  children,
  baseVelocity = 100,
  damping = 50,
  stiffness = 400,
  numCopies = 2
}: VelocityTextProps) {
  const baseX = useMotionValue(0);
  const isMobile = useIsMobile();
  const containerRef = useRef<HTMLDivElement>(null);
  const isInViewRef = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { isInViewRef.current = entry.isIntersecting; },
      { threshold: 0 }
    );
    if (containerRef.current) observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: damping,
    stiffness: stiffness
  });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
    clamp: false
  });

  const x = useTransform(baseX, (v) => `${wrap(-20, -45, v)}%`);

  const directionFactor = useRef<number>(1);
  useAnimationFrame((t, delta) => {
    if (!isInViewRef.current) return;

    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);

    if (!isMobile) {
      const v = velocityFactor.get();
      if (v < 0) directionFactor.current = -1;
      else if (v > 0) directionFactor.current = 1;
      
      moveBy += directionFactor.current * moveBy * v;
    }

    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div ref={containerRef} className={styles.parallax}>
      <motion.div className={styles.scroller} style={{ x }}>
        {Array.from({ length: numCopies }).map((_, i) => (
          <span key={i}>{children} </span>
        ))}
      </motion.div>
    </div>
  );
}

interface ScrollVelocityProps {
  texts: string[];
  velocity?: number;
  className?: string;
  damping?: number;
  stiffness?: number;
  numCopies?: number;
}

function ScrollVelocity({ 
  texts, 
  velocity = 100, 
  className = "",
  damping = 50,
  stiffness = 400,
  numCopies = 3
}: ScrollVelocityProps) {
  return (
    <div className={`${styles['marquee-velocity-bg']} ${className}`}>
      <VelocityText 
        baseVelocity={velocity} 
        damping={damping} 
        stiffness={stiffness} 
        numCopies={numCopies}
      >
        {texts[0]}
      </VelocityText>
      <VelocityText 
        baseVelocity={-velocity} 
        damping={damping} 
        stiffness={stiffness} 
        numCopies={numCopies}
      >
        {texts[1]}
      </VelocityText>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* FocusReveal                                */
/* -------------------------------------------------------------------------- */

interface FocusRevealProps {
  children: string;
  scrollStart?: string;
  scrollEnd?: string;
  stagger?: number;
  animationDuration?: number;
}

function FocusReveal({
  children,
  scrollStart = "top bottom-=50%",
  scrollEnd = "bottom center+=50%",
  stagger = 0.1,
  animationDuration = 1.5
}: FocusRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!containerRef.current) return;
    
    const ctx = gsap.context(() => {
      const words = containerRef.current!.querySelectorAll(`.${styles.word}`);
      
      gsap.fromTo(words, 
        { 
          opacity: 0, 
          letterSpacing: isMobile ? "0.2em" : "0.8em", 
          filter: isMobile ? "blur(4px)" : "blur(12px)",
          y: 10
        }, 
        { 
          opacity: 1, 
          letterSpacing: "0.02em", 
          filter: "blur(0px)",
          y: 0,
          stagger: isMobile ? 0.05 : stagger,
          ease: "power2.out",
          duration: animationDuration,
          scrollTrigger: {
            trigger: containerRef.current,
            start: scrollStart,
            end: scrollEnd,
            scrub: true,
          }
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [scrollStart, scrollEnd, stagger, animationDuration, isMobile]);

  const words = children.split(" ");

  return (
    <div ref={containerRef} className={styles['btn-float-container']}>
      {words.map((word, idx) => (
        <span key={idx} className={styles.word}>
          {word}
          {idx < words.length - 1 && <span>&nbsp;</span>}
        </span>
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Main Component                               */
/* -------------------------------------------------------------------------- */

export default function Marquee() {
  return (
    <section className={styles['cta-section']}>
      <ScrollVelocity 
        texts={['TINARRA STUDIO —', 'CREATIVE 3D PRINTING —']} 
        velocity={1}
        numCopies={3} /* OPTIMASI: Dikurangi lagi menjadi 3 untuk memangkas beban DOM pada desktop */
        damping={50}
        stiffness={400}
      />

      <div className={styles['cta-overlay']}>
        <span className={styles['cta-subtitle']}>READY TO MANIFEST?</span>
        
        <Link href="mailto:hello@tinarra.studio" className={styles['cta-button']}>
          <FocusReveal
            scrollStart='center bottom+=20%'
            scrollEnd='bottom bottom-=20%'
            stagger={0.1}
          >
            LET'S WORK TOGETHER
          </FocusReveal>

          <div className={styles['btn-icon']}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 17L17 7M17 7H7M17 7V17" />
            </svg>
          </div>
        </Link>
      </div>
    </section>
  );
}
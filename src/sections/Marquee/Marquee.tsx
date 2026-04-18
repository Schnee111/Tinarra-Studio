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
  numCopies = 6
}: VelocityTextProps) {
  const baseX = useMotionValue(0);
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
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);

    if (velocityFactor.get() < 0) {
      directionFactor.current = -1;
    } else if (velocityFactor.get() > 0) {
      directionFactor.current = 1;
    }

    moveBy += directionFactor.current * moveBy * velocityFactor.get();
    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div className={styles.parallax}>
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
  numCopies = 6
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
/* ScrollFloat                                */
/* -------------------------------------------------------------------------- */

interface ScrollFloatProps {
  children: string;
  scrollStart?: string;
  scrollEnd?: string;
  stagger?: number;
  ease?: string;
  animationDuration?: number;
  once?: boolean;
}

function ScrollFloat({ 
  children, 
  scrollStart = "top bottom", 
  scrollEnd = "bottom center",
  stagger = 0.03,
  ease = "back.inOut(2)",
  animationDuration = 1,
  once = false
}: ScrollFloatProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    // GSAP Context: Praktik terbaik React untuk mencegah memory leak & duplikasi event
    const ctx = gsap.context(() => {
      const chars = containerRef.current!.querySelectorAll(`.${styles.char}`);
      
      gsap.fromTo(chars, 
        { 
          opacity: 0, 
          y: 100, 
          scaleY: 2.3, 
          scaleX: 0.7
        }, 
        { 
          opacity: 1, 
          y: 0, 
          scaleY: 1, 
          scaleX: 1,
          stagger: stagger,
          ease: ease,
          duration: animationDuration,
          scrollTrigger: {
            trigger: containerRef.current,
            start: scrollStart,
            end: scrollEnd,
            scrub: true,
            once: once,
          }
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [scrollStart, scrollEnd, stagger, ease, animationDuration, once]);

  const words = children.split(" ");

  return (
    <div ref={containerRef} className={styles['btn-float-container']}>
      {words.map((word, wordIdx) => (
        <span key={wordIdx} className={styles.word} style={{ display: "inline-block", whiteSpace: "nowrap" }}>
          {word.split("").map((char, charIdx) => (
            <span key={charIdx} className={styles.char} style={{ display: "inline-block" }}>
              {char}
            </span>
          ))}
          {wordIdx < words.length - 1 && <span className={styles.char}>&nbsp;</span>}
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
        numCopies={4} /* OPTIMASI: Dikurangi dari 6 menjadi 4 untuk memangkas beban DOM */
        damping={50}
        stiffness={400}
      />

      <div className={styles['cta-overlay']}>
        <span className={styles['cta-subtitle']}>READY TO MANIFEST?</span>
        
        <Link href="mailto:hello@tinarra.studio" className={styles['cta-button']}>
          <ScrollFloat
            animationDuration={1}
            ease='back.inOut(2)'
            scrollStart='center bottom+=20%'
            scrollEnd='bottom bottom-=50%'
            stagger={0.04}
            once={false}
          >
            LET'S WORK TOGETHER
          </ScrollFloat>

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
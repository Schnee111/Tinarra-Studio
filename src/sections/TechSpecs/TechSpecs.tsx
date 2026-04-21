"use client";

import { useRef, useState, useMemo, useEffect } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import styles from "./TechSpecs.module.css";
import Image from "next/image";

const MotionImage = motion.create(Image);

export default function TechSpecs({ textColor, mutedColor, accentColor }: { textColor?: any, mutedColor?: any, accentColor?: any }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);
  
  // Parallax tracking bound to this section's visibility in the viewport
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Calculate the parallax Y push (-20% to 20%)
  const y = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);

  return (
    <section className={styles['tech-section']} ref={containerRef} id="tech-specs">
      <div className={styles['tech-container']}>
        
        {/* Left Side: Text/Specs */}
        <motion.div 
          className={styles['tech-content']}
          style={{ color: textColor }}
          initial="initial"
          whileInView="enter"
          viewport={{ once: false, amount: 0 }}
        >
          <motion.span 
            className={styles['tech-subtitle']}
            style={{ color: mutedColor }}
            variants={{
              initial: { opacity: 0, y: 10 },
              enter: { opacity: 1, y: 0, transition: { duration: 0.3 } }
            }}
          >
            The Micro-Factory
          </motion.span>
          
          <div className={styles['tech-title']}>
            <CharReveal text="Industrial Grade." delay={0.1} color={textColor} isMobile={isMobile} />
            <CharReveal text="Desktop Scale." delay={0.4} color={textColor} isMobile={isMobile} />
          </div>

          <motion.div 
            className={styles['tech-description']}
            style={{ color: mutedColor }}
            variants={{
              initial: { opacity: 0 },
              enter: { 
                opacity: 1, 
                transition: { staggerChildren: 0.02, delayChildren: 0.5 } 
              }
            }}
          >
            <WordTypewriter text="We deploy a fleet of optimized machines specializing in high-speed extrusion and extreme dimensional accuracy. Ready for rapid testing and low-volume production." color={mutedColor} isMobile={isMobile} />
          </motion.div>
          
          <motion.div 
            className={styles['tech-specs-list']}
            style={{ "--dot-color": accentColor } as any}
            variants={{
              initial: { opacity: 0 },
              enter: { opacity: 1, transition: { staggerChildren: 0.04, delayChildren: 1.0 } }
            }}
          >
            {["High-Speed Extrusion (Up to 500mm/s)", "Precision-grade PLA+, PETG & ABS", "Flexible TPU Engineering", "0.05mm Dimensional Tolerance"].map((spec, i) => (
              <motion.div 
                key={i} 
                className={styles['spec-item']}
                style={{ color: textColor }}
                variants={{
                  initial: { opacity: 0, x: -10 },
                  enter: { opacity: 1, x: 0 }
                }}
              >
                {spec}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right Side: Parallax Image */}
        <motion.div 
          className={`${styles['image-wrapper']} ${!isLoaded ? styles['shimmer'] : ''}`}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true, amount: 0.05 }}
        >
          <MotionImage 
            src="/images/tech_3dprint-machine.jpg" 
            alt="3D Printer Nozzle"
            fill
            sizes="(max-width: 992px) 100vw, 50vw"
            className={styles['parallax-image']}
            style={{ y }}
            initial={{ scale: 1.1 }}
            animate={{ scale: isLoaded ? 1 : 1.1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            onLoad={() => setIsLoaded(true)}
            priority
          />
        </motion.div>

      </div>
    </section>
  );
}

function WordTypewriter({ text, color, isMobile = false }: { text: string, color?: any, isMobile?: boolean }) {
  const words = useMemo(() => text.split(" "), [text]);
  
  return (
    <>
      {words.map((word, i) => (
        <motion.span
          key={i}
          variants={{
            initial: { 
              opacity: 0, 
              filter: isMobile ? "none" : "blur(2px)", 
              x: 4 
            },
            enter: { 
              opacity: 1, 
              filter: "blur(0px)", 
              x: 0,
              transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] as any } 
            }
          }}
          style={{ display: "inline-block", marginRight: "0.3em", color }}
        >
          {word}
        </motion.span>
      ))}
    </>
  );
}

function CharReveal({ text, delay = 0, color, isMobile = false }: { text: string, delay?: number, color?: any, isMobile?: boolean }) {
  const words = useMemo(() => text.split(" "), [text]);
  
  return (
    <span className={styles['char-wrapper']}>
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className={styles['word-wrapper']}>
          {word.split("").map((char, charIndex) => {
            // Simple absolute index for stagger timing
            const absoluteIndex = wordIndex * 5 + charIndex; 
            return (
              <motion.span
                key={charIndex}
                className={styles['char-item']}
                style={{ color }}
                variants={{
                  initial: { opacity: 0, y: "100%", rotateX: isMobile ? 0 : 45 },
                  enter: { 
                    opacity: 1, 
                    y: 0, 
                    rotateX: 0,
                    transition: { 
                      duration: 0.8, 
                      ease: [0.22, 1, 0.36, 1],
                      delay: delay + (absoluteIndex * 0.01) // Balanced character stagger
                    } 
                  }
                }}
              >
                {char}
              </motion.span>
            );
          })}
          {/* Preserves space between words without breaking word integrity */}
          {wordIndex < words.length - 1 && <span className={styles['char-item']} style={{ color }}>&nbsp;</span>}
        </span>
      ))}
    </span>
  );
}

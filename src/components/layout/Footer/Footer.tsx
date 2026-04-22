"use client";

import styles from "./Footer.module.css";
import { useRef, useMemo } from "react";
import Link from "next/link";
import { motion, useInView, Variants } from "framer-motion";
import { useLenis } from "lenis/react";
import { useIsMobile } from "@/hooks/useIsMobile";

export default function Footer() {
  const year = new Date().getFullYear();
  const footerRef = useRef(null);
  const isInView = useInView(footerRef, { once: false, amount: 0.1 });
  const isMobile = useIsMobile();

  const containerVariants = {
    initial: { opacity: 0 },
    enter: { 
      opacity: 1, 
      transition: { staggerChildren: 0.15, delayChildren: 0.2 } 
    }
  };

  // Optical Focus Reveal (Lens focus effect)
  const focusVariants: Variants = {
    initial: { 
      opacity: 0, 
      scale: 0.95, 
      filter: isMobile ? "none" : "blur(2px)" 
    },
    enter: { 
      opacity: 1, 
      scale: 1, 
      filter: "blur(0px)",
      transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } 
    }
  };

  const lenis = useLenis();

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const href = e.currentTarget.getAttribute("href");
    if (!href) return;
    
    lenis?.scrollTo(href, {
      duration: 2.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
  };

  return (
    <footer ref={footerRef} className={styles['footer-container']} id="contact">
      <motion.div 
        className={styles['footer-inner']}
        initial="initial"
        whileInView="enter"
        viewport={{ once: false, amount: 0.1 }}
        variants={containerVariants}
      >
        
        {/* Top Grid Area occupying the main viewing space */}
        <div className={styles['footer-top']}>
          <div className={styles['footer-brand']}>
            <div className={styles['footer-tagline']} style={{ opacity: 1 }}>
              <WordReveal 
                text={"Precision meets creativity. Let's\u00A0engineer your imagination into reality."} 
                delay={0.2}
                isMobile={isMobile}
              />
            </div>
            
            <motion.div variants={focusVariants}>
              <a href="mailto:hello@tinarra.studio" className={styles['btn-pill']}>
                HELLO@TINARRA.STUDIO
              </a>
            </motion.div>

            {/* Relocated bottom bar to the brand column */}
            <motion.div className={styles['footer-info-small']} variants={focusVariants}>
              <span>&copy; {year} Tinarra Studio. All rights reserved.</span>
              <span>Bogor, Indonesia</span>
            </motion.div>
          </div>
          
          <div className={styles['footer-links-wrapper']}>
            <div className={styles['footer-links-col']}>
              <motion.span className={styles['footer-col-title']} variants={focusVariants}>
                Menu
              </motion.span>
              <motion.div className={styles['footer-links']} variants={focusVariants}>
                <Link href="#products" onClick={handleScroll}>Featured Work</Link>
                <Link href="#tech-specs" onClick={handleScroll}>Capabilities</Link>
                <Link href="#services" onClick={handleScroll}>Services</Link>
              </motion.div>
            </div>
            
            <div className={styles['footer-links-col']}>
              <motion.span className={styles['footer-col-title']} variants={focusVariants}>
                Socials
              </motion.span>
              <motion.div className={styles['footer-links']} variants={focusVariants}>
                <a href="#" target="_blank" rel="noreferrer">Instagram</a>
                <a href="#" target="_blank" rel="noreferrer">Behance</a>
                <a href="#" target="_blank" rel="noreferrer">LinkedIn</a>
              </motion.div>
            </div>
          </div>
        </div>

        {/* The colossal bottom branding block */}
        <div className={styles['footer-mega-brand']}>
          <h1 className={styles['mega-text']} aria-label="TINARRA">
            {"TINARRA".split("").map((letter, index) => (
              <motion.span
                key={index}
                style={{ display: "inline-block" }}
                initial={{ 
                  opacity: 0, 
                  y: 40, 
                  filter: isMobile ? "none" : "blur(4px)" 
                }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ 
                  duration: 1.2, 
                  delay: index * 0.04, 
                  ease: [0.16, 1, 0.3, 1] 
                }}
                viewport={{ once: false }}
              >
                {letter}
              </motion.span>
            ))}
          </h1>
        </div>

      </motion.div>
    </footer>
  );
}

function WordReveal({ text, delay = 0, isMobile = false }: { text: string, delay?: number, isMobile?: boolean }) {
  const words = useMemo(() => text.split(" "), [text]);
  
  return (
    <motion.div
      initial="initial"
      whileInView="enter"
      viewport={{ once: false, amount: 0.2 }}
      transition={{ staggerChildren: 0.05, delayChildren: delay }}
      style={{ display: "inline" }}
    >
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
              transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } 
            }
          }}
          style={{ display: "inline-block", marginRight: "0.25em" }}
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
}

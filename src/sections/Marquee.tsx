"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import styles from "./Marquee.module.css";

export default function Marquee() {
  const textContent = "TINARRA STUDIO — CREATIVE 3D PRINTING — ";

  const revealVariants = {
    initial: { opacity: 0, scale: 0.96, filter: "blur(8px)" },
    enter: { 
      opacity: 1, 
      scale: 1, 
      filter: "blur(0px)",
      transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] as any } 
    }
  };

  return (
    <section className={styles['cta-section']}>
      <motion.div 
        className={styles['marquee-wrapper']}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.035 }}
        transition={{ duration: 2, ease: "linear" }}
      >
        <motion.div 
          className={styles['marquee-container']}
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: 35 // Extremely slow, luxurious movement
          }}
        >
          <span className={styles['marquee-text']}>{textContent}</span>
          <span className={styles['marquee-text']}>{textContent}</span>
          <span className={styles['marquee-text']}>{textContent}</span>
          <span className={styles['marquee-text']}>{textContent}</span>
        </motion.div>
      </motion.div>

      <motion.div 
        className={styles['cta-overlay']}
        initial="initial"
        whileInView="enter"
        viewport={{ once: false, amount: 0.3 }}
        transition={{ staggerChildren: 0.2 }}
      >
        <motion.span 
          className={styles['cta-subtitle']}
          variants={revealVariants}
          style={{ letterSpacing: "0.4em" }}
        >
          GOT AN IDEA?
        </motion.span>
        <motion.div variants={revealVariants}>
          <Link href="#" className={styles['cta-button']}>
            <span className={styles['btn-text']}>Let&apos;s Work Together</span>
            <div className={styles['btn-icon']}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 17L17 7M17 7H7M17 7V17" />
              </svg>
            </div>
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}

"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "framer-motion";
import { useProgress } from "@react-three/drei";
import styles from "./Preloader.module.css";

export default function Preloader() {
  // active akan bernilai true jika ada aset yang sedang diproses oleh R3F
  const { progress: realProgress, active } = useProgress();
  const [isLoading, setIsLoading] = useState(true);
  
  const numberRef = useRef<HTMLSpanElement>(null);
  const animatedProgress = useMotionValue(0);
  const pathLength = useTransform(animatedProgress, [0, 100], [0, 1]);

  useEffect(() => {
    // Mekanisme Fallback: Jika tidak ada aset (active=false), 
    // kita simulasikan angka menuju 100 untuk estetika.
    const targetValue = active ? realProgress : 100;

    const controls = animate(animatedProgress, targetValue, {
      duration: active ? 0.5 : 3.0, // Berjalan perlahan (3 detik) jika hanya simulasi
      ease: [0.65, 0, 0.35, 1],
      onUpdate: (latest) => {
        if (numberRef.current) {
          numberRef.current.textContent = Math.round(latest).toString();
        }
      },
      onComplete: () => {
        // Jika sudah mencapai 100 atau simulasi selesai, tutup loader
        if (targetValue === 100 || !active) {
          setTimeout(() => setIsLoading(false), 800);
        }
      }
    });

    return () => controls.stop();
  }, [realProgress, active, animatedProgress]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className={styles['preloader-container']}
          initial={{ opacity: 1 }}
          exit={{ 
            scale: 1.1,
            opacity: 0,
            filter: "blur(20px)",
            transition: { duration: 1.3, ease: [0.76, 0, 0.24, 1] } 
          }}
        >
          <div className={styles['preloader-content']}>
            <svg width="250" height="250" viewBox="0 0 100 100" className={styles['ring-svg']}>
              <circle 
                cx="50" cy="50" r="45" 
                stroke="rgba(255,255,255,0.03)" 
                strokeWidth="8" 
                fill="none" 
              />
              <motion.circle
                cx="50" cy="50"
                r="45"
                stroke="white"
                strokeWidth="6"
                fill="none"
                strokeLinecap="round"
                style={{ pathLength, rotate: -90, originX: "50%", originY: "50%" }}
              />
            </svg>

            <div className={styles['numeric-wrapper']}>
              <span ref={numberRef} className={styles['progress-number']}>0</span>
              <span className={styles['percent-symbol']}>%</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
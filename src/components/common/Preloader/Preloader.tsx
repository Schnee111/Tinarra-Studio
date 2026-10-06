"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "framer-motion";
import { useProgress } from "@react-three/drei";
import styles from "./Preloader.module.css";

export default function Preloader() {
  const { progress: realProgress, active } = useProgress();
  const [isLoading, setIsLoading] = useState(true);
  const [is3DReady, setIs3DReady] = useState(false);

  const numberRef = useRef<HTMLSpanElement>(null);
  const animatedProgress = useMotionValue(0);
  const pathLength = useTransform(animatedProgress, [0, 100], [0, 1]);

  useEffect(() => {
    const handle3DReady = () => {
      setIs3DReady(true);
    };

    window.addEventListener("tinarra-3d-ready", handle3DReady);
    return () => window.removeEventListener("tinarra-3d-ready", handle3DReady);
  }, []);

  useEffect(() => {
    let targetValue = 100;
    let duration = 3.0;

    if (active) {
      targetValue = realProgress;
      duration = 0.5;
    } else if (is3DReady) {
      targetValue = 100;
      duration = 0.4;
    } else {
      // Fallback awal sebelum 3D ready atau jika 3D ready tertunda
      targetValue = 100;
      duration = 3.0;
    }

    const controls = animate(animatedProgress, targetValue, {
      duration,
      ease: [0.65, 0, 0.35, 1],
      onUpdate: (latest) => {
        if (numberRef.current) {
          numberRef.current.textContent = Math.round(latest).toString();
        }
      },
      onComplete: () => {
        if (targetValue === 100 || !active) {
          const exitDelay = is3DReady ? 150 : 800;
          setTimeout(() => setIsLoading(false), exitDelay);
        }
      }
    });

    return () => controls.stop();
  }, [realProgress, active, is3DReady, animatedProgress]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className={styles['preloader-container']}
          initial={{ opacity: 1 }}
          exit={{ 
            scale: 3,
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

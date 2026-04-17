"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./Preloader.module.css";

export default function Preloader() {
  const [is3DReady, setIs3DReady] = useState(false);
  const [minTimePassed, setMinTimePassed] = useState(false);

  useEffect(() => {
    // 1. Min aesthetic time for the logo/ring
    const timer = setTimeout(() => {
      setMinTimePassed(true);
    }, 2000);

    // 2. Safety timeout (if 3D fails to load, don't block user forever)
    const safetyTimer = setTimeout(() => {
      setIs3DReady(true);
    }, 5000);

    // 3. Listener for the 3D scene
    const handleReady = () => setIs3DReady(true);
    window.addEventListener('tinarra-3d-ready', handleReady);

    return () => {
      clearTimeout(timer);
      clearTimeout(safetyTimer);
      window.removeEventListener('tinarra-3d-ready', handleReady);
    };
  }, []);

  const isLoading = !is3DReady || !minTimePassed;

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className={styles['preloader-container']}
          initial={{ opacity: 1 }}
          exit={{ 
            scale: 1.2,
            opacity: 0,
            filter: "blur(60px)",
            transition: { duration: 1.5, ease: [0.76, 0, 0.24, 1] } 
          }}
        >
          <div className={styles['preloader-content']}>
            <svg width="250" height="250" viewBox="0 0 100 100" className={styles['ring-svg']}>
              {/* Ghost track for the ring */}
              <circle 
                cx="50" cy="50" r="45" 
                stroke="rgba(255,255,255,0.02)" 
                strokeWidth="8" 
                fill="none" 
              />
              {/* Drawing Ring */}
              <motion.circle
                cx="50" cy="50"
                r="45"
                stroke="white"
                strokeWidth="6"
                fill="none"
                strokeLinecap="round"
                initial={{ pathLength: 0, rotate: -90 }}
                animate={{ pathLength: 1 }}
                transition={{ 
                  duration: 2, 
                  ease: [0.65, 0, 0.35, 1] 
                }}
                style={{ originX: "50%", originY: "50%" }}
              />
            </svg>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

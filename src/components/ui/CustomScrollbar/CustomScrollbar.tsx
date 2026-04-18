"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import styles from "./CustomScrollbar.module.css";

export default function CustomScrollbar() {
  const { scrollYProgress } = useScroll();
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Deteksi aktivitas scroll secara real-time
  useMotionValueEvent(scrollYProgress, "change", () => {
    // Tampilkan scrollbar saat user mulai scroll
    setIsVisible(true);

    // Bersihkan timer lama jika user masih terus scroll
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set timer baru untuk menyembunyikan scrollbar setelah idle 1.5 detik
    timeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, 800);
  });

  // Cleanup timer saat komponen di-unmount agar tidak ada memory leak
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);
  
  // top drives vertical position from 0 to 100% of the container.
  const top = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  // y moves it backwards by its own height to ensure it stays exactly inside the track.
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "-100%"]);

  return (
    <motion.div 
      className={styles['custom-scrollbar-track']}
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
    >
      <motion.div 
        className={styles['custom-scrollbar-thumb']}
        style={{ top, y }}
      />
    </motion.div>
  );
}
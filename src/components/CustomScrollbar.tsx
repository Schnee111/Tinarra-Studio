"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import styles from "./CustomScrollbar.module.css";

export default function CustomScrollbar() {
  const { scrollYProgress } = useScroll();
  
  // top drives vertical position from 0 to 100% of the container.
  const top = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  // y moves it backwards by its own height to ensure it stays exactly inside the track.
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "-100%"]);

  return (
    <div className={styles['custom-scrollbar-track']}>
      <motion.div 
        className={styles['custom-scrollbar-thumb']}
        style={{ top, y }}
      />
    </div>
  );
}

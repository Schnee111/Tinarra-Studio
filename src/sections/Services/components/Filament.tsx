"use client";

import React, { memo, useId } from "react";
import { motion } from "framer-motion";
import styles from "../Services.module.css";

interface FilamentProps {
  pathLength: any;
  generatePath: () => string;
  isMobile: boolean;
  isReady: boolean;
}

const Filament = memo(({ pathLength, generatePath, isMobile }: FilamentProps) => {
  const filterId = useId();

  return (
    <svg
      width="100%" height="100%"
      xmlns="http://www.w3.org/2000/svg"
      style={{ overflow: 'visible' }}
      aria-hidden="true"
      role="presentation"
      shapeRendering="geometricPrecision"
    >
      {/* Lightweight filter: simple drop-shadow only, no SpecularLighting */}
      <defs>
        <filter id={filterId} x="-15%" y="-15%" width="130%" height="130%" colorInterpolationFilters="sRGB">
          {/* Outer glow via offset shadow */}
          <feGaussianBlur in="SourceAlpha" stdDeviation="6" result="blur" />
          <feOffset in="blur" dx="0" dy="3" result="offsetBlur" />
          <feFlood floodColor="#dfff00" floodOpacity="0.3" result="glowColor" />
          <feComposite in="glowColor" in2="offsetBlur" operator="in" result="glow" />
          <feMerge>
            <feMergeNode in="glow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g>
        <motion.path
          d={generatePath()}
          className={styles['svg-path-logic']}
          vectorEffect="non-scaling-stroke"
          strokeWidth={isMobile ? 18 : 30}
          style={{
            pathLength,
            filter: isMobile ? 'none' : `url(#${filterId})`,
          } as any}
          initial={{ pathLength: 0 }}
          transition={{ d: { duration: 0 } }}
        />
      </g>
    </svg>
  );
});

Filament.displayName = "Filament";

export default Filament;

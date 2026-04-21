"use client";

import React, { memo } from "react";
import styles from "../Services.module.css";

interface NozzleProps {
  startX: number;
  top: number;
  isReady: boolean;
  svgSize: { width: number, height: number };
}

const Nozzle = memo(({ startX, top, isReady, svgSize }: NozzleProps) => {
  if (!isReady || svgSize.width === 0) return null;

  return (
    <div
      className={styles['nozzle-tip']}
      style={{
        left: `${startX}px`,
        top: `${top}px`
      }}
    >
      <img 
        src="/images/nozzle.png" 
        alt="Nozzle Tip" 
        style={{ 
          width: '100%', 
          height: '100%', 
          objectFit: 'contain',
          display: 'block'
        }} 
      />
    </div>
  );
});

Nozzle.displayName = "Nozzle";

export default Nozzle;

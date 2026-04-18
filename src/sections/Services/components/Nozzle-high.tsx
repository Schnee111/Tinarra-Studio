"use client";

import React, { memo } from "react";
import styles from "../Services.module.css";

interface NozzleProps {
  initialAngle: number;
  startX: number;
  isReady: boolean;
  svgSize: { width: number, height: number };
}

const Nozzle = memo(({ initialAngle, startX, isReady, svgSize }: NozzleProps) => {
  if (!isReady || svgSize.width === 0) return null;

  return (
    <div
      className={styles['nozzle-tip']}
      style={{
        transform: `rotate(${initialAngle}deg)`,
        left: `${startX}px`
      }}
    >
      <svg width="100%" height="100%" viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          {/* ── Cylinder gradient ── */}
          <linearGradient id="chrome-cylinder" x1="0" y1="34" x2="0" y2="86" gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="#3A3A3A" />
            <stop offset="18%"  stopColor="#F8F8F8" />
            <stop offset="42%"  stopColor="#8A8A8A" />
            <stop offset="78%"  stopColor="#080808" />
            <stop offset="100%" stopColor="#1C1C1C" />
          </linearGradient>

          {/* ── Taper gradient ── */}
          <linearGradient id="taper-base" x1="0" y1="34" x2="0" y2="86" gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="#9A9A9A" />
            <stop offset="22%"  stopColor="#FFFFFF" />
            <stop offset="50%"  stopColor="#555555" />
            <stop offset="88%"  stopColor="#020202" />
            <stop offset="100%" stopColor="#2A2A2A" />
          </linearGradient>

          {/* ── Thread body ── */}
          <linearGradient id="thread-gradient" x1="0" y1="41" x2="0" y2="79" gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="#3A3A3A" />
            <stop offset="40%"  stopColor="#C0C0C0" />
            <stop offset="85%"  stopColor="#060606" />
            <stop offset="100%" stopColor="#000000" />
          </linearGradient>

          {/* ── Tip face gradient ── */}
          <linearGradient id="tip-face" x1="185" y1="45" x2="192" y2="75" gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="#C0C0C0" />
            <stop offset="15%"  stopColor="#F0F0F0" />
            <stop offset="70%"  stopColor="#111111" />
            <stop offset="100%" stopColor="#1A1A1A" />
          </linearGradient>

          {/* ── Knurling pattern (no blur) ── */}
          <pattern id="knurling" width="5" height="5" patternUnits="userSpaceOnUse">
            <path d="M0 0L5 5" stroke="#000000" strokeWidth="0.7" opacity="0.55" />
            <path d="M5 0L0 5" stroke="#000000" strokeWidth="0.7" opacity="0.55" />
            <path d="M0 0L5 5" stroke="#FFFFFF" strokeWidth="0.4" opacity="0.2" transform="translate(0.5,-0.5)" />
          </pattern>

          {/* ── Clip paths ── */}
          <clipPath id="trumpet-clip">
            <path d="M 79 34 C 120 34, 140 45, 185 45 L 185 75 C 140 75, 120 86, 79 86 Z" />
          </clipPath>
          <clipPath id="grip-clip">
            <rect x="34" y="34" width="46" height="52" rx="1" />
          </clipPath>
        </defs>

        {/* ── Nozzle Body ── */}
        <g>
          {/* A: Threaded Back */}
          <rect x="5" y="42" width="30" height="36" rx="2" fill="url(#thread-gradient)" />
          {[9, 13, 17, 21, 25, 29, 33].map((x) => (
            <g key={x}>
              <rect x={x}     y="41" width="1.2" height="38" rx="0.4" fill="#000" opacity="0.85" />
              <rect x={x+1.8} y="42" width="0.6" height="36" rx="0.3" fill="#CCC" opacity="0.15" />
            </g>
          ))}
          <rect x="5" y="42" width="30" height="3" rx="1" fill="#AAAAAA" opacity="0.2" />

          {/* B: Knurled Grip */}
          <rect x="34" y="34" width="46" height="52" rx="1" fill="url(#chrome-cylinder)" />
          <g clipPath="url(#grip-clip)">
            <rect x="34" y="34" width="46" height="52" fill="url(#knurling)" />
            {/* Specular line — pure CSS opacity, no filter */}
            <rect x="34" y="34" width="46" height="2.5" fill="#FFFFFF" opacity="0.5" />
            {/* Shadow gradient rect instead of blur */}
            <rect x="34" y="72" width="46" height="14" fill="#000000" opacity="0.45" />
          </g>
          {/* Left edge highlight — no filter */}
          <rect x="34" y="34" width="2" height="52" rx="1" fill="#FFFFFF" opacity="0.12" />

          {/* C: Tapered Nozzle — simplified specular, no blur filters */}
          <g clipPath="url(#trumpet-clip)">
            <rect x="70" y="20" width="130" height="80" fill="url(#taper-base)" />
            {/* Top specular band — solid opacity strip instead of blur */}
            <rect x="70" y="34" width="130" height="10" fill="#FFFFFF" opacity="0.18" />
            {/* Core specular line */}
            <path d="M 79 38.5 C 120 38.5, 140 47.6, 185 47.6" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.9" fill="none" />
            {/* Mid shadow strip */}
            <rect x="70" y="62" width="130" height="18" fill="#111111" opacity="0.4" />
            {/* Bottom dark zone */}
            <rect x="70" y="74" width="130" height="12" fill="#000000" opacity="0.6" />
          </g>

          {/* D: Tip Face */}
          <path d="M185 45 C192 45, 192 75, 185 75 Z" fill="url(#tip-face)" />
          {/* Glint line — no filter */}
          <path d="M186 48 C189.5 50, 189.5 54, 186 56" stroke="#FFFFFF" strokeWidth="0.8" opacity="0.55" fill="none" />
        </g>
      </svg>
    </div>
  );
});

Nozzle.displayName = "Nozzle";

export default Nozzle;

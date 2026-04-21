"use client";

import React, { memo, useId } from "react";
import { motion } from "framer-motion";
import styles from "../Services.module.css";

interface FilamentProps {
  pathLength: any;
  path: string;
  isMobile: boolean;
  isReady: boolean;
}

const Filament = memo(({ pathLength, path, isMobile, isReady }: FilamentProps) => {
  const filterId = useId();
  const filamentFilterUrl = `url(#${filterId})`;

  return (
    <svg
      width="100%" height="100%"
      xmlns="http://www.w3.org/2000/svg"
      style={{ overflow: 'visible' }}
      aria-hidden="true"
      role="presentation"
      shapeRendering={isMobile ? "auto" : "geometricPrecision"}
    >
      <defs>
        {/* ── Realistic 3D Tubular Lighting Filter ── */}
        <filter
          id={filterId}
          x="-10%" y="-10%" width="120%" height="120%"
          colorInterpolationFilters="sRGB"
          {...(isReady ? { filterRes: "150" } : {})}
        >
          {/* 1. Create a 3D 'bump' from the path */}
          <feGaussianBlur in="SourceAlpha" stdDeviation="4.5" result="blur" />

          {/* 2. SPECULAR HIGHLIGHT: The glossy top rim */}
          <feSpecularLighting in="blur" surfaceScale="5" specularConstant="0.4" specularExponent="25" lightingColor="#FFFFFF" result="specOut">
            <feDistantLight azimuth="225" elevation="55" />
          </feSpecularLighting>

          {/* 3. DIFFUSE LIGHTING: Creates the volumetric shadow */}
          <feDiffuseLighting in="blur" surfaceScale="5" diffuseConstant="1.2" lightingColor="#FFFFFF" result="diffOut">
            <feDistantLight azimuth="225" elevation="35" />
          </feDiffuseLighting>

          {/* 4. COMPOSITING: Mask results to path and combine */}
          <feComposite in="specOut" in2="SourceAlpha" operator="in" result="specOut" />
          <feComposite in="diffOut" in2="SourceAlpha" operator="in" result="diffOut" />

          <feComposite in="SourceGraphic" in2="diffOut" operator="arithmetic" k1="1" k2="0" k3="0" k4="0" result="litColor" />
          <feComposite in="litColor" in2="specOut" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" />
        </filter>
      </defs>

      <g>
        {/* --- THE CORE FILAMENT BODY --- */}
        <motion.path
          d={path}
          className={styles['svg-path-logic']}
          vectorEffect="non-scaling-stroke"
          strokeWidth={isMobile ? 10 : 30}
          style={{
            pathLength,
            filter: isMobile ? 'none' : filamentFilterUrl
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

"use client";
import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const outlineRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);

    let isHovering = false;
    let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
    let outlineX = mouseX, outlineY = mouseY;
    
    // Animation states
    let scaleDot = 1;
    let scaleOutline = 1;
    let bgOpacity = 0;
    
    // Physics variables for the Bouncy effect (Spring mechanics)
    let outlineScaleVelocity = 0;
      const springStiffness = 0.15;  // Speed of the pull (lower = slower)
      const springDamping = 0.75;    // Resistance (lower = more bouncy/jelly)

      const animate = () => {
      // Smooth position interpolation (slower and more jelly)
      outlineX += (mouseX - outlineX) * 0.2;
      outlineY += (mouseY - outlineY) * 0.2;

      // Target values
      const targetScaleDot = isHovering ? 0 : 1;
      const targetScaleOutline = isHovering ? 2.2 : 1; // Scaled down 
      const targetBgOpacity = isHovering ? 1 : 0; 
      
      // Standard LERP for dot and background opacity
      scaleDot += (targetScaleDot - scaleDot) * 0.2;
      bgOpacity += (targetBgOpacity - bgOpacity) * 0.2;

      // SPRING PHYSICS for outer circle scaling (Lusion.labs bouncy effect)
      const scaleForce = (targetScaleOutline - scaleOutline) * springStiffness;
      outlineScaleVelocity += scaleForce;
      outlineScaleVelocity *= springDamping;
      scaleOutline += outlineScaleVelocity;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(calc(${mouseX}px - 50%), calc(${mouseY}px - 50%)) scale(${Math.max(0, scaleDot)})`;
      }
      if (outlineRef.current) {
        outlineRef.current.style.transform = `translate(calc(${outlineX}px - 50%), calc(${outlineY}px - 50%)) scale(${Math.max(0, scaleOutline)})`;
        outlineRef.current.style.backgroundColor = `rgba(255, 255, 255, ${Math.max(0, bgOpacity)})`;
        outlineRef.current.style.borderColor = `rgba(255, 255, 255, 1)`;
      }

      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target?.closest && (target.closest("a, button, input, [role='button']") || window.getComputedStyle(target).cursor === "pointer")) {
        isHovering = true;
      } else {
        isHovering = false;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleMouseOver);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <>
      <div 
        ref={dotRef} 
        className="cursor-dot" 
        style={{ 
          backgroundColor: '#fff', 
          mixBlendMode: 'difference',
          zIndex: 10000 
        }} 
      />
      <div 
        ref={outlineRef} 
        className="cursor-outline" 
        style={{ 
          mixBlendMode: 'difference',
          zIndex: 9999,
          border: '1px solid #fff'
        }} 
      />
    </>
  );
}

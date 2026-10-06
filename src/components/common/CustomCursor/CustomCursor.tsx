"use client";
import { useSyncExternalStore, useEffect, useRef } from "react";

function subscribePointer(callback: () => void) {
  const mediaQuery = window.matchMedia("(pointer: coarse)");
  if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener("change", callback);
    return () => mediaQuery.removeEventListener("change", callback);
  }
  mediaQuery.addListener(callback);
  return () => mediaQuery.removeListener(callback);
}

function getPointerSnapshot() {
  return !window.matchMedia("(pointer: coarse)").matches;
}

function getServerPointerSnapshot() {
  return false;
}

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const outlineRef = useRef<HTMLDivElement>(null);
  const isEnabled = useSyncExternalStore(
    subscribePointer,
    getPointerSnapshot,
    getServerPointerSnapshot
  );

  useEffect(() => {
    if (!isEnabled) return;

    let isHovering = false;
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let outlineX = mouseX;
    let outlineY = mouseY;

    let scaleDot = 1;
    let scaleOutline = 1;
    let bgOpacity = 0;

    let outlineScaleVelocity = 0;
    const springStiffness = 0.15;
    const springDamping = 0.75;

    let isRunning = false;
    let rafId: number | null = null;

    const animate = () => {
      const prevOutlineX = outlineX;
      const prevOutlineY = outlineY;
      const prevScaleOutline = scaleOutline;
      const prevScaleDot = scaleDot;
      const prevBgOpacity = bgOpacity;

      outlineX += (mouseX - outlineX) * 0.2;
      outlineY += (mouseY - outlineY) * 0.2;

      const targetScaleDot = isHovering ? 0 : 1;
      const targetScaleOutline = isHovering ? 2.2 : 1;
      const targetBgOpacity = isHovering ? 1 : 0;

      scaleDot += (targetScaleDot - scaleDot) * 0.2;
      bgOpacity += (targetBgOpacity - bgOpacity) * 0.2;

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

      // Check if cursor is at rest to pause RAF loop
      const posDist = Math.hypot(mouseX - outlineX, mouseY - outlineY);
      const posDelta = Math.hypot(outlineX - prevOutlineX, outlineY - prevOutlineY);
      const scaleDelta = Math.abs(scaleOutline - prevScaleOutline);
      const dotDelta = Math.abs(scaleDot - prevScaleDot);
      const bgDelta = Math.abs(bgOpacity - prevBgOpacity);

      const isIdle =
        posDist < 0.05 &&
        posDelta < 0.05 &&
        scaleDelta < 0.0005 &&
        dotDelta < 0.0005 &&
        bgDelta < 0.0005 &&
        Math.abs(outlineScaleVelocity) < 0.0005;

      if (isIdle) {
        isRunning = false;
        rafId = null;
        return;
      }

      rafId = requestAnimationFrame(animate);
    };

    const startAnimation = () => {
      if (!isRunning) {
        isRunning = true;
        rafId = requestAnimationFrame(animate);
      }
    };

    startAnimation();

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      startAnimation();
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const matchedElement = target.closest(
        "a, button, input, [role='button'], [data-cursor='pointer']"
      );

      const shouldHover = Boolean(matchedElement);
      if (shouldHover !== isHovering) {
        isHovering = shouldHover;
        startAnimation();
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseover", handleMouseOver, { passive: true });

    return () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [isEnabled]);

  if (!isEnabled) return null;

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

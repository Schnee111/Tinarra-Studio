"use client";

import Link from "next/link";
import { MouseEvent } from "react";
import { useLenis } from "lenis/react";
import styles from "./Navigation.module.css";

export default function Navigation() {
  const lenis = useLenis();

  const handleScroll = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const href = e.currentTarget.getAttribute("href");
    if (!href) return;
    
    lenis?.scrollTo(href, {
      duration: 2.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
  };

  return (
    <nav className={styles['nav-container']}>
      <div className={styles['nav-content']}>
        <Link href="#home" className={styles['nav-logo']} onClick={handleScroll}>
          Tinarra
        </Link>
        <div className={styles['nav-links']}>
          <Link href="#products" onClick={handleScroll}>Featured Work</Link>
          <Link href="#tech-specs" onClick={handleScroll}>Capabilities</Link>
          <Link href="#services" onClick={handleScroll}>Services</Link>
          <Link href="#contact" className={styles['nav-cta']} onClick={handleScroll}>Get a Quote</Link>
        </div>
      </div>
    </nav>
  );
}

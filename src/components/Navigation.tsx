"use client";

import Link from "next/link";
import { MouseEvent, useState, useEffect } from "react";
import { useLenis } from "lenis/react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./Navigation.module.css";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const lenis = useLenis();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      lenis?.stop();
    } else {
      lenis?.start();
    }
  }, [isOpen, lenis]);

  const handleScroll = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const href = e.currentTarget.getAttribute("href");
    if (!href) return;
    
    setIsOpen(false);
    const target = href === "#home" ? 0 : href;
    
    // Jeda lebih cepat agar terasa lebih responsif
    setTimeout(() => {
      lenis?.scrollTo(target, {
        duration: 1.5,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
    }, 200);
  };

  const navLinks = [
    { name: "Featured Work", href: "#products" },
    { name: "Capabilities", href: "#tech-specs" },
    { name: "Services", href: "#services" },
  ];

  return (
    <>
      {/* 1. NAVBAR HEADER (Selalu di atas, punya efek Inverse) */}
      <nav className={styles['nav-container']}>
        <div className={styles['nav-inner']}>
          <Link href="#home" className={styles['logo']} onClick={handleScroll}>
            Tinarra
          </Link>
          
          {/* Menu Desktop */}
          <div className={styles['desktop-links']}>
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} onClick={handleScroll}>{link.name}</Link>
            ))}
            <Link href="#contact" className={styles['desktop-cta']} onClick={handleScroll}>Get a Quote</Link>
          </div>

          {/* Tombol Hamburger Mobile */}
          {mounted && (
            <button 
              className={`${styles['hamburger']} ${isOpen ? styles['open'] : ''}`}
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle Menu"
            >
              <span className={styles['line']} />
              <span className={styles['line']} />
            </button>
          )}
        </div>
      </nav>

      {/* 2. OVERLAY MENU MOBILE (Terpisah dari Header) */}
      <AnimatePresence>
        {mounted && isOpen && (
          <motion.div 
            className={styles['mobile-overlay']}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "linear" }}
          >
            <div className={styles['mobile-content']}>
              
              <div className={styles['mobile-links']}>
                {navLinks.map((link, i) => (
                  <div key={link.href} className={styles['overflow-wrapper']}>
                    <motion.div
                      initial={{ y: "110%" }}
                      animate={{ y: "0%" }}
                      exit={{ y: "110%" }}
                      transition={{ duration: 0.5, delay: 0.1 + (i * 0.05), ease: [0.22, 1, 0.36, 1] }}
                    >
                      <Link href={link.href} onClick={handleScroll}>
                        {link.name}
                      </Link>
                    </motion.div>
                  </div>
                ))}
                
                <div className={styles['overflow-wrapper']} style={{ marginTop: '1.5rem' }}>
                  <motion.div
                    initial={{ y: "110%" }}
                    animate={{ y: "0%" }}
                    exit={{ y: "110%" }}
                    transition={{ duration: 0.5, delay: 0.1 + (navLinks.length * 0.05), ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Link href="#contact" className={styles['mobile-cta']} onClick={handleScroll}>
                      Start a Project
                    </Link>
                  </motion.div>
                </div>
              </div>

              <motion.div 
                className={styles['mobile-footer']}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <div className={styles['socials']}>
                  <a href="#">Instagram</a>
                  <a href="#">Behance</a>
                </div>
                <p>hello@tinarra.studio</p>
              </motion.div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useLenis } from "lenis/react";
import { StaggeredMenuToggle, StaggeredMenuOverlay } from "./StaggeredMenu";
import styles from "./Navigation.module.css";

export default function Navigation() {
  const [mounted, setMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const lenis = useLenis();
 
  useEffect(() => {
    setMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);
 
  const handleScroll = (href: string) => {
    const targetId = href === "#home" ? 0 : href;
    
    // 1. Close menu and resume scroll immediately
    setIsMenuOpen(false);
    lenis?.start();

    // 2. Desktop: Use Lenis for silk-smooth scroll
    //    Mobile: Use Native Browser Scroll (100% reliable)
    if (!isMobile && lenis) {
      lenis.scrollTo(targetId, {
        duration: 1.5,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
    } else {
      // Native fallback for mobile or if Lenis is missing
      const element = href === "#home" ? document.body : document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const menuItems = [
    { label: "Featured Work", ariaLabel: "Featured Work", link: "#products" },
    { label: "Capabilities", ariaLabel: "Capabilities", link: "#tech-specs" },
    { label: "Services", ariaLabel: "Services", link: "#services" },
    { label: "Start a Project", ariaLabel: "Start a Project", link: "#contact", isCTA: true },
  ];

  const socialItems = [
    { label: "Instagram", link: "https://instagram.com/tinarra.studio" },
    { label: "Behance", link: "https://behance.net/tinarrastudio" },
  ];

  return (
    <>
      <nav className={`${styles['nav-container']} ${isMenuOpen ? styles['menu-open'] : ''}`}>
        <div className={styles['nav-inner']}>
          <Link 
            href="#home" 
            className={styles['logo']} 
            onClick={(e) => { e.preventDefault(); handleScroll("#home"); }}
          >
            Tinarra
          </Link>
          
          <div className={styles['desktop-links-wrapper']}>
            <div className={styles['desktop-links']}>
              {menuItems.filter(it => !it.isCTA).map((link) => (
                <Link 
                  key={link.link} 
                  href={link.link} 
                  onClick={(e) => { e.preventDefault(); handleScroll(link.link); }}
                >
                  {link.label}
                </Link>
              ))}
              <Link 
                href="#contact" 
                className={styles['desktop-cta']} 
                onClick={(e) => { e.preventDefault(); handleScroll("#contact"); }}
              >
                Get a Quote
              </Link>
            </div>

            {/* TOGGLE: Positioned on the RIGHT of the flex layout */}
            {mounted && (
              <div className={styles['mobile-menu-toggle']}>
                <StaggeredMenuToggle 
                  isOpen={isMenuOpen} 
                  onToggle={() => {
                    const next = !isMenuOpen;
                    setIsMenuOpen(next);
                    if (next) lenis?.stop();
                    else lenis?.start();
                  }} 
                />
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* OVERLAY: Lives outside the mix-blend-mode container */}
      {mounted && (
        <StaggeredMenuOverlay 
          isOpen={isMenuOpen}
          onClose={() => {
            setIsMenuOpen(false);
            lenis?.start();
          }}
          items={menuItems}
          socialItems={socialItems}
          onItemClick={handleScroll}
        />
      )}
    </>
  );
}
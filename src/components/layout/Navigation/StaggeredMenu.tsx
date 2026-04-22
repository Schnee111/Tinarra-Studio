"use client";

import React, { useCallback, useLayoutEffect, useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import './StaggeredMenu.css';

export interface StaggeredMenuItem {
  label: string;
  ariaLabel: string;
  link: string;
  isCTA?: boolean;
}

export interface StaggeredMenuSocialItem {
  label: string;
  link: string;
}

/**
 * TOGGLE COMPONENT
 * Menggunakan Single Timeline dengan Play/Reverse untuk mencegah flicker re-render
 */
export const StaggeredMenuToggle: React.FC<{
  isOpen: boolean;
  onToggle: () => void;
  menuButtonColor?: string;
  openMenuButtonColor?: string;
}> = ({ isOpen, onToggle }) => {
  const plusHRef = useRef<HTMLSpanElement | null>(null);
  const plusVRef = useRef<HTMLSpanElement | null>(null);
  const textInnerRef = useRef<HTMLSpanElement | null>(null);
  
  // Menyimpan instance timeline agar bisa dipanggil play/reverse
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const hLine = plusHRef.current;
      const vLine = plusVRef.current;
      const inner = textInnerRef.current;

      // 1. Setel posisi awal (Default State: Hamburger)
      gsap.set(hLine, { y: -4, rotate: 0 });
      gsap.set(vLine, { y: 4, rotate: 0 });
      if (inner) gsap.set(inner, { yPercent: 0 });

      // 2. Buat Timeline dalam keadaan di-pause (hanya dibuat 1 kali)
      const tl = gsap.timeline({ paused: true });

      // Sequence: Bergerak ke tengah (y: 0) -> Berputar jadi X (rotate: 45)
      tl.to([hLine, vLine], { y: 0, duration: 0.25, ease: "power2.inOut" }, 0)
        .to(hLine, { rotate: 45, duration: 0.35, ease: "back.out(1.5)" }, ">")
        .to(vLine, { rotate: -45, duration: 0.35, ease: "back.out(1.5)" }, "<");

      // Animasikan teks "Menu" meluncur ke "Close" (Karena ada 2 baris, geser -50%)
      if (inner) {
        tl.to(inner, { yPercent: -50, duration: 0.6, ease: "power4.inOut" }, 0);
      }

      // Simpan ke ref
      tlRef.current = tl;
    });

    return () => ctx.revert();
  }, []); // <-- Dependency kosong agar tidak terjadi "revert" saat isOpen berubah!

  // 3. Efek terpisah HANYA untuk men-trigger Play atau Reverse
  useEffect(() => {
    if (tlRef.current) {
      if (isOpen) {
        tlRef.current.play();
      } else {
        tlRef.current.reverse();
      }
    }
  }, [isOpen]);

  return (
    <button
      className="sm-toggle"
      aria-label={isOpen ? 'Close menu' : 'Open menu'}
      aria-expanded={isOpen}
      onClick={onToggle}
      type="button"
    >
      <span className="sm-toggle-textWrap" aria-hidden="true">
        {/* Teks di-hardcode agar React tidak melakukan re-render saat animasi berjalan */}
        <span ref={textInnerRef} className="sm-toggle-textInner">
          <span className="sm-toggle-line">Menu</span>
          <span className="sm-toggle-line">Close</span>
        </span>
      </span>
      <span className="sm-icon" aria-hidden="true">
        <span ref={plusHRef} className="sm-icon-line" />
        <span ref={plusVRef} className="sm-icon-line" />
      </span>
    </button>
  );
};

/**
 * OVERLAY COMPONENT
 * Restored with decimal numbering and high-performance GSAP transitions.
 */
export const StaggeredMenuOverlay: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  items: StaggeredMenuItem[];
  socialItems: StaggeredMenuSocialItem[];
  accentColor?: string;
  colors?: string[];
  onItemClick?: (href: string) => void;
}> = ({ isOpen, onClose, items, socialItems, accentColor = '#dfff00', colors = ['#000000', '#dfff00', '#000000'], onItemClick }) => {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const preLayersRef = useRef<HTMLDivElement | null>(null);
  const preLayerElsRef = useRef<HTMLElement[]>([]);
  const openTlRef = useRef<gsap.core.Timeline | null>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const panel = panelRef.current;
      const preContainer = preLayersRef.current;
      if (!panel || !preContainer) return;

      const layers = Array.from(preContainer.querySelectorAll('.sm-prelayer')) as HTMLElement[];
      preLayerElsRef.current = layers;

      gsap.set([panel, ...layers], { xPercent: 100, opacity: 1 });
      gsap.set(preContainer, { xPercent: 0, opacity: 1 });
    });
    return () => ctx.revert();
  }, []);

  const playOpen = useCallback(() => {
    const panel = panelRef.current;
    const layers = preLayerElsRef.current;
    if (!panel) return;

    openTlRef.current?.kill();
    const tl = gsap.timeline();

    const logo = panel.querySelector('.sm-panel-logo') as HTMLElement | null;
    const links = Array.from(panel.querySelectorAll('.sm-panel-item:not(.sm-panel-cta .sm-panel-item)')) as HTMLElement[];
    const cta = panel.querySelector('.sm-panel-cta .sm-panel-item') as HTMLElement | null;
    const socials = Array.from(panel.querySelectorAll('.sm-socials-link')) as HTMLElement[];
    
    if (logo) gsap.set(logo, { yPercent: 200, rotate: 10, opacity: 0 });
    gsap.set(links, { yPercent: 200, rotate: 5 });
    if (cta) gsap.set(cta, { yPercent: 200 });
    gsap.set(socials, { y: 20, opacity: 0 });
    gsap.set(links, { '--sm-num-opacity': 0 });

    layers.forEach((layer, i) => {
      tl.to(layer, { xPercent: 0, duration: 0.45, ease: 'power4.out', overwrite: true }, i * 0.065);
    });
    
    tl.to(panel, { xPercent: 0, duration: 0.6, ease: 'power4.out', overwrite: true }, layers.length * 0.065);

    if (logo) {
      tl.to(logo, { 
        yPercent: 0, rotate: 0, opacity: 1, duration: 0.7, ease: 'power4.out' 
      }, ">-0.55");
    }

    // Staggers - Links reveal
    tl.to(links, { 
      yPercent: 0, rotate: 0, duration: 0.7, ease: 'power4.out', stagger: 0.065 
    }, logo ? "<+0.07" : ">-0.55");
    
    tl.to(links, {
      '--sm-num-opacity': 1, duration: 0.6, ease: 'power2.out', stagger: 0.08
    }, "<");

    if (cta) tl.to(cta, { yPercent: 0, duration: 0.7, ease: 'power3.out' }, "<+0.05");
    
    tl.to(socials, { y: 0, opacity: 1, duration: 0.5, stagger: 0.04 }, "<+0.05");

    openTlRef.current = tl;
  }, []);

  const playClose = useCallback(() => {
    const panel = panelRef.current;
    // Reverse the layers so the ones closest to the panel leave first, revealing the neon below
    const layers = [...preLayerElsRef.current].reverse(); 
    if (!panel) return;

    openTlRef.current?.kill();
    gsap.to([panel, ...layers], {
      xPercent: 100,
      duration: 0.4,
      ease: 'power4.in',
      stagger: 0.035,
      overwrite: true
    });
  }, []);

  useEffect(() => {
    if (isOpen) playOpen();
    else playClose();
  }, [isOpen, playOpen, playClose]);

  return (
    <div 
      className={`staggered-menu-overlay-container ${isOpen ? 'is-open' : ''}`}
      style={{ '--sm-accent': accentColor } as React.CSSProperties}
    >
      <div className="sm-backdrop" onClick={onClose} />

      <div ref={preLayersRef} className="sm-prelayers" aria-hidden="true">
        {colors.map((c, i) => (
          <div key={i} className="sm-prelayer" style={{ background: c }} />
        ))}
      </div>

      <aside ref={panelRef} className="staggered-menu-panel">
        <div className="sm-panel-inner">
          <ul className="sm-panel-list" role="list">
            {items.map((it, idx) => (
              <li key={idx} className={`sm-panel-itemWrap ${it.isCTA ? 'sm-panel-cta' : ''}`}>
                <a 
                  href={it.link} 
                  className="sm-panel-item"
                  data-index={idx + 1}
                  onClick={(e) => {
                    e.preventDefault();
                    onItemClick?.(it.link);
                  }}
                >
                  <span className="sm-panel-itemLabel">{it.label}</span>
                </a>
              </li>
            ))}
          </ul>

          <div className="sm-panel-divider" />

          <div className="sm-socials">
            <h4 className="sm-socials-title">Follow Us</h4>
            <div className="sm-socials-list">
              {socialItems.map((s, i) => (
                <a key={i} href={s.link} target="_blank" rel="noopener noreferrer" className="sm-socials-link">
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};

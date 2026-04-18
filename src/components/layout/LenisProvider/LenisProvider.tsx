"use client";

import { ReactNode } from "react";
import { ReactLenis } from "lenis/react";

export default function LenisProvider({ children }: { children: ReactNode }) {
  return (
    <ReactLenis 
      root 
      options={{ 
        smoothWheel: true, 
        duration: 1.5, 
        wheelMultiplier: 0.85,
        // syncTouch: false (Ini adalah nilai default Lenis. Artinya Lenis tidak akan mengganggu scroll HP)
      }}
    >
      {children}
    </ReactLenis>
  );
}
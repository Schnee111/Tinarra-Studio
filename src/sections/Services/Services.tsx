"use client";

import { useRef, useState, useEffect, useMemo } from "react";
import { motion, useScroll, useTransform, useSpring, useInView } from "framer-motion";
import Filament from "./components/Filament-realistic";
import Nozzle from "./components/Nozzle";
import styles from "./Services.module.css";

const services = [
  { num: "01 — PRINT", line1: "Custom", line2: "3D Printing", desc: "Provide your own model or let us design it. We print with precision-grade filaments - PLA+, PETG, ABS, and TPU." },
  { num: "02 — SHAPE", line1: "Precision", line2: "3D Modeling", desc: "From napkin sketch to print-ready file. Our designers work in Blender and Fusion 360 to bring your concept to life." },
  { num: "03 — ITERATE", line1: "Rapid", line2: "Prototyping", desc: "Iterate fast, fail cheap. Test your physical product idea in 48 hours before committing to mass production." }
];

export default function Services() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgSize, setSvgSize] = useState({ width: 0, height: 0 });
  const [isReady, setIsReady] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: svgSize.width > 0 && svgSize.width < 768 
      ? ["start 90%", "end -40%"] 
      : ["start 40%", "end -40%"]
  });

  const pathLength = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 20,
    restDelta: 0.001
  });

  const pathOpacity = useTransform(scrollYProgress, [0, 0.02], [0, 1]);

  useEffect(() => {
    if (!containerRef.current) return;

    let currentWidth = containerRef.current.offsetWidth;
    let currentHeight = containerRef.current.offsetHeight;

    setSvgSize({ width: currentWidth, height: currentHeight });
    
    const stabilityTimer = setTimeout(() => setIsReady(true), 100);

    const handleResize = () => {
      if (!containerRef.current) return;
      const newWidth = containerRef.current.offsetWidth;
      const newHeight = containerRef.current.offsetHeight;

      if (Math.abs(currentWidth - newWidth) > 5 || Math.abs(currentHeight - newHeight) > 100) {
        currentWidth = newWidth;
        currentHeight = newHeight;
        setSvgSize({ width: currentWidth, height: currentHeight });
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(stabilityTimer);
    };
  }, []);

  const isMobile = svgSize.width < 768;
  const startX = isMobile ? 0 : 160;

  const filamentPath = useMemo(() => {
    if (svgSize.width === 0 || svgSize.height === 0) return "";

    const w = svgSize.width;
    const h = svgSize.height;

    // Original desktop zig-zag used for all devices
    return `M ${startX} ${h * 0.3}
            C ${w * 0.4} ${h * 0.2} ${w * 0.95} ${h * 0.3} ${w * 0.82} ${h * 0.45} 
            S ${w * 0.18} ${h * 0.57} ${w * 0.2} ${h * 0.72}
            S ${w * 0.9} ${h * 0.8} ${w * 0.77} ${h * 0.99}
            S ${w * 1.4} ${h * 1.1} ${w * 0.6} ${h * 1.5}`;
  }, [svgSize, startX]);

  const initialAngle = useMemo(() => {
    if (svgSize.width === 0 || svgSize.height === 0) return 0;
    const dy = (svgSize.height * 0.15) - (svgSize.height * 0.25);
    const dx = (svgSize.width * 0.4) - startX;
    const angleRadians = Math.atan2(dy, dx);
    return angleRadians * (180 / Math.PI);
  }, [svgSize, startX]);

  return (
    <section className={styles['services-section']} ref={containerRef} id="services">
      <div className={styles['grid-overlay']} />

      <div className={styles['services-content']}>
        <header className={styles['services-header']}>
          <h2 className={styles['services-title']}>
            <div className={styles['title-row']}>
              <SkewReveal text="FULL-SPECTRUM" delay={0.1} isMobile={isMobile} />
            </div>
            <div className={styles['title-row']}>
              <SkewReveal text="3D" delay={0.2} className={styles['outline-text']} isMobile={isMobile} />
              <SkewReveal text="CAPABILITIES" delay={0.3} className={styles['italic-text']} isMobile={isMobile} />
            </div>
          </h2>
        </header>

        <motion.div
          className={`${styles['service-item']} ${styles['right']}`}
          initial="initial"
          whileInView="enter"
          viewport={{ once: false, margin: "-100px 0px" }}
        >
          <div className={styles['service-num']}>{services[0].num}</div>
          <LusionTitle line1={services[0].line1} line2={services[0].line2} reverse isMobile={isMobile} />
          <div className={styles['service-desc-wrapper']}>
            <ServiceDescription text={services[0].desc} isMobile={isMobile} />
          </div>
        </motion.div>

        <motion.div
          className={`${styles['service-item']} ${styles['left']}`}
          initial="initial"
          whileInView="enter"
          viewport={{ once: false, margin: "-100px 0px" }}
        >
          <div className={styles['service-num']}>{services[1].num}</div>
          <LusionTitle line1={services[1].line1} line2={services[1].line2} isMobile={isMobile} />
          <div className={styles['service-desc-wrapper']}>
            <ServiceDescription text={services[1].desc} isMobile={isMobile} />
          </div>
        </motion.div>

        <motion.div
          className={`${styles['service-item']} ${styles['right']}`}
          initial="initial"
          whileInView="enter"
          viewport={{ once: false, margin: "-100px 0px" }}
        >
          <div className={styles['service-num']}>{services[2].num}</div>
          <LusionTitle line1={services[2].line1} line2={services[2].line2} reverse isMobile={isMobile} />
          <div className={styles['service-desc-wrapper']}>
            <ServiceDescription text={services[2].desc} isMobile={isMobile} />
          </div>
        </motion.div>
      </div>

      <motion.div 
        className={styles['svg-container-logic']}
        style={{ opacity: pathOpacity } as any}
      >
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style={{ overflow: 'visible' }}>
          {isReady && svgSize.width > 0 && (
            <Filament 
              pathLength={pathLength} 
              path={filamentPath} 
              isReady={isReady} 
              isMobile={isMobile}
            />
          )}
        </svg>

        {!isMobile && (
          <Nozzle 
            initialAngle={initialAngle} 
            startX={startX} 
            top={svgSize.height * 0.3}
            isReady={isReady} 
            svgSize={svgSize} 
          />
        )}
      </motion.div>
    </section>
  );
}

function LusionTitle({ line1, line2, reverse = false, isMobile = false }: { line1: string, line2: string, reverse?: boolean, isMobile?: boolean }) {
  const words1 = useMemo(() => line1.split(" "), [line1]);
  const words2 = useMemo(() => line2.split(" "), [line2]);
  
  const detRef = useRef(null);
  const isInView = useInView(detRef, { once: false, margin: "-10% 0px" });

  const [phase, setPhase] = useState<"initial" | "reveal" | "shift">("initial");

  useEffect(() => {
    if (isInView) {
      if (isMobile) {
        setPhase("shift");
      } else {
        setPhase("reveal");
        const timer = setTimeout(() => setPhase("shift"), 500);
        return () => clearTimeout(timer);
      }
    } else {
      setPhase("initial");
    }
  }, [isInView, isMobile]);

  const startAlign = reverse ? "flex-end" : "flex-start";
  const endAlign = reverse ? "flex-start" : "flex-end";
  
  const currentAlign = isMobile ? endAlign : (phase === "shift" ? endAlign : startAlign);

  return (
    <div ref={detRef} className={styles['lusion-container']}>
      {/* Line 1 */}
      <motion.div 
        layout={!isMobile} 
        className={styles['lusion-line-wrapper']} 
        style={{ justifyContent: currentAlign } as any} 
        transition={isMobile ? { duration: 0 } : { layout: { duration: 1.2, ease: [0.65, 0, 0.35, 1] } }}
      >
        <motion.div layout={!isMobile} className={styles['lusion-mask-top']}>
          <motion.div layout={!isMobile} className={styles['lusion-row']}>
            {isMobile ? (
              <motion.span
                className={styles['lusion-word']}
                initial={{ y: "100%", opacity: 0 }}
                animate={phase !== "initial" ? { y: 0, opacity: 1 } : { y: "100%", opacity: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                {line1}
              </motion.span>
            ) : (
              words1.map((word, i) => (
                <motion.span
                  layout={!isMobile}
                  key={i}
                  className={styles['lusion-word']}
                  initial={{ y: "100%", opacity: 0 }}
                  animate={phase !== "initial" ? { y: 0, opacity: 1 } : { y: "100%", opacity: 0 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: i * 0.1 }}
                >
                  {word}{i < words1.length - 1 ? '\u00A0' : ''}
                </motion.span>
              ))
            )}
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Line 2 STAYS STILL at its final destination */}
      <motion.div 
        layout={!isMobile} 
        className={styles['lusion-line-wrapper']} 
        style={{ justifyContent: endAlign } as any} 
        transition={isMobile ? { duration: 0 } : { layout: { duration: 1.2, ease: [0.65, 0, 0.35, 1] } }}
      >
        <motion.div layout={!isMobile} className={styles['lusion-mask-bottom']}>
          <motion.div layout className={styles['lusion-row']}>
            {isMobile ? (
              <motion.span
                className={styles['lusion-word']}
                initial={{ y: "-100%", opacity: 0 }}
                animate={phase !== "initial" ? { y: 0, opacity: 1 } : { y: "-100%", opacity: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                {line2}
              </motion.span>
            ) : (
              words2.map((word, i) => (
                <motion.span
                  layout={!isMobile}
                  key={i}
                  className={styles['lusion-word']}
                  initial={{ y: "-100%", opacity: 0 }}
                  animate={phase !== "initial" ? { y: 0, opacity: 1 } : { y: "-100%", opacity: 0 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: i * 0.1 }}
                >
                  {word}{i < words2.length - 1 ? '\u00A0' : ''}
                </motion.span>
              ))
            )}
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}

function ServiceDescription({ text, isMobile = false }: { text: string, isMobile?: boolean }) {
  return (
    <motion.p 
      className={styles['service-desc']}
      initial="initial"
      whileInView="enter"
      viewport={{ once: false }}
      variants={{
        initial: { opacity: 0, y: isMobile ? 15 : 0 },
        enter: { 
          opacity: 1, 
          y: 0,
          transition: { 
            delay: 0.2,
            duration: isMobile ? 0.8 : 0.4 
          } 
        }
      }}
    >
      {text}
    </motion.p>
  );
}

function SkewReveal({ text, delay = 0, className = "", isMobile = false }: { text: string, delay?: number, className?: string, isMobile?: boolean }) {
  const words = useMemo(() => text.split(" "), [text]);
  
  return (
    <span className={styles['skew-container']}>
      {isMobile ? (
        <span className={styles['skew-mask']}>
          <motion.span
            className={`${styles['skew-word']} ${className}`}
            initial={{ y: "110%", skewY: 0, opacity: 0 }}
            whileInView={{ 
              y: 0, 
              skewY: 0, 
              opacity: 1,
              transition: { 
                duration: 0.5, 
                ease: [0.215, 0.61, 0.355, 1],
                delay: delay
              }
            }}
            viewport={{ once: false }}
          >
            {text}
          </motion.span>
        </span>
      ) : (
        words.map((word, i) => (
          <span key={i} className={styles['skew-mask']}>
            <motion.span
              className={`${styles['skew-word']} ${className}`}
              initial={{ y: "110%", skewY: 10, opacity: 0 }}
              whileInView={{ 
                y: 0, 
                skewY: 0, 
                opacity: 1,
                transition: { 
                  duration: 1.1, 
                  ease: [0.215, 0.61, 0.355, 1],
                  delay: delay + (i * 0.1)
                }
              }}
              viewport={{ once: false }}
            >
              {word}
            </motion.span>
            {i < words.length - 1 && <span className={styles['skew-space']}>&nbsp;</span>}
          </span>
        ))
      )}
    </span>
  );
}
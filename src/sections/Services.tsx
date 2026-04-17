"use client";

import { useRef, useState, useEffect, useMemo } from "react";
import { motion, useScroll, useTransform, useSpring, useInView } from "framer-motion";
import styles from "./Services.module.css";

const services = [
  { num: "01 — PRINT", line1: "Custom", line2: "3D Printing", desc: "Provide your own model or let us design it. We print with precision-grade filaments - PLA+, PETG, ABS, and TPU." },
  { num: "02 — SHAPE", line1: "Precision", line2: "3D Modeling", desc: "From napkin sketch to print-ready file. Our designers work in Blender and Fusion 360 to bring your concept to life." },
  { num: "03 — ITERATE", line1: "Rapid", line2: "Prototyping", desc: "Iterate fast, fail cheap. Test your physical product idea in 48 hours before committing to mass production." }
];

export default function Services() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    // "start 70%" -> The line starts drawing exactly when the top of the section reaches 70% down the screen
    // "end 70%" -> The line finishes exactly when the bottom of the section reaches 70% down the screen
    // This perfectly pins the drawing 'tip' of the line to the 70% viewport mark!
    offset: ["start 40%", "end -40%"]
  });

  // Create a spring for physics-based momentum ("chasing" the scroll)
  const pathLength = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 20,
    restDelta: 0.001
  });

  // Fade out the line at the very beginning to hide initialization jitters/snaps
  const pathOpacity = useTransform(scrollYProgress, [0, 0.02], [0, 1]);

  // Dynamically measure container size to draw the SVG correctly over the entire scroll height
  const [svgSize, setSvgSize] = useState({ width: 0, height: 0 });
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    let currentWidth = containerRef.current.offsetWidth;
    let currentHeight = containerRef.current.offsetHeight;

    // Initial size
    setSvgSize({ width: currentWidth, height: currentHeight });
    
    // Give the browser a moment to settle the layout before rendering the path
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

  const generatePath = () => {
    if (svgSize.width === 0 || svgSize.height === 0) return "";

    const w = svgSize.width;
    const h = svgSize.height;

    // Adjusted proportions: Header and gap push items significantly downward.
    // Item 1 sits near 38-40% height. Item 2 near 66-68%. Item 3 near 90-92%.
    return `M 0 ${h * 0.25}
            C ${w * 0.4} ${h * 0.15} ${w * 0.95} ${h * 0.25} ${w * 0.82} ${h * 0.40} 
            S ${w * 0.18} ${h * 0.52} ${w * 0.2} ${h * 0.67}
            S ${w * 0.9} ${h * 0.7} ${w * 0.77} ${h * 0.89}
            S ${w * 1.4} ${h * 1} ${w * 0.6} ${h * 1.4}`;
  };

  return (
    <section className={styles['services-section']} ref={containerRef} id="services">

      {/* Ambient Grid */}
      <div className={styles['grid-overlay']} />

      {/* Content flowing naturally: Now using the logic layer overlay for interaction */}
      <div className={styles['services-content']}>
        
        {/* New Animated Header */}
        <header className={styles['services-header']}>
          <motion.span 
            className={styles['services-subtitle']}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: false, margin: "-10% 0px" }}
          >
            Our Expertise
          </motion.span>
          <h2 className={styles['services-title']}>
            <div className={styles['title-row']}>
              <SkewReveal text="FULL-SPECTRUM" delay={0.1} />
            </div>
            <div className={styles['title-row']}>
              <SkewReveal text="3D" delay={0.2} className={styles['outline-text']} />
              <SkewReveal text="CAPABILITIES" delay={0.3} className={styles['italic-text']} />
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
          <LusionTitle line1={services[0].line1} line2={services[0].line2} reverse />
          <div className={styles['service-desc-wrapper']}>
            <ServiceDescription text={services[0].desc} />
          </div>
        </motion.div>

        <motion.div
          className={`${styles['service-item']} ${styles['left']}`}
          initial="initial"
          whileInView="enter"
          viewport={{ once: false, margin: "-100px 0px" }}
        >
          <div className={styles['service-num']}>{services[1].num}</div>
          <LusionTitle line1={services[1].line1} line2={services[1].line2} />
          <div className={styles['service-desc-wrapper']}>
            <ServiceDescription text={services[1].desc} />
          </div>
        </motion.div>

        <motion.div
          className={`${styles['service-item']} ${styles['right']}`}
          initial="initial"
          whileInView="enter"
          viewport={{ once: false, margin: "-100px 0px" }}
        >
          <div className={styles['service-num']}>{services[2].num}</div>
          <LusionTitle line1={services[2].line1} line2={services[2].line2} reverse />
          <div className={styles['service-desc-wrapper']}>
            <ServiceDescription text={services[2].desc} />
          </div>
        </motion.div>
      </div>

      {/* Logic Layer: Placed LAST in DOM with high z-index and difference blend mode */}
      <motion.div 
        className={styles['svg-container-logic']}
        style={{ opacity: pathOpacity }}
      >
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style={{ overflow: 'visible' }}>
          {isReady && svgSize.width > 0 && (
            <motion.path
              d={generatePath()}
              className={styles['svg-path-logic']}
              style={{ pathLength }}
              initial={{ pathLength: 0 }}
              transition={{ 
                // CRITICAL: Disable morphing for the 'd' attribute to prevent ghost paths
                // only allow the spring to control the pathLength.
                d: { duration: 0 } 
              }}
            />
          )}
        </svg>
      </motion.div>
    </section>
  );
}

function LusionTitle({ line1, line2, reverse = false }: { line1: string, line2: string, reverse?: boolean }) {
  const words1 = useMemo(() => line1.split(" "), [line1]);
  const words2 = useMemo(() => line2.split(" "), [line2]);
  
  const detRef = useRef(null);
  const isInView = useInView(detRef, { once: false, margin: "-10% 0px" });

  const [phase, setPhase] = useState<"initial" | "reveal" | "shift">("initial");

  useEffect(() => {
    if (isInView) {
      setPhase("reveal");
      const timer = setTimeout(() => setPhase("shift"), 500);
      return () => clearTimeout(timer);
    } else {
      setPhase("initial");
    }
  }, [isInView]);

  // reverse=true (Item 1 & 3): Starts Right (flex-end), shifts to Left (flex-start)
  // reverse=false (Item 2): Starts Left (flex-start), shifts to Right (flex-end)
  const startAlign = reverse ? "flex-end" : "flex-start";
  const endAlign = reverse ? "flex-start" : "flex-end";
  
  const currentAlign = phase === "shift" ? endAlign : startAlign;

  return (
    <div ref={detRef} className={styles['lusion-container']}>
      {/* Line 1 */}
      <motion.div layout className={styles['lusion-line-wrapper']} style={{ justifyContent: currentAlign }} transition={{ layout: { duration: 1.2, ease: [0.65, 0, 0.35, 1] } }}>
        <motion.div layout className={styles['lusion-mask-top']}>
          <motion.div layout className={styles['lusion-row']}>
            {words1.map((word, i) => (
              <motion.span
                layout
                key={i}
                className={styles['lusion-word']}
                initial={{ y: "100%", opacity: 0 }}
                animate={phase !== "initial" ? { y: 0, opacity: 1 } : { y: "100%", opacity: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: i * 0.1 }}
              >
                {word}{i < words1.length - 1 ? '\u00A0' : ''}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Line 2 STAYS STILL at its final destination */}
      <motion.div layout className={styles['lusion-line-wrapper']} style={{ justifyContent: endAlign }} transition={{ layout: { duration: 1.2, ease: [0.65, 0, 0.35, 1] } }}>
        <motion.div layout className={styles['lusion-mask-bottom']}>
          <motion.div layout className={styles['lusion-row']}>
            {words2.map((word, i) => (
              <motion.span
                layout
                key={i}
                className={styles['lusion-word']}
                initial={{ y: "-100%", opacity: 0 }}
                animate={phase !== "initial" ? { y: 0, opacity: 1 } : { y: "-100%", opacity: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: i * 0.1 }}
              >
                {word}{i < words2.length - 1 ? '\u00A0' : ''}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}

function ServiceDescription({ text }: { text: string }) {
  const words = useMemo(() => text.split(" "), [text]);
  
  return (
    <motion.p 
      className={styles['service-desc']}
      variants={{
        initial: { opacity: 0 },
        enter: { 
          opacity: 1, 
          transition: { staggerChildren: 0.02, delayChildren: 0.2 } 
        }
      }}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          variants={{
            initial: { opacity: 0, filter: "blur(0px)", x: 2 },
            enter: { 
              opacity: 1, 
              filter: "blur(0px)", 
              x: 0,
              transition: { duration: 0.5, ease: "easeOut" } 
            }
          }}
          style={{ display: "inline-block", marginRight: "0.35em" }}
        >
          {word}
        </motion.span>
      ))}
    </motion.p>
  );
}

function SkewReveal({ text, delay = 0, className = "" }: { text: string, delay?: number, className?: string }) {

  const words = useMemo(() => text.split(" "), [text]);
  
  return (
    <span className={styles['skew-container']}>
      {words.map((word, i) => (
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
      ))}
    </span>
  );
}
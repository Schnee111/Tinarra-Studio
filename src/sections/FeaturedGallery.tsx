import React, { useRef, useState, useEffect, useMemo } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import styles from "./FeaturedGallery.module.css";
import Image from "next/image";

const items = [
  {
    title: "Articulated Dragon",
    tag: "Prototyping",
    src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop"
  },
  {
    title: "Anime Keychains",
    tag: "Custom Merch",
    src: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=2564&auto=format&fit=crop"
  },
  {
    title: "Custom Signage",
    tag: "Architecture",
    src: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=2670&auto=format&fit=crop"
  },
  {
    title: "Mechanical Joints",
    tag: "Engineering",
    src: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2670&auto=format&fit=crop"
  }
];

export default function FeaturedGallery({ textColor }: { textColor?: any }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 768);
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const localTextColor = useTransform(
    scrollYProgress,
    [-0.2, 0.1, 0.9, 1.2],
    ["#ffffff", "#000000", "#000000", "#ffffff"]
  );

  const finalTextColor = textColor || localTextColor;
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-60%"]);

  return (
    <motion.section 
      className={styles['gallery-section']} 
      ref={containerRef}
      id="products"
    >
      <motion.div className={styles['gallery-sticky']} style={{ color: finalTextColor }}>
        <motion.div 
          className={styles['gallery-track']} 
          style={{ x }}
        >
          {items.map((item, index) => (
            <Card 
              key={index} 
              item={item} 
              index={index} 
              textColor={finalTextColor} 
              isDesktop={isDesktop}
            />
          ))}
        </motion.div>
      </motion.div>
    </motion.section>
  );
}

// Static Variants (Moved outside to prevent re-creation)
const containerVariantsDesktop = {
  hidden: { scale: 0.9, opacity: 0 },
  visible: { scale: 1, opacity: 1 },
  exit: { scale: 0.8, opacity: 0 }
};

const containerVariantsMobile = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 }
};

const imageVariantsDesktop = {
  hidden: { scale: 1.3 },
  visible: { scale: 1 },
  exit: { scale: 1.5 }
};

const imageVariantsMobile = {
  hidden: { scale: 1 },
  visible: { scale: 1 },
  exit: { scale: 1 }
};

const transitionBase = { duration: 1.4, ease: [0.22, 1, 0.36, 1] as any };
const transitionMobile = { duration: 0.5, ease: [0.22, 1, 0.36, 1] as any };

const Card = React.memo(({ item, index, textColor, isDesktop }: { item: typeof items[0], index: number, textColor: any, isDesktop: boolean }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: false, margin: "0px -10% 0px -10%" });

  const containerVariants = isDesktop ? containerVariantsDesktop : containerVariantsMobile;
  const imageVariants = isDesktop ? imageVariantsDesktop : imageVariantsMobile;
  const transition = isDesktop ? transitionBase : transitionMobile;

  return (
    <motion.div
      ref={cardRef}
      className={`${styles['card']} ${!isLoaded ? styles['shimmer'] : ''}`}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "exit"}
      transition={transition}
      style={{ borderColor: textColor }}
    >
      <motion.div
        className={styles['image-container']}
        variants={imageVariants}
        initial="hidden"
        animate={isInView ? "visible" : "exit"}
        transition={{ ...transition, duration: isDesktop ? 1.6 : 0.5 }}
      >
        <Image 
          src={item.src} 
          alt={item.title} 
          fill
          className={styles['card-image']} 
          sizes="(max-width: 768px) 100vw, 60vw"
          onLoad={() => setIsLoaded(true)}
          priority={index <= 1}
        />
      </motion.div>

      <motion.div 
        className={styles['card-content']}
        style={{ color: textColor }}
        initial="initial"
        animate={isInView ? "enter" : "initial"}
        transition={{ staggerChildren: 0.05, delayChildren: 0.2 }}
      >
        <div className={styles['card-tag']}>
          <RollingText text={item.tag} noRoll textColor={textColor} />
        </div>
        <div className={styles['card-title']}>
          <RollingText text={item.title} textColor={textColor} />
        </div>
      </motion.div>
    </motion.div>
  );
});

Card.displayName = "Card";

const RollingText = React.memo(({ text, noRoll = false, textColor }: { text: string, noRoll?: boolean, textColor: any }) => {
  const characters = useMemo(() => text.split(""), [text]);

  return (
    <div className={styles['roll-container']}>
      <div className={styles['roll-inner']}>
        <div className={styles['roll-text-wrapper']}>
          {characters.map((char, i) => (
            <motion.span
              key={i}
              className={styles['roll-char']}
              style={{ color: textColor }}
              variants={{
                initial: { y: "100%", rotateX: 45, opacity: 0 },
                enter: { 
                  y: 0, 
                  rotateX: 0, 
                  opacity: 1,
                  transition: { 
                    duration: 0.8, 
                    ease: [0.22, 1, 0.36, 1] as any,
                    delay: i * 0.015 
                  } 
                }
              }}
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </div>
        {!noRoll && (
          <div className={`${styles['roll-text-wrapper']} ${styles['hover-layer']}`}>
            {characters.map((char, i) => (
              <span key={i} className={styles['roll-char']}>
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
});

RollingText.displayName = "RollingText";




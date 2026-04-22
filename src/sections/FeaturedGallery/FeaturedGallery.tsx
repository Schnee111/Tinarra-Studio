import React, { useRef, useState, useMemo } from "react";
import { motion, useScroll, useTransform, useInView, MotionValue } from "framer-motion";
import { useIsMobile } from "@/hooks/useIsMobile";
import styles from "./FeaturedGallery.module.css";
import Image from "next/image";

const items = [
  {
    title: "Articulated Dragon",
    tag: "Prototyping",
    src: "/images/articulated_dragon.jpg"
  },
  {
    title: "Anime Keychains",
    tag: "Custom Merch",
    src: "/images/keychain.jpg"
  },
  {
    title: "Custom Signage",
    tag: "Architecture",
    src: "/images/signage.jpg"
  },
  {
    title: "Mechanical Joints",
    tag: "Engineering",
    src: "/images/joints.jpg"
  }
];

export default function FeaturedGallery({ textColor, accentColor }: { textColor?: MotionValue<string>, accentColor?: MotionValue<string> }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const isDesktop = !isMobile;
  const [activeIndex, setActiveIndex] = useState(0);
  
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

  // Deteksi scroll di mobile untuk mengubah indikator oval
  const handleNativeScroll = () => {
    if (!trackRef.current || isDesktop) return;
    const scrollLeft = trackRef.current.scrollLeft;
    // Lebar kartu 80vw + gap 4vw = 84vw
    const cardWidth = window.innerWidth * 0.84; 
    const newIndex = Math.round(scrollLeft / cardWidth);
    setActiveIndex(Math.min(newIndex, items.length - 1));
  };

  return (
    <motion.section 
      className={styles['gallery-section']} 
      ref={containerRef}
      id="products"
    >
      <motion.div className={styles['gallery-sticky']} style={{ color: finalTextColor }}>
        <motion.div 
          ref={trackRef}
          className={styles['gallery-track']} 
          style={{ x: isDesktop ? x : "0%", willChange: "transform" }}
          onScroll={handleNativeScroll}
        >
          {items.map((item, index) => (
            <Card 
              key={index} 
              item={item} 
              index={index} 
              textColor="#ffffff" 
              isDesktop={isDesktop}
            />
          ))}
        </motion.div>

        {/* Infinix-style Oval Indicators (Mobile Only) */}

        <div className={styles['mobile-indicators']}>
          {items.map((_, idx) => (
            <motion.div 
              key={idx} 
              className={`${styles['dot']} ${idx === activeIndex ? styles['active'] : ''}`}
              style={{ 
                // Gunakan accentColor dinamis jika sedang aktif
                backgroundColor: idx === activeIndex ? (accentColor || "#dfff00") : undefined 
              }}
            />
          ))}
        </div>        

      </motion.div>
    </motion.section>
  );
}

// Static Variants (Moved outside to prevent re-creation)
const containerVariantsDesktop = {
  hidden: { scale: 0.9, opacity: 0 },
  visible: { scale: 1, opacity: 1 },
  exit: { scale: 0.85, opacity: 0 }
};

const containerVariantsMobile = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 }
};

const imageVariantsDesktop = {
  hidden: { scale: 1.2 },
  visible: { scale: 1 },
  exit: { scale: 1.3 }
};

const imageVariantsMobile = {
  hidden: { scale: 1 },
  visible: { scale: 1 },
  exit: { scale: 1 }
};

const transitionBase = { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const };
const transitionMobile = { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const };

const Card = React.memo(({ item, index, textColor, isDesktop }: { item: typeof items[0], index: number, textColor: string, isDesktop: boolean }) => {
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
      style={{ borderColor: textColor, opacity: 1, willChange: "transform, opacity" }}
    >
      <motion.div
        className={styles['image-container']}
        variants={imageVariants}
        initial="hidden"
        animate={isInView ? "visible" : "exit"}
        transition={{ ...transition, duration: isDesktop ? 0.8 : 0.5 }}
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

const RollingText = React.memo(({ text, noRoll = false, textColor }: { text: string, noRoll?: boolean, textColor: string }) => {
  const words = useMemo(() => text.split(" "), [text]);

  return (
    <div className={styles['roll-container']}>
      <div className={styles['roll-inner']}>
        <div className={styles['roll-text-wrapper']}>
          {words.map((word, i) => (
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
                    ease: [0.22, 1, 0.36, 1] as const,
                    delay: i * 0.08 
                  } 
                }
              }}
            >
              {word}&nbsp;
            </motion.span>
          ))}
        </div>
        {!noRoll && (
          <div className={`${styles['roll-text-wrapper']} ${styles['hover-layer']}`}>
            {words.map((word, i) => (
              <span key={i} className={styles['roll-char']}>
                {word}&nbsp;
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
});

RollingText.displayName = "RollingText";
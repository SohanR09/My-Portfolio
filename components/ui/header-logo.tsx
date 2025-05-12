// components/ui/header-logo.tsx
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export interface HeaderLogoProps {
  text?: string;
  size?: "sm" | "md" | "lg";
  loop?: boolean;
  className?: string; // For overriding colors or extra styling
}

const sizeClasses: Record<NonNullable<HeaderLogoProps["size"]>, string> = {
  sm: "text-xl sm:text-2xl",
  md: "text-2xl sm:text-3xl",
  lg: "text-3xl sm:text-4xl",
};

export function HeaderLogo({
  text = "LOGO",
  size = "md",
  loop = false,
  className = "text-black dark:text-white",
}: HeaderLogoProps) {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true });

  const letterAnimation = {
    hidden: { x: 40, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: (i: number) => ({
        delay: i * 0.08,
        duration: 0.5,
        ease: "easeOut",
        repeat: loop ? Infinity : 0,
        repeatType: "reverse" as const,
        repeatDelay: 1.5,
      }),
    },
  };

  return (
    <motion.div
      ref={containerRef}
      className={`flex items-center space-x-1 font-semibold tracking-wide cursor-pointer ${sizeClasses[size]} ${className}`}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      whileHover={{ scale: 1.05, y: -2 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      {text.split("").map((char, index) => (
        <motion.span
          key={index}
          custom={index}
          initial="hidden"
          animate="visible"
          variants={letterAnimation}
          transition={letterAnimation.visible.transition(index)}
        >
          {char}
        </motion.span>
      ))}
    </motion.div>
  );
}

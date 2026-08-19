import type { Variants, Transition } from "framer-motion";

// ===== SPRING TRANSITIONS =====
export const springBounce: Transition = {
  type: "spring",
  stiffness: 400,
  damping: 17,
};

export const springGentle: Transition = {
  type: "spring",
  stiffness: 300,
  damping: 24,
};

export const springSnappy: Transition = {
  type: "spring",
  stiffness: 500,
  damping: 30,
};

export const springHeavy: Transition = {
  type: "spring",
  stiffness: 200,
  damping: 20,
  mass: 1.2,
};

// ===== TWEEN TRANSITIONS =====
export const tweenFast: Transition = {
  type: "tween",
  duration: 0.12,
  ease: "easeOut",
};

export const tweenNormal: Transition = {
  type: "tween",
  duration: 0.2,
  ease: "easeOut",
};

export const tweenSlow: Transition = {
  type: "tween",
  duration: 0.35,
  ease: "easeOut",
};

// ===== BUTTON VARIANTS =====
export const buttonHover: Variants = {
  rest: { scale: 1 },
  hover: { scale: 1.04, y: -2 },
  tap: { scale: 0.96, y: 0 },
};

export const buttonBounce: Variants = {
  rest: { scale: 1 },
  hover: { scale: 1.06, y: -3 },
  tap: { scale: 0.92 },
};

// ===== CARD VARIANTS =====
export const cardHover: Variants = {
  rest: { scale: 1, y: 0 },
  hover: { scale: 1.02, y: -4 },
  tap: { scale: 0.98, y: 0 },
};

export const cardSlideUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

export const cardSlideLeft: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0 },
};

// ===== STAGGER =====
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: springGentle,
  },
};

// ===== POP / BOUNCE =====
export const popIn: Variants = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: springBounce,
  },
};

export const bounceIn: Variants = {
  hidden: { opacity: 0, scale: 0.3 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 15,
    },
  },
};

// ===== SHAKE =====
export const shake = {
  x: [0, -8, 8, -6, 6, -3, 3, 0],
  transition: { duration: 0.4 },
};

// ===== FLOAT =====
export const floatAnimation: Variants = {
  idle: {
    y: [0, -6, 0],
    transition: {
      duration: 2.5,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

export const floatSlow: Variants = {
  idle: {
    y: [0, -4, 0],
    transition: {
      duration: 3.5,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

// ===== GLOW / PULSE =====
export const glowPulse: Variants = {
  idle: {
    boxShadow: [
      "0 0 0 0 rgba(88, 204, 2, 0)",
      "0 0 20px 4px rgba(88, 204, 2, 0.3)",
      "0 0 0 0 rgba(88, 204, 2, 0)",
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

export const pulseScale: Variants = {
  idle: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

// ===== CONFETTI =====
export const confettiBurst = {
  hidden: { opacity: 0, scale: 0, rotate: 0 },
  visible: {
    opacity: [0, 1, 1, 0],
    scale: [0, 1.2, 1, 0.8],
    rotate: [0, 180, 360],
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

// ===== XP POPUP =====
export const xpFloat: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.5 },
  visible: {
    opacity: 1,
    y: -40,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20,
    },
  },
  exit: {
    opacity: 0,
    y: -80,
    scale: 0.8,
    transition: { duration: 0.3 },
  },
};

// ===== PAGE TRANSITIONS =====
export const pageSlideIn: Variants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
};

export const pageFadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

// ===== HEART =====
export const heartBeat: Variants = {
  idle: { scale: 1 },
  beat: {
    scale: [1, 1.3, 1, 1.15, 1],
    transition: { duration: 0.5 },
  },
  break: {
    scale: [1, 0.7, 1.2, 0.9, 1],
    opacity: [1, 0.8, 1, 0.9, 1],
    transition: { duration: 0.4 },
  },
};

// ===== WORLD MAP NODE =====
export const nodeIdle: Variants = {
  idle: {
    y: [0, -3, 0],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

export const nodeTap: Variants = {
  tap: {
    scale: [1, 0.85, 1.1, 1],
    transition: { duration: 0.35 },
  },
};

// ===== PROGRESS BAR =====
export const progressFill: Variants = {
  initial: { width: "0%" },
  animate: (progress: number) => ({
    width: `${progress}%`,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
      delay: 0.2,
    },
  }),
};

// ===== SKELETON SHIMMER =====
export const shimmer = {
  background: [
    "linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%)",
    "linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%)",
    "linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%)",
  ],
  backgroundSize: "200% 100%",
  animation: "shimmer 1.5s infinite",
};

// ===== STAGGER LIST HELPER =====
export function getStaggerList(itemCount: number) {
  return {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.05 * itemCount * 0.1,
      },
    },
  };
}

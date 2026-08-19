"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: "top" | "bottom" | "left" | "right";
}

export default function Tooltip({ content, children, position = "top" }: TooltipProps) {
  const [show, setShow] = useState(false);

  const positionClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`absolute z-50 px-3 py-1.5 bg-gray-900 dark:bg-gray-700 text-white text-xs font-bold rounded-lg whitespace-nowrap pointer-events-none ${positionClasses[position]}`}
          >
            {content}
            <div className={`absolute w-2 h-2 bg-gray-900 dark:bg-gray-700 rotate-45 ${
              position === "top" ? "bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2" :
              position === "bottom" ? "top-0 left-1/2 -translate-x-1/2 -translate-y-1/2" :
              position === "left" ? "right-0 top-1/2 -translate-y-1/2 translate-x-1/2" :
              "left-0 top-1/2 -translate-y-1/2 -translate-x-1/2"
            }`} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

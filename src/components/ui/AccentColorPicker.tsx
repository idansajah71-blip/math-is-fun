"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, Palette } from "lucide-react";
import { ACCENT_THEMES, getAccentColor, setAccentColor, type AccentColor } from "@/lib/accentColors";

export default function AccentColorPicker() {
  const [current, setCurrent] = useState<AccentColor>("green");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setCurrent(getAccentColor());
  }, []);

  const handleSelect = (color: AccentColor) => {
    setAccentColor(color);
    setCurrent(color);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] font-bold text-[var(--duo-text-muted)] hover:bg-gray-50 dark:hover:bg-gray-800 w-full transition-colors"
        whileHover={{ x: 4 }}
        whileTap={{ scale: 0.97 }}
      >
        <Palette size={18} />
        <span>Warna Tema</span>
        <div
          className="ml-auto w-4 h-4 rounded-full border-2 border-white shadow-sm"
          style={{ backgroundColor: ACCENT_THEMES[current].primary }}
        />
      </motion.button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-full left-0 right-0 mb-2 p-3 bg-white dark:bg-[var(--surface-elevated)] rounded-2xl border-2 border-[var(--border)] shadow-xl z-50"
        >
          <p className="text-[10px] font-bold text-[var(--fg-muted)] uppercase mb-2">Pilih Warna</p>
          <div className="grid grid-cols-3 gap-2">
            {Object.entries(ACCENT_THEMES).map(([key, theme]) => {
              const color = key as AccentColor;
              const isActive = current === color;
              return (
                <motion.button
                  key={color}
                  onClick={() => handleSelect(color)}
                  className={`relative flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all ${
                    isActive
                      ? "bg-gray-100 dark:bg-gray-800"
                      : "hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  }`}
                  style={isActive ? { outline: `2px solid ${theme.ring}`, outlineOffset: "2px" } : undefined}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: theme.primary }}
                  >
                    {isActive && <Check size={14} className="text-white" />}
                  </div>
                  <span className="text-[9px] font-bold text-[var(--fg-muted)]">{theme.label}</span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
}

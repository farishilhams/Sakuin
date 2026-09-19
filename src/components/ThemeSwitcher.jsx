import React from "react";
import { useTheme } from "../context/ThemeContext";
import { Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";

const ThemeSwitcher = () => {
   const { isDarkMode, toggleTheme } = useTheme();

   return (
      <motion.button
         whileHover={{ scale: 1.04 }}
         whileTap={{ scale: 0.95 }}
         onClick={toggleTheme}
         className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-[var(--color-surface-hover)] text-[var(--color-ink)] text-xs font-semibold tracking-normal shadow-xs transition-colors cursor-pointer"
         aria-label={isDarkMode ? "Ganti ke mode terang" : "Ganti ke mode gelap"}
         title={isDarkMode ? "Mode Terang" : "Mode Gelap"}
      >
         {isDarkMode ? (
            <>
               <Sun size={15} className="text-amber-400 stroke-[2.2]" />
               <span className="text-[11px]">Terang</span>
            </>
         ) : (
            <>
               <Moon size={15} className="text-indigo-500 stroke-[2.2]" />
               <span className="text-[11px]">Gelap</span>
            </>
         )}
      </motion.button>
   );
};

export default ThemeSwitcher;

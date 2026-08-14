"use client";

import { FiSun, FiMoon } from "react-icons/fi";
import { useTheme } from "@/components/ThemeProvider";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      className="w-8 h-8 flex items-center justify-center rounded-full text-ink/60 hover:text-gold hover:bg-surface-2 transition-colors"
    >
      {theme === "dark" ? <FiSun size={16} /> : <FiMoon size={16} />}
    </button>
  );
}

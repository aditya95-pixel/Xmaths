"use client";

import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";

export default function ModeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const handleToggle = async (e) => {
    const isDark = resolvedTheme === "dark";
    const nextTheme = isDark ? "light" : "dark";

    if (!document.startViewTransition) {
      setTheme(nextTheme);
      return;
    }

    const x = e.clientX;
    const y = e.clientY;
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const transition = document.startViewTransition(() => {
      // Synchronously force the dark class so the browser captures 
      // a pure black or pure white snapshot instantly!
      const root = document.documentElement;
      if (nextTheme === "dark") {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
      setTheme(nextTheme);
    });

    transition.ready.then(() => {
      const clipPath = [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${endRadius}px at ${x}px ${y}px)`,
      ];

      document.documentElement.animate(
        { clipPath },
        {
          duration: 800, // Smooth, 0.8s expansion
          easing: "cubic-bezier(0.85, 0, 0.15, 1)", // Premium Apple-like curve
          pseudoElement: "::view-transition-new(root)",
        }
      );
    });
  };

  if (!mounted) return null;

  return (
    <button
      onClick={handleToggle}
      className="relative p-2.5 rounded-full bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 transition-all focus:outline-none shadow-sm hover:shadow-md"
      aria-label="Toggle theme"
    >
      <motion.div
        initial={false}
        animate={{ 
            rotate: resolvedTheme === "dark" ? -180 : 0,
            scale: [1, 1.4, 1] // Spring pop effect
        }}
        transition={{ duration: 0.6, type: "spring", stiffness: 150, damping: 10 }}
      >
        {resolvedTheme === "dark" ? (
          <Sun className="w-5 h-5 text-yellow-400" />
        ) : (
          <Moon className="w-5 h-5 text-slate-800" />
        )}
      </motion.div>
    </button>
  );
}
"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export function PageTransition() {
  const pathname = usePathname();
  const [isNavigating, setIsNavigating] = useState(false);
  const [targetName, setTargetName] = useState("");

  useEffect(() => {
    // Listen for custom navigation events from the search bar
    const handleNavStart = (e: CustomEvent<{ artistName: string }>) => {
      setTargetName(e.detail.artistName);
      setIsNavigating(true);
    };

    window.addEventListener(
      "soundscope:navigate",
      handleNavStart as EventListener
    );
    return () => {
      window.removeEventListener(
        "soundscope:navigate",
        handleNavStart as EventListener
      );
    };
  }, []);

  // Clear overlay when pathname changes (page loaded)
  useEffect(() => {
    setIsNavigating(false);
  }, [pathname]);

  return (
    <AnimatePresence>
      {isNavigating && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-bg-primary"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Animated sound wave */}
          <div className="flex items-center gap-1.5 mb-6">
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                className="w-1.5 rounded-full bg-gradient-to-t from-purple-600 to-cyan-400"
                initial={{ height: 12 }}
                animate={{ height: [12, 36, 12] }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  delay: i * 0.15,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>

          {/* Loading text */}
          <motion.p
            className="text-text-secondary text-lg"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Loading{" "}
            <span className="text-text-primary font-semibold">
              {targetName}
            </span>
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

"use client"

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SilkOptimized } from "@/components/ui/silk-optimized";

interface SilkSplashProps {
  onComplete: () => void;
  duration?: number;
}

export function SilkSplash({ onComplete, duration = 4000 }: SilkSplashProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 500); // Wait for fade out animation
    }, duration);

    return () => clearTimeout(timer);
  }, [onComplete, duration]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black overflow-hidden"
        >
          {/* Silk Animation Background */}
          <SilkOptimized
            color="#4F46E5"
            speed={3}
            scale={1.5}
            className="opacity-80"
          />

          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-black/30" />

          {/* Content */}
          <div className="relative z-10 text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                delay: 0.2, 
                duration: 0.8,
                ease: "easeOut"
              }}
              className="space-y-8"
            >
              {/* Logo/Brand Name */}
              <motion.h1
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ 
                  delay: 0.5, 
                  duration: 1,
                  ease: "easeOut"
                }}
                className="text-7xl md:text-9xl font-bold text-white tracking-wider relative"
                style={{
                  textShadow: "0 0 40px rgba(255, 255, 255, 0.5)",
                  fontFamily: "Inter, sans-serif"
                }}
              >
                INTERLINK
                <motion.div
                  className="absolute -inset-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg blur-2xl opacity-20"
                  animate={{
                    opacity: [0.2, 0.4, 0.2],
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </motion.h1>

              {/* Tagline */}
              <motion.p
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ 
                  delay: 0.8, 
                  duration: 0.8,
                  ease: "easeOut"
                }}
                className="text-2xl md:text-3xl text-white/90 font-light tracking-wide"
              >
                Connecting Futures
              </motion.p>

              {/* Loading indicator */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ 
                  delay: 1.2, 
                  duration: 0.4
                }}
                className="flex justify-center mt-12"
              >
                <div className="flex space-x-3">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-4 h-4 bg-white/80 rounded-full"
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.5, 1, 0.5],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: i * 0.2,
                        ease: "easeInOut"
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
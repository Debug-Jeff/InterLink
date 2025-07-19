"use client"

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Silk from "@/components/ui/silk";

interface SplashScreenProps {
  onComplete: () => void;
  duration?: number;
}

export function SplashScreen({ onComplete, duration = 3000 }: SplashScreenProps) {
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
          <div className="absolute inset-0">
            <Silk
              speed={8}
              scale={2}
              color="#4F46E5"
              noiseIntensity={2}
              rotation={0.2}
            />
          </div>

          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-black/20" />

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
              className="space-y-6"
            >
              {/* Logo/Brand Name */}
              <motion.h1
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ 
                  delay: 0.5, 
                  duration: 0.8,
                  ease: "easeOut"
                }}
                className="text-6xl md:text-8xl font-bold text-white tracking-wider"
                style={{
                  textShadow: "0 0 30px rgba(255, 255, 255, 0.3)",
                  fontFamily: "Inter, sans-serif"
                }}
              >
                INTERLINK
              </motion.h1>

              {/* Tagline */}
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ 
                  delay: 0.8, 
                  duration: 0.6,
                  ease: "easeOut"
                }}
                className="text-xl md:text-2xl text-white/80 font-light tracking-wide"
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
                className="flex justify-center mt-8"
              >
                <div className="flex space-x-2">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-3 h-3 bg-white rounded-full"
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
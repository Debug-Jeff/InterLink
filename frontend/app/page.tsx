"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { AnimatedLogo } from "@/components/animated-logo"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function SplashScreen() {
  const [isLoading, setIsLoading] = useState(true)
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([])

  useEffect(() => {
    // Generate floating particles
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 2,
    }))
    setParticles(newParticles)

    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: { duration: 0.5 },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  }

  const particleVariants = {
    animate: {
      y: [0, -20, 0],
      opacity: [0.3, 0.8, 0.3],
      transition: {
        duration: 4,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    },
  }

  if (!isLoading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center relative overflow-hidden">
        {/* Floating Particles */}
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-2 h-2 bg-white/30 rounded-full"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
            }}
            variants={particleVariants}
            animate="animate"
            transition={{ delay: particle.delay }}
          />
        ))}

        <motion.div
          className="text-center z-10 glass-effect p-12 rounded-3xl max-w-2xl mx-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <motion.div variants={itemVariants} className="mb-8">
            <div className="floating-animation">
              <AnimatedLogo />
            </div>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent"
          >
            INTERLINK
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-8 leading-relaxed"
          >
            Connecting talent with opportunity through innovation
          </motion.p>

          <motion.div variants={itemVariants} className="space-y-4">
            <Button
              asChild
              size="lg"
              className="px-8 py-4 text-lg bg-gradient-primary hover:scale-105 transition-all duration-300 pulse-glow rounded-full"
            >
              <Link href="/home">Enter Platform</Link>
            </Button>
            <div className="flex justify-center space-x-2">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-gradient-primary rounded-full"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center relative overflow-hidden">
      {/* Loading Animation */}
      <motion.div
        className="text-center glass-effect p-12 rounded-3xl"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="floating-animation mb-8">
          <AnimatedLogo />
        </div>
        <motion.div
          className="flex justify-center space-x-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-3 h-3 bg-gradient-primary rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1,
                repeat: Number.POSITIVE_INFINITY,
                delay: i * 0.2,
              }}
            />
          ))}
        </motion.div>
        <motion.p
          className="mt-4 text-gray-600 dark:text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          Loading...
        </motion.p>
      </motion.div>
    </div>
  )
}

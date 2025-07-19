"use client"

import { motion } from "framer-motion"

interface AnimatedLogoProps {
  className?: string
}

export function AnimatedLogo({ className }: AnimatedLogoProps) {
  const text = "INTERLINK"
  const letters = Array.from(text)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  }

  const letterVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 200,
      },
    },
  }

  return (
    <motion.div
      className={`flex items-center justify-center text-5xl font-extrabold tracking-tight ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {letters.map((letter, index) => (
        <motion.span
          key={index}
          variants={letterVariants}
          className={
            letter === "I" ? "text-logo-blue text-6xl" : letter === "L" ? "text-logo-orange text-6xl" : "text-gray-800"
          }
        >
          {letter}
        </motion.span>
      ))}
    </motion.div>
  )
}

"use client"

import React, { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

interface SilkOptimizedProps {
  color?: string
  speed?: number
  scale?: number
  className?: string
}

export function SilkOptimized({ 
  color = '#4F46E5', 
  speed = 2, 
  scale = 1,
  className = ''
}: SilkOptimizedProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const timeRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Convert hex to RGB
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : { r: 79, g: 70, b: 229 }
    }

    const baseColor = hexToRgb(color)

    // Animation loop
    const animate = () => {
      timeRef.current += 0.01 * speed
      
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // Create silk-like flowing pattern
      const imageData = ctx.createImageData(canvas.width, canvas.height)
      const data = imageData.data
      
      for (let x = 0; x < canvas.width; x += 2) {
        for (let y = 0; y < canvas.height; y += 2) {
          const normalizedX = x / canvas.width * scale
          const normalizedY = y / canvas.height * scale
          
          // Create flowing pattern
          const wave1 = Math.sin(normalizedX * 8 + timeRef.current * 2) * 0.5 + 0.5
          const wave2 = Math.sin(normalizedY * 6 + timeRef.current * 1.5) * 0.5 + 0.5
          const wave3 = Math.sin((normalizedX + normalizedY) * 4 + timeRef.current) * 0.5 + 0.5
          
          const intensity = (wave1 + wave2 + wave3) / 3
          const alpha = Math.max(0.1, intensity * 0.8)
          
          // Create gradient effect
          const gradient = Math.sin(normalizedX * Math.PI) * Math.sin(normalizedY * Math.PI)
          
          const pixelIndex = (y * canvas.width + x) * 4
          
          if (pixelIndex < data.length - 3) {
            data[pixelIndex] = baseColor.r + (gradient * 50)     // Red
            data[pixelIndex + 1] = baseColor.g + (gradient * 30) // Green
            data[pixelIndex + 2] = baseColor.b + (gradient * 70) // Blue
            data[pixelIndex + 3] = alpha * 255                   // Alpha
          }
        }
      }
      
      ctx.putImageData(imageData, 0, 0)
      
      // Add overlay gradient for smooth effect
      const overlayGradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
      overlayGradient.addColorStop(0, `rgba(${baseColor.r}, ${baseColor.g}, ${baseColor.b}, 0.1)`)
      overlayGradient.addColorStop(0.5, `rgba(${baseColor.r}, ${baseColor.g}, ${baseColor.b}, 0.2)`)
      overlayGradient.addColorStop(1, `rgba(${baseColor.r}, ${baseColor.g}, ${baseColor.b}, 0.1)`)
      
      ctx.fillStyle = overlayGradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [color, speed, scale])

  return (
    <div className={`absolute inset-0 ${className}`}>
      <canvas
        ref={canvasRef}
        className="w-full h-full object-cover"
        style={{ filter: 'blur(0.5px)' }}
      />
    </div>
  )
}
"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Shield,
  Zap,
  Users,
  CheckCircle,
  Github,
  Chrome,
  Linkedin,
} from "lucide-react"
import Link from "next/link"
import { signIn } from "../actions"
import { useActionState } from "react"
import { createClient } from "@/lib/supabase/client"

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [state, action, isPending] = useActionState(signIn, null)
  const supabase = createClient()

  const handleOAuthSignIn = async (provider: string) => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider.toLowerCase() as any,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        console.error('OAuth sign in error:', error)
        // Handle error - could add toast notification here
      }
    } catch (error) {
      console.error('OAuth sign in error:', error)
      // Handle error - could add toast notification here
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  }

  const benefits = [
    {
      icon: <Zap className="w-5 h-5" />,
      text: "Instant access to 500+ startup opportunities",
    },
    {
      icon: <Users className="w-5 h-5" />,
      text: "Connect with industry-leading mentors",
    },
    {
      icon: <Shield className="w-5 h-5" />,
      text: "Secure, encrypted platform",
    },
  ]

  const socialProviders = [
    {
      name: "Google",
      icon: <Chrome className="w-5 h-5" />,
      gradient: "bg-gradient-primary",
    },
    {
      name: "GitHub",
      icon: <Github className="w-5 h-5" />,
      gradient: "bg-gradient-secondary",
    },
    {
      name: "Facebook",
      icon: <Chrome className="w-5 h-5" />,
      gradient: "bg-gradient-tertiary",
    },
  ]

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 white-gradient-bg">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-md space-y-8"
        >
          <motion.div variants={itemVariants} className="text-center">
            <Badge className="mb-4 bg-gradient-primary text-white border-0">Welcome Back</Badge>
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">Sign In</h1>
            <p className="text-gray-600 dark:text-gray-400">Access your INTERLINK account and continue your journey</p>
          </motion.div>

          {/* Social Login */}
          <motion.div variants={itemVariants} className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              {socialProviders.map((provider) => (
                <Button
                  key={provider.name}
                  variant="outline"
                  onClick={() => handleOAuthSignIn(provider.name)}
                  disabled={isPending}
                  className="glass-effect border-white/30 hover:border-white/50 transition-all duration-300 group bg-transparent"
                >
                  <div
                    className={`w-6 h-6 rounded ${provider.gradient} flex items-center justify-center text-white group-hover:scale-110 transition-transform`}
                  >
                    {provider.icon}
                  </div>
                </Button>
              ))}
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full bg-white/20" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white/50 dark:bg-gray-900/50 text-gray-600 dark:text-gray-400">
                  Or continue with email
                </span>
              </div>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div variants={itemVariants}>
            <Card className="glass-effect border-white/20 hover:border-white/40 transition-all duration-300">
              <CardContent className="p-6">
                <form action={action} className="space-y-6">
                  <div>
                    <Label htmlFor="email" className="text-gray-700 dark:text-gray-300 font-medium">
                      Email Address
                    </Label>
                    <div className="relative mt-2">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        className="pl-10 glass-effect border-white/30 focus:border-white/50"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="password" className="text-gray-700 dark:text-gray-300 font-medium">
                      Password
                    </Label>
                    <div className="relative mt-2">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        required
                        className="pl-10 pr-10 glass-effect border-white/30 focus:border-white/50"
                        placeholder="Enter your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="remember" />
                      <Label htmlFor="remember" className="text-sm text-gray-600 dark:text-gray-400">
                        Remember me
                      </Label>
                    </div>
                    <Link
                      href="/forgot-password"
                      className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  {state?.error && (
                    <div className="p-3 bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                      <p className="text-sm text-red-600 dark:text-red-400">{state.error}</p>
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={isPending}
                    className="w-full bg-gradient-primary hover:scale-105 transition-all duration-300 pulse-glow rounded-full group"
                  >
                    {isPending ? (
                      "Signing in..."
                    ) : (
                      <>
                        Sign In
                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants} className="text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Don't have an account?{" "}
              <Link
                href="/signup"
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
              >
                Sign up for free
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Right Side - Benefits */}
      <div className="hidden lg:flex flex-1 items-center justify-center p-8 bg-slate-50/70 relative overflow-hidden">
        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 10 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.2, 0.8, 0.2],
              }}
              transition={{
                duration: 4 + Math.random() * 2,
                repeat: Number.POSITIVE_INFINITY,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 max-w-md space-y-8"
        >
          <motion.div variants={itemVariants} className="text-center">
            <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">Welcome Back to Your Future</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Continue building meaningful connections and advancing your career with INTERLINK.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-4">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="flex items-center space-x-3 p-4 glass-effect rounded-lg border-white/20"
              >
                <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center text-white">
                  {benefit.icon}
                </div>
                <span className="text-gray-700 dark:text-gray-300">{benefit.text}</span>
              </motion.div>
            ))}
          </motion.div>

          <motion.div variants={itemVariants} className="text-center">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white/20 rounded-full">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-gray-700 dark:text-gray-300 font-medium">Trusted by 10,000+ professionals</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

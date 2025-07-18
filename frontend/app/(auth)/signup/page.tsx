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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  ArrowRight,
  Shield,
  Users,
  CheckCircle,
  Github,
  Chrome,
  Linkedin,
  Star,
  Award,
  TrendingUp,
} from "lucide-react"
import Link from "next/link"
import { signUp } from "../actions"
import { useActionState } from "react"
import { createClient } from "@/lib/supabase/client"

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [state, action, isPending] = useActionState(signUp, null)
  const supabase = createClient()

  const handleOAuthSignUp = async (provider: string) => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider.toLowerCase() as any,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        console.error('OAuth sign up error:', error)
        // Handle error - could add toast notification here
      }
    } catch (error) {
      console.error('OAuth sign up error:', error)
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
      icon: <Star className="w-5 h-5" />,
      title: "Premium Opportunities",
      description: "Access exclusive internships at top-tier startups",
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: "Expert Mentorship",
      description: "Connect with industry leaders and experienced professionals",
    },
    {
      icon: <Award className="w-5 h-5" />,
      title: "Skill Development",
      description: "Comprehensive learning resources and career coaching",
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      title: "Career Growth",
      description: "95% of our interns receive full-time offers",
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

  const steps = [
    { number: 1, title: "Create Account", description: "Sign up with your details" },
    { number: 2, title: "Complete Profile", description: "Add your skills and preferences" },
    { number: 3, title: "Get Matched", description: "Find your perfect opportunity" },
  ]

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Benefits */}
      <div className="hidden lg:flex flex-1 items-center justify-center p-8 gradient-bg relative overflow-hidden">
        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 15 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -40, 0],
                opacity: [0.2, 0.8, 0.2],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 5 + Math.random() * 2,
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
            <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">Start Your Journey Today</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Join thousands of professionals who've transformed their careers with INTERLINK.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="flex items-start space-x-4 p-4 glass-effect rounded-lg border-white/20"
              >
                <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center text-white flex-shrink-0">
                  {benefit.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-white mb-1">{benefit.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{benefit.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">How it works:</h3>
            <div className="space-y-3">
              {steps.map((step, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-secondary rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {step.number}
                  </div>
                  <div>
                    <span className="font-medium text-gray-800 dark:text-white">{step.title}</span>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-md space-y-8"
        >
          <motion.div variants={itemVariants} className="text-center">
            <Badge className="mb-4 bg-gradient-primary text-white border-0">Join 10,000+ Professionals</Badge>
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
              Create Account
            </h1>
            <p className="text-gray-600 dark:text-gray-400">Start your journey to meaningful career opportunities</p>
          </motion.div>

          {/* Social Login */}
          <motion.div variants={itemVariants} className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              {socialProviders.map((provider) => (
                <Button
                  key={provider.name}
                  variant="outline"
                  onClick={() => handleOAuthSignUp(provider.name)}
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
                  Or create account with email
                </span>
              </div>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div variants={itemVariants}>
            <Card className="glass-effect border-white/20 hover:border-white/40 transition-all duration-300">
              <CardContent className="p-6">
                <form action={action} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName" className="text-gray-700 dark:text-gray-300 font-medium">
                        First Name
                      </Label>
                      <div className="relative mt-2">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                          id="firstName"
                          name="firstName"
                          required
                          className="pl-10 glass-effect border-white/30 focus:border-white/50"
                          placeholder="John"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="lastName" className="text-gray-700 dark:text-gray-300 font-medium">
                        Last Name
                      </Label>
                      <div className="relative mt-2">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                          id="lastName"
                          name="lastName"
                          required
                          className="pl-10 glass-effect border-white/30 focus:border-white/50"
                          placeholder="Doe"
                        />
                      </div>
                    </div>
                  </div>

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
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="userType" className="text-gray-700 dark:text-gray-300 font-medium">
                      I am a...
                    </Label>
                    <Select name="userType" required>
                      <SelectTrigger className="mt-2 glass-effect border-white/30 focus:border-white/50">
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="intern">Student/Intern</SelectItem>
                        <SelectItem value="company">Startup/Company</SelectItem>
                      </SelectContent>
                    </Select>
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
                        placeholder="Create a strong password"
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

                  <div>
                    <Label htmlFor="confirmPassword" className="text-gray-700 dark:text-gray-300 font-medium">
                      Confirm Password
                    </Label>
                    <div className="relative mt-2">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        required
                        className="pl-10 pr-10 glass-effect border-white/30 focus:border-white/50"
                        placeholder="Confirm your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start space-x-2">
                      <Checkbox id="terms" name="terms" required className="mt-1" />
                      <Label htmlFor="terms" className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                        I agree to the{" "}
                        <Link
                          href="/terms"
                          className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link
                          href="/privacy"
                          className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          Privacy Policy
                        </Link>
                      </Label>
                    </div>

                    <div className="flex items-start space-x-2">
                      <Checkbox id="marketing" name="marketing" className="mt-1" />
                      <Label htmlFor="marketing" className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                        I'd like to receive updates about new opportunities and platform features
                      </Label>
                    </div>
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
                      "Creating account..."
                    ) : (
                      <>
                        Create Account
                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants} className="text-center space-y-4">
            <p className="text-gray-600 dark:text-gray-400">
              Already have an account?{" "}
              <Link
                href="/signin"
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
              >
                Sign in here
              </Link>
            </p>

            <div className="flex items-center justify-center space-x-4 text-sm text-gray-500 dark:text-gray-500">
              <div className="flex items-center space-x-1">
                <Shield className="w-4 h-4" />
                <span>Secure & Encrypted</span>
              </div>
              <div className="flex items-center space-x-1">
                <CheckCircle className="w-4 h-4" />
                <span>GDPR Compliant</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

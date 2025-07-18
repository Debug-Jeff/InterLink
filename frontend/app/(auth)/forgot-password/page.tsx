"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, ArrowRight, Shield, Clock, CheckCircle, ArrowLeft, HelpCircle, Lock, Smartphone } from "lucide-react"
import Link from "next/link"
import { resetPassword } from "../actions"
import { useActionState } from "react"

export default function ForgotPasswordPage() {
  const [state, action, isPending] = useActionState(resetPassword, null)
  const [emailSent, setEmailSent] = useState(false)

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

  const steps = [
    {
      icon: <Mail className="w-5 h-5" />,
      title: "Enter your email",
      description: "We'll send you a secure reset link",
    },
    {
      icon: <Smartphone className="w-5 h-5" />,
      title: "Check your inbox",
      description: "Click the link in your email",
    },
    {
      icon: <Lock className="w-5 h-5" />,
      title: "Create new password",
      description: "Set a strong, secure password",
    },
  ]

  const securityFeatures = [
    {
      icon: <Shield className="w-5 h-5" />,
      title: "Secure Process",
      description: "All reset links are encrypted and time-limited",
    },
    {
      icon: <Clock className="w-5 h-5" />,
      title: "Quick Recovery",
      description: "Reset links expire in 15 minutes for security",
    },
    {
      icon: <CheckCircle className="w-5 h-5" />,
      title: "Account Protection",
      description: "Your account remains secure throughout the process",
    },
  ]

  const handleSubmit = async (formData: FormData) => {
    const result = await action(formData)
    if (result?.success) {
      setEmailSent(true)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-md space-y-8"
        >
          <motion.div variants={itemVariants} className="text-center">
            <Badge className="mb-4 bg-gradient-primary text-white border-0">Password Recovery</Badge>
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
              Reset Password
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {emailSent
                ? "Check your email for reset instructions"
                : "Enter your email to receive a password reset link"}
            </p>
          </motion.div>

          {!emailSent ? (
            <>
              {/* Reset Form */}
              <motion.div variants={itemVariants}>
                <Card className="glass-effect border-white/20 hover:border-white/40 transition-all duration-300">
                  <CardContent className="p-6">
                    <form action={handleSubmit} className="space-y-6">
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
                            placeholder="Enter your email address"
                          />
                        </div>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-500">
                          We'll send a secure reset link to this email address
                        </p>
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
                          "Sending reset link..."
                        ) : (
                          <>
                            Send Reset Link
                            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Process Steps */}
              <motion.div variants={itemVariants}>
                <Card className="glass-effect border-white/20">
                  <CardHeader>
                    <CardTitle className="text-lg text-gray-800 dark:text-white flex items-center">
                      <HelpCircle className="w-5 h-5 mr-2" />
                      How it works
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {steps.map((step, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                          {index + 1}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-800 dark:text-white">{step.title}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{step.description}</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            </>
          ) : (
            /* Success State */
            <motion.div variants={itemVariants} className="space-y-6">
              <Card className="glass-effect border-white/20 text-center">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center text-white mx-auto mb-4">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Reset Link Sent!</h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    We've sent a password reset link to your email address. Please check your inbox and follow the
                    instructions.
                  </p>
                  <div className="space-y-3 text-sm text-gray-500 dark:text-gray-500">
                    <p>• The link will expire in 15 minutes for security</p>
                    <p>• Check your spam folder if you don't see the email</p>
                    <p>• You can request a new link if needed</p>
                  </div>
                </CardContent>
              </Card>

              <div className="text-center space-y-4">
                <Button
                  onClick={() => setEmailSent(false)}
                  variant="outline"
                  className="glass-effect border-white/30 hover:bg-white/20 transition-all duration-300"
                >
                  Send Another Link
                </Button>
              </div>
            </motion.div>
          )}

          <motion.div variants={itemVariants} className="text-center">
            <Link
              href="/signin"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
            >
              <ArrowLeft className="mr-2 w-4 h-4" />
              Back to Sign In
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Right Side - Security Info */}
      <div className="hidden lg:flex flex-1 items-center justify-center p-8 gradient-bg relative overflow-hidden">
        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 bg-white/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.2, 0.8, 0.2],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 6 + Math.random() * 2,
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
            <div className="w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center text-white mx-auto mb-6">
              <Shield className="w-10 h-10" />
            </div>
            <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">Secure Recovery Process</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Your account security is our top priority. Our password reset process is designed to keep you safe.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-6">
            {securityFeatures.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="flex items-start space-x-4 p-4 glass-effect rounded-lg border-white/20"
              >
                <div className="w-10 h-10 bg-gradient-secondary rounded-lg flex items-center justify-center text-white flex-shrink-0">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-white mb-1">{feature.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div variants={itemVariants} className="text-center">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white/20 rounded-full">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-gray-700 dark:text-gray-300 font-medium">Bank-level security standards</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

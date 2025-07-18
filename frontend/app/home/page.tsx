"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Rocket, Users, Target, Star, ArrowRight, Briefcase, GraduationCap, Building2, TrendingUp } from "lucide-react"

export default function HomePage() {
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
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  }

  const features = [
    {
      icon: <Target className="w-8 h-8" />,
      title: "Precision Matching",
      description: "AI-powered algorithms connect the right talent with the perfect opportunities.",
      gradient: "bg-gradient-primary",
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Community Driven",
      description: "Join a thriving community of innovators, creators, and industry leaders.",
      gradient: "bg-gradient-secondary",
    },
    {
      icon: <Rocket className="w-8 h-8" />,
      title: "Career Acceleration",
      description: "Fast-track your career with hands-on experience at cutting-edge startups.",
      gradient: "bg-gradient-tertiary",
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Growth Analytics",
      description: "Track your progress and showcase your achievements with detailed analytics.",
      gradient: "bg-gradient-quaternary",
    },
  ]

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Software Engineer",
      company: "TechStart Inc.",
      content:
        "INTERLINK connected me with an amazing startup where I've grown tremendously. The platform made the entire process seamless.",
      avatar: "/placeholder.svg?height=60&width=60",
      rating: 5,
    },
    {
      name: "Michael Chen",
      role: "Product Manager",
      company: "InnovateCorp",
      content:
        "As a startup founder, finding quality interns was always challenging. INTERLINK delivered exceptional candidates who became key team members.",
      avatar: "/placeholder.svg?height=60&width=60",
      rating: 5,
    },
    {
      name: "Emily Rodriguez",
      role: "UX Designer",
      company: "DesignLab",
      content:
        "The mentorship and real-world experience I gained through INTERLINK was invaluable. It launched my career in ways I never imagined.",
      avatar: "/placeholder.svg?height=60&width=60",
      rating: 5,
    },
  ]

  const stats = [
    { number: "10K+", label: "Active Users", icon: <Users className="w-6 h-6" /> },
    { number: "500+", label: "Partner Startups", icon: <Building2 className="w-6 h-6" /> },
    { number: "95%", label: "Success Rate", icon: <Target className="w-6 h-6" /> },
    { number: "2M+", label: "Connections Made", icon: <Rocket className="w-6 h-6" /> },
  ]

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        <div className="absolute inset-0 gradient-bg" />

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

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
            <motion.div variants={itemVariants}>
              <Badge className="mb-4 bg-white/20 text-gray-800 dark:text-white border-white/30 hover:bg-white/30 transition-all duration-300">
                🚀 Now connecting 10,000+ professionals
              </Badge>
            </motion.div>

            <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight">
              <span className="bg-gradient-primary bg-clip-text text-transparent">Connect.</span>
              <br />
              <span className="bg-gradient-secondary bg-clip-text text-transparent">Create.</span>
              <br />
              <span className="bg-gradient-tertiary bg-clip-text text-transparent">Succeed.</span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed"
            >
              Bridge the gap between ambitious talent and innovative startups. Your next career breakthrough starts
              here.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                asChild
                size="lg"
                className="px-8 py-4 text-lg bg-gradient-primary hover:scale-105 transition-all duration-300 pulse-glow rounded-full group"
              >
                <Link href="/signup">
                  Start Your Journey
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="px-8 py-4 text-lg glass-effect border-white/30 hover:bg-white/20 transition-all duration-300 rounded-full bg-transparent"
              >
                <Link href="/about">Learn More</Link>
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 max-w-4xl mx-auto"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="text-center glass-effect p-6 rounded-2xl hover:scale-105 transition-all duration-300"
                  whileHover={{ y: -5 }}
                >
                  <div className="flex justify-center mb-2 text-gray-600 dark:text-gray-400">{stat.icon}</div>
                  <div className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                    {stat.number}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={containerVariants}
            className="text-center mb-16"
          >
            <motion.h2
              variants={itemVariants}
              className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent"
            >
              Why Choose INTERLINK?
            </motion.h2>
            <motion.p variants={itemVariants} className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              We're revolutionizing how talent connects with opportunity through cutting-edge technology and human
              insight.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group"
              >
                <Card className="h-full glass-effect border-white/20 hover:border-white/40 transition-all duration-300 overflow-hidden">
                  <CardHeader className="text-center pb-4">
                    <div
                      className={`w-16 h-16 mx-auto rounded-2xl ${feature.gradient} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300`}
                    >
                      {feature.icon}
                    </div>
                    <CardTitle className="text-xl font-semibold">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 gradient-bg">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={containerVariants}
            className="text-center mb-16"
          >
            <motion.h2
              variants={itemVariants}
              className="text-4xl md:text-5xl font-bold mb-6 text-gray-800 dark:text-white"
            >
              Success Stories
            </motion.h2>
            <motion.p variants={itemVariants} className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Hear from the professionals and companies who've transformed their futures through INTERLINK.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {testimonials.map((testimonial, index) => (
              <motion.div key={testimonial.name} variants={itemVariants} whileHover={{ y: -5 }} className="group">
                <Card className="h-full glass-effect border-white/30 hover:border-white/50 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed italic">
                      "{testimonial.content}"
                    </p>
                    <div className="flex items-center">
                      <Image
                        src={testimonial.avatar || "/placeholder.svg"}
                        alt={testimonial.name}
                        width={48}
                        height={48}
                        className="rounded-full mr-4"
                      />
                      <div>
                        <h4 className="font-semibold text-gray-800 dark:text-white">{testimonial.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {testimonial.role} at {testimonial.company}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            variants={containerVariants}
            className="space-y-8"
          >
            <motion.h2
              variants={itemVariants}
              className="text-4xl md:text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent"
            >
              Ready to Transform Your Future?
            </motion.h2>
            <motion.p variants={itemVariants} className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Join thousands of professionals who've already discovered their perfect match. Your next opportunity is
              just one click away.
            </motion.p>
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                asChild
                size="lg"
                className="px-8 py-4 text-lg bg-gradient-primary hover:scale-105 transition-all duration-300 pulse-glow rounded-full group"
              >
                <Link href="/signup">
                  <GraduationCap className="mr-2 w-5 h-5" />
                  Join as Intern
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                className="px-8 py-4 text-lg bg-gradient-secondary hover:scale-105 transition-all duration-300 pulse-glow rounded-full group"
              >
                <Link href="/signup">
                  <Briefcase className="mr-2 w-5 h-5" />
                  Post Opportunities
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

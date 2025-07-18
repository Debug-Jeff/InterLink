"use client"

import { motion } from "framer-motion"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Briefcase,
  Rocket,
  GraduationCap,
  Building2,
  Users,
  Target,
  TrendingUp,
  Award,
  CheckCircle,
  ArrowRight,
  Star,
  Zap,
  Shield,
} from "lucide-react"
import Link from "next/link"

export default function ServicesPage() {
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

  const internServices = [
    {
      icon: <Target className="w-8 h-8" />,
      title: "Smart Matching",
      description:
        "AI-powered algorithms analyze your skills, interests, and career goals to connect you with the perfect startup opportunities.",
      features: ["Personality assessment", "Skill matching", "Culture fit analysis", "Growth potential evaluation"],
      gradient: "bg-gradient-primary",
    },
    {
      icon: <GraduationCap className="w-8 h-8" />,
      title: "Skill Development",
      description:
        "Access comprehensive learning resources and mentorship programs designed to accelerate your professional growth.",
      features: ["Online courses", "1-on-1 mentoring", "Skill assessments", "Career coaching"],
      gradient: "bg-gradient-secondary",
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Community Network",
      description:
        "Join a vibrant community of ambitious professionals, industry experts, and successful entrepreneurs.",
      features: ["Networking events", "Peer connections", "Industry insights", "Alumni network"],
      gradient: "bg-gradient-tertiary",
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Career Support",
      description:
        "Comprehensive support throughout your internship journey, from application to full-time opportunities.",
      features: ["Resume optimization", "Interview prep", "Performance tracking", "Job placement"],
      gradient: "bg-gradient-quaternary",
    },
  ]

  const startupServices = [
    {
      icon: <Building2 className="w-8 h-8" />,
      title: "Talent Pipeline",
      description:
        "Access a curated pool of pre-screened, motivated interns ready to contribute to your startup's success.",
      features: ["Pre-screened candidates", "Skill verification", "Background checks", "Performance history"],
      gradient: "bg-gradient-primary",
    },
    {
      icon: <Rocket className="w-8 h-8" />,
      title: "Rapid Scaling",
      description: "Quickly scale your team with flexible internship programs tailored to your startup's unique needs.",
      features: ["Flexible terms", "Project-based hiring", "Team integration", "Scalable solutions"],
      gradient: "bg-gradient-secondary",
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Growth Analytics",
      description: "Track intern performance and team productivity with detailed analytics and reporting tools.",
      features: ["Performance metrics", "Productivity tracking", "ROI analysis", "Custom reports"],
      gradient: "bg-gradient-tertiary",
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Risk Management",
      description: "Minimize hiring risks with our comprehensive vetting process and performance guarantees.",
      features: ["Quality guarantee", "Replacement policy", "Legal compliance", "Insurance coverage"],
      gradient: "bg-gradient-quaternary",
    },
  ]

  const pricingPlans = [
    {
      name: "Intern",
      price: "Free",
      description: "Perfect for students and early-career professionals",
      features: [
        "Access to all internship opportunities",
        "Basic profile and portfolio",
        "Community access",
        "Email support",
        "Mobile app access",
      ],
      gradient: "bg-gradient-primary",
      popular: false,
    },
    {
      name: "Intern Pro",
      price: "$29/month",
      description: "Advanced features for serious career builders",
      features: [
        "Everything in Free",
        "Priority application status",
        "Advanced analytics",
        "1-on-1 career coaching",
        "Premium networking events",
        "Skill development courses",
      ],
      gradient: "bg-gradient-secondary",
      popular: true,
    },
    {
      name: "Startup",
      price: "$199/month",
      description: "Essential tools for growing startups",
      features: [
        "Post unlimited opportunities",
        "Access to talent pipeline",
        "Basic analytics dashboard",
        "Email support",
        "Standard vetting process",
      ],
      gradient: "bg-gradient-tertiary",
      popular: false,
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "Comprehensive solutions for established companies",
      features: [
        "Everything in Startup",
        "Dedicated account manager",
        "Custom integrations",
        "Advanced analytics",
        "Priority support",
        "Custom vetting process",
      ],
      gradient: "bg-gradient-quaternary",
      popular: false,
    },
  ]

  const testimonials = [
    {
      name: "Alex Thompson",
      role: "Software Engineering Intern",
      company: "TechFlow",
      content:
        "INTERLINK didn't just find me an internship – it found me a career path. The mentorship and support I received were incredible.",
      rating: 5,
      avatar: "/placeholder.svg?height=60&width=60",
    },
    {
      name: "Maria Garcia",
      role: "Founder & CEO",
      company: "InnovateLab",
      content:
        "The quality of interns we've hired through INTERLINK has been exceptional. They've become integral parts of our team.",
      rating: 5,
      avatar: "/placeholder.svg?height=60&width=60",
    },
    {
      name: "James Wilson",
      role: "Product Design Intern",
      company: "DesignCorp",
      content:
        "The platform made it so easy to find opportunities that matched my skills and interests. I landed my dream internship in just two weeks.",
      rating: 5,
      avatar: "/placeholder.svg?height=60&width=60",
    },
  ]

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden pt-16">
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
                ⚡ Powering 1,200+ successful connections monthly
              </Badge>
            </motion.div>

            <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-bold leading-tight">
              <span className="bg-gradient-primary bg-clip-text text-transparent">Services That</span>
              <br />
              <span className="text-gray-800 dark:text-white">Transform Careers</span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed"
            >
              Comprehensive solutions designed to connect ambitious talent with innovative startups. Whether you're
              building your career or building your team, we have the tools you need to succeed.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                asChild
                size="lg"
                className="px-8 py-4 text-lg bg-gradient-primary hover:scale-105 transition-all duration-300 pulse-glow rounded-full group"
              >
                <Link href="#intern-services">
                  <GraduationCap className="mr-2 w-5 h-5" />
                  For Interns
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                className="px-8 py-4 text-lg bg-gradient-secondary hover:scale-105 transition-all duration-300 pulse-glow rounded-full group"
              >
                <Link href="#startup-services">
                  <Briefcase className="mr-2 w-5 h-5" />
                  For Startups
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Intern Services */}
      <section
        id="intern-services"
        className="py-24 px-4 sm:px-6 lg:px-8 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm"
      >
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
              For Ambitious Interns
            </motion.h2>
            <motion.p variants={itemVariants} className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Unlock your potential with our comprehensive suite of career development tools and opportunities.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {internServices.map((service, index) => (
              <motion.div
                key={service.title}
                variants={itemVariants}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group"
              >
                <Card className="h-full glass-effect border-white/20 hover:border-white/40 transition-all duration-300 overflow-hidden">
                  <CardHeader className="pb-4">
                    <div className="flex items-center space-x-4 mb-4">
                      <div
                        className={`w-12 h-12 rounded-xl ${service.gradient} flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300`}
                      >
                        {service.icon}
                      </div>
                      <CardTitle className="text-2xl font-bold text-gray-800 dark:text-white">
                        {service.title}
                      </CardTitle>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{service.description}</p>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {service.features.map((feature, i) => (
                        <li key={i} className="flex items-center space-x-3">
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                          <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Startup Services */}
      <section id="startup-services" className="py-24 px-4 sm:px-6 lg:px-8 gradient-bg">
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
              For Growing Startups
            </motion.h2>
            <motion.p variants={itemVariants} className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Scale your team efficiently with our comprehensive talent acquisition and management solutions.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {startupServices.map((service, index) => (
              <motion.div
                key={service.title}
                variants={itemVariants}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group"
              >
                <Card className="h-full glass-effect border-white/30 hover:border-white/50 transition-all duration-300 overflow-hidden">
                  <CardHeader className="pb-4">
                    <div className="flex items-center space-x-4 mb-4">
                      <div
                        className={`w-12 h-12 rounded-xl ${service.gradient} flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300`}
                      >
                        {service.icon}
                      </div>
                      <CardTitle className="text-2xl font-bold text-gray-800 dark:text-white">
                        {service.title}
                      </CardTitle>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{service.description}</p>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {service.features.map((feature, i) => (
                        <li key={i} className="flex items-center space-x-3">
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                          <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
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
              Simple, Transparent Pricing
            </motion.h2>
            <motion.p variants={itemVariants} className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Choose the plan that fits your needs. Upgrade or downgrade at any time.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={plan.name}
                variants={itemVariants}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group relative"
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-secondary text-white border-0 px-4 py-1">Most Popular</Badge>
                  </div>
                )}
                <Card
                  className={`h-full glass-effect border-white/20 hover:border-white/40 transition-all duration-300 overflow-hidden ${plan.popular ? "ring-2 ring-purple-500/20" : ""}`}
                >
                  <CardHeader className="text-center pb-4">
                    <div
                      className={`w-16 h-16 mx-auto rounded-2xl ${plan.gradient} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Zap className="w-8 h-8" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-gray-800 dark:text-white">{plan.name}</CardTitle>
                    <div className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                      {plan.price}
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">{plan.description}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="space-y-3">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-center space-x-3">
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                          <span className="text-gray-700 dark:text-gray-300 text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      className={`w-full ${plan.popular ? "bg-gradient-secondary" : "bg-gradient-primary"} hover:scale-105 transition-all duration-300`}
                    >
                      Get Started
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
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
              What Our Users Say
            </motion.h2>
            <motion.p variants={itemVariants} className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Real stories from real people who've transformed their careers and businesses with INTERLINK.
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
                      <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold mr-4">
                        {testimonial.name.charAt(0)}
                      </div>
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
              Ready to Get Started?
            </motion.h2>
            <motion.p variants={itemVariants} className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Join thousands of professionals and companies who are already transforming their futures with INTERLINK.
            </motion.p>
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                asChild
                size="lg"
                className="px-8 py-4 text-lg bg-gradient-primary hover:scale-105 transition-all duration-300 pulse-glow rounded-full group"
              >
                <Link href="/signup">
                  Start Free Trial
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="px-8 py-4 text-lg glass-effect border-white/30 hover:bg-white/20 transition-all duration-300 rounded-full bg-transparent"
              >
                <Link href="/contact">Schedule Demo</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

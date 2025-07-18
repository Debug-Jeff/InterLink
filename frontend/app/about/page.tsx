"use client"

import { motion } from "framer-motion"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Target, Eye, Heart, Users, TrendingUp, Award, Globe, Lightbulb, Shield, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
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

  const stats = [
    { number: "10,000+", label: "Successful Placements", icon: <Users className="w-6 h-6" /> },
    { number: "500+", label: "Partner Startups", icon: <TrendingUp className="w-6 h-6" /> },
    { number: "95%", label: "Success Rate", icon: <Award className="w-6 h-6" /> },
    { number: "50+", label: "Countries Served", icon: <Globe className="w-6 h-6" /> },
  ]

  const values = [
    {
      icon: <Lightbulb className="w-8 h-8" />,
      title: "Innovation First",
      description:
        "We constantly push boundaries to create better solutions for talent acquisition and career development.",
      gradient: "bg-gradient-primary",
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Trust & Transparency",
      description: "Building lasting relationships through honest communication and reliable service delivery.",
      gradient: "bg-gradient-secondary",
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "People-Centered",
      description: "Every decision we make prioritizes the success and well-being of our community members.",
      gradient: "bg-gradient-tertiary",
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Excellence Driven",
      description: "We set high standards and continuously strive to exceed expectations in everything we do.",
      gradient: "bg-gradient-quaternary",
    },
  ]

  const timeline = [
    {
      year: "2020",
      title: "The Beginning",
      description: "Founded with a vision to bridge the gap between talented interns and innovative startups.",
      milestone: "Company Founded",
    },
    {
      year: "2021",
      title: "First 1,000 Connections",
      description: "Reached our first major milestone of successfully connecting 1,000 interns with startups.",
      milestone: "1K Placements",
    },
    {
      year: "2022",
      title: "Global Expansion",
      description: "Expanded operations to serve startups and interns across 25 countries worldwide.",
      milestone: "Global Reach",
    },
    {
      year: "2023",
      title: "AI Integration",
      description: "Launched our AI-powered matching system, improving placement success rates by 40%.",
      milestone: "AI Launch",
    },
    {
      year: "2024",
      title: "10,000+ Success Stories",
      description: "Celebrated over 10,000 successful internship placements and countless career transformations.",
      milestone: "10K Milestone",
    },
  ]

  const team = [
    {
      name: "Sarah Chen",
      role: "CEO & Co-Founder",
      bio: "Former startup founder with 10+ years in talent acquisition. Passionate about connecting great people with great opportunities.",
      image: "/placeholder.svg?height=300&width=300",
      gradient: "bg-gradient-primary",
    },
    {
      name: "Marcus Rodriguez",
      role: "CTO & Co-Founder",
      bio: "Tech visionary with expertise in AI and machine learning. Leading our platform's technical innovation.",
      image: "/placeholder.svg?height=300&width=300",
      gradient: "bg-gradient-secondary",
    },
    {
      name: "Emily Watson",
      role: "Head of Operations",
      bio: "Operations expert ensuring seamless experiences for both interns and startups on our platform.",
      image: "/placeholder.svg?height=300&width=300",
      gradient: "bg-gradient-tertiary",
    },
    {
      name: "David Kim",
      role: "Head of Growth",
      bio: "Growth strategist focused on expanding our reach and impact in the global startup ecosystem.",
      image: "/placeholder.svg?height=300&width=300",
      gradient: "bg-gradient-quaternary",
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
          {Array.from({ length: 20 }).map((_, i) => (
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
                duration: 5 + Math.random() * 3,
                repeat: Number.POSITIVE_INFINITY,
                delay: Math.random() * 3,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
            <motion.div variants={itemVariants}>
              <Badge className="mb-4 bg-white/20 text-gray-800 dark:text-white border-white/30 hover:bg-white/30 transition-all duration-300">
                🚀 Transforming careers since 2020
              </Badge>
            </motion.div>

            <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-bold leading-tight">
              <span className="bg-gradient-primary bg-clip-text text-transparent">About</span>
              <br />
              <span className="text-gray-800 dark:text-white">INTERLINK</span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed"
            >
              We're on a mission to revolutionize how talented individuals connect with innovative startups, creating
              opportunities that transform careers and accelerate business growth.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                asChild
                size="lg"
                className="px-8 py-4 text-lg bg-gradient-primary hover:scale-105 transition-all duration-300 pulse-glow rounded-full group"
              >
                <Link href="#mission">
                  Our Mission
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="px-8 py-4 text-lg glass-effect border-white/30 hover:bg-white/20 transition-all duration-300 rounded-full bg-transparent"
              >
                <Link href="#team">Meet the Team</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                variants={itemVariants}
                whileHover={{ y: -5, scale: 1.02 }}
                className="group"
              >
                <Card className="text-center glass-effect border-white/20 hover:border-white/40 transition-all duration-300">
                  <CardContent className="p-8">
                    <div className="w-12 h-12 mx-auto mb-4 bg-gradient-primary rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
                      {stat.icon}
                    </div>
                    <div className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
                      {stat.number}
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 font-medium">{stat.label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section id="mission" className="py-24 px-4 sm:px-6 lg:px-8 gradient-bg">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={containerVariants}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          >
            <motion.div variants={itemVariants} className="space-y-8">
              <div>
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center text-white mr-4">
                    <Target className="w-6 h-6" />
                  </div>
                  <h2 className="text-4xl font-bold text-gray-800 dark:text-white">Our Mission</h2>
                </div>
                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                  To democratize access to meaningful career opportunities by connecting ambitious talent with
                  innovative startups, fostering an ecosystem where both individuals and businesses can thrive and grow
                  together.
                </p>
              </div>

              <div>
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-secondary rounded-xl flex items-center justify-center text-white mr-4">
                    <Eye className="w-6 h-6" />
                  </div>
                  <h2 className="text-4xl font-bold text-gray-800 dark:text-white">Our Vision</h2>
                </div>
                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                  To become the world's leading platform for startup talent acquisition, where every ambitious
                  professional finds their perfect opportunity and every innovative company discovers their ideal team
                  members.
                </p>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="relative">
              <div className="aspect-square rounded-3xl bg-gradient-primary p-1">
                <div className="w-full h-full rounded-3xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                  <div className="text-center space-y-6">
                    <div className="w-24 h-24 mx-auto bg-white/20 rounded-2xl flex items-center justify-center">
                      <Heart className="w-12 h-12 text-white" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold text-white">Passion Driven</h3>
                      <p className="text-white/80 px-6">
                        Every connection we make is fueled by our passion for helping people achieve their dreams.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Values */}
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
              Our Core Values
            </motion.h2>
            <motion.p variants={itemVariants} className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              The principles that guide everything we do and shape our company culture.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                variants={itemVariants}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group"
              >
                <Card className="h-full glass-effect border-white/20 hover:border-white/40 transition-all duration-300 overflow-hidden">
                  <CardHeader className="pb-4">
                    <div className="flex items-center space-x-4 mb-4">
                      <div
                        className={`w-12 h-12 rounded-xl ${value.gradient} flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300`}
                      >
                        {value.icon}
                      </div>
                      <CardTitle className="text-2xl font-bold text-gray-800 dark:text-white">{value.title}</CardTitle>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{value.description}</p>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Timeline */}
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
              Our Journey
            </motion.h2>
            <motion.p variants={itemVariants} className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              From a simple idea to a global platform transforming careers worldwide.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={containerVariants}
            className="relative"
          >
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-primary rounded-full hidden lg:block" />

            <div className="space-y-12">
              {timeline.map((item, index) => (
                <motion.div
                  key={item.year}
                  variants={itemVariants}
                  className={`flex items-center ${index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"} flex-col lg:space-x-8`}
                >
                  <div className={`w-full lg:w-1/2 ${index % 2 === 0 ? "lg:text-right" : "lg:text-left"} mb-8 lg:mb-0`}>
                    <Card className="glass-effect border-white/30 hover:border-white/50 transition-all duration-300">
                      <CardContent className="p-6">
                        <Badge className="mb-3 bg-gradient-primary text-white border-0">{item.milestone}</Badge>
                        <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">{item.title}</h3>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{item.description}</p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Timeline Node */}
                  <div className="relative z-10 w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {item.year}
                  </div>

                  <div className="w-full lg:w-1/2" />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Team */}
      <section id="team" className="py-24 px-4 sm:px-6 lg:px-8 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
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
              Meet Our Team
            </motion.h2>
            <motion.p variants={itemVariants} className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              The passionate individuals behind INTERLINK's success, dedicated to transforming careers worldwide.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                variants={itemVariants}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group"
              >
                <Card className="h-full glass-effect border-white/20 hover:border-white/40 transition-all duration-300 overflow-hidden">
                  <CardContent className="p-6 text-center">
                    <div className="relative mb-6">
                      <div className={`w-24 h-24 mx-auto rounded-2xl ${member.gradient} p-1`}>
                        <div className="w-full h-full rounded-2xl bg-white/20 flex items-center justify-center text-white font-bold text-2xl">
                          {member.name.charAt(0)}
                        </div>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-1">{member.name}</h3>
                    <p className="text-sm font-medium bg-gradient-primary bg-clip-text text-transparent mb-4">
                      {member.role}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{member.bio}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 gradient-bg">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            variants={containerVariants}
            className="space-y-8"
          >
            <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white">
              Ready to Join Our Mission?
            </motion.h2>
            <motion.p variants={itemVariants} className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Whether you're looking to advance your career or grow your startup, we're here to help you succeed.
            </motion.p>
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                asChild
                size="lg"
                className="px-8 py-4 text-lg bg-gradient-primary hover:scale-105 transition-all duration-300 pulse-glow rounded-full group"
              >
                <Link href="/contact">
                  Get in Touch
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="px-8 py-4 text-lg glass-effect border-white/30 hover:bg-white/20 transition-all duration-300 rounded-full bg-transparent"
              >
                <Link href="/services">Explore Services</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

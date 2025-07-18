"use client"

import type React from "react"

import { motion } from "framer-motion"
import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  HelpCircle,
  ArrowRight,
  Shield,
  Zap,
  Globe,
} from "lucide-react"
import Link from "next/link"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    subject: "",
    message: "",
    type: "",
  })

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

  const contactMethods = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email Us",
      description: "Get in touch via email",
      contact: "hello@interlink.com",
      action: "Send Email",
      gradient: "bg-gradient-primary",
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Call Us",
      description: "Speak with our team",
      contact: "+1 (555) 123-4567",
      action: "Call Now",
      gradient: "bg-gradient-secondary",
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: "Live Chat",
      description: "Chat with support",
      contact: "Available 24/7",
      action: "Start Chat",
      gradient: "bg-gradient-tertiary",
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Visit Us",
      description: "Our headquarters",
      contact: "San Francisco, CA",
      action: "Get Directions",
      gradient: "bg-gradient-quaternary",
    },
  ]

  const officeHours = [
    { day: "Monday - Friday", hours: "9:00 AM - 6:00 PM PST" },
    { day: "Saturday", hours: "10:00 AM - 4:00 PM PST" },
    { day: "Sunday", hours: "Closed" },
  ]

  const quickStats = [
    { number: "< 2 hours", label: "Average Response Time" },
    { number: "98%", label: "Customer Satisfaction" },
    { number: "24/7", label: "Support Available" },
  ]

  const faqs = [
    {
      question: "How does INTERLINK match interns with startups?",
      answer:
        "Our AI-powered matching system analyzes skills, interests, company culture, and growth potential to create perfect matches between interns and startups.",
    },
    {
      question: "What is the success rate of placements?",
      answer:
        "We maintain a 95% success rate for internship placements, with 87% of interns receiving full-time offers from their host companies.",
    },
    {
      question: "How much does it cost to use INTERLINK?",
      answer:
        "We offer free access for interns and flexible pricing plans for startups starting at $199/month. Enterprise solutions are available with custom pricing.",
    },
    {
      question: "What support do you provide during internships?",
      answer:
        "We provide ongoing support including mentorship programs, performance tracking, regular check-ins, and career development resources throughout the internship.",
    },
    {
      question: "Can international students use INTERLINK?",
      answer:
        "Yes! We work with startups globally and help with visa sponsorship and international placement processes for qualified candidates.",
    },
    {
      question: "How do you ensure quality of startups on the platform?",
      answer:
        "All startups undergo a rigorous vetting process including background checks, financial verification, and culture assessments before joining our platform.",
    },
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSelectChange = (value: string) => {
    setFormData({
      ...formData,
      type: value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          phone: formData.company // Using company field as phone for now
        }),
      })

      if (response.ok) {
        const result = await response.json()
        console.log('Form submitted successfully:', result)
        
        // Clear form on success
        setFormData({
          name: "",
          email: "",
          company: "",
          subject: "",
          message: "",
          type: "",
        })
        
        // TODO: Add success notification/toast
        alert('Thank you for your inquiry! We will get back to you soon.')
      } else {
        const error = await response.json()
        console.error('Form submission failed:', error)
        alert('Failed to submit inquiry. Please try again.')
      }
    } catch (error) {
      console.error('Network error:', error)
      alert('Network error. Please check your connection and try again.')
    }
  }

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden pt-16">
        <div className="absolute inset-0 gradient-bg" />

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 bg-white/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -50, 0],
                opacity: [0.2, 0.8, 0.2],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 6 + Math.random() * 2,
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
                💬 We're here to help 24/7
              </Badge>
            </motion.div>

            <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-bold leading-tight">
              <span className="bg-gradient-primary bg-clip-text text-transparent">Get in</span>
              <br />
              <span className="text-gray-800 dark:text-white">Touch</span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed"
            >
              Have questions about our services? Ready to start your journey? Our team is here to help you every step of
              the way.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                asChild
                size="lg"
                className="px-8 py-4 text-lg bg-gradient-primary hover:scale-105 transition-all duration-300 pulse-glow rounded-full group"
              >
                <Link href="#contact-form">
                  <Send className="mr-2 w-5 h-5" />
                  Send Message
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="px-8 py-4 text-lg glass-effect border-white/30 hover:bg-white/20 transition-all duration-300 rounded-full bg-transparent"
              >
                <Link href="#faq">View FAQ</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {quickStats.map((stat, index) => (
              <motion.div key={stat.label} variants={itemVariants} className="text-center">
                <div className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <p className="text-gray-600 dark:text-gray-400 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Contact Methods */}
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
              Multiple Ways to Connect
            </motion.h2>
            <motion.p variants={itemVariants} className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Choose the method that works best for you. We're available across all channels.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {contactMethods.map((method, index) => (
              <motion.div
                key={method.title}
                variants={itemVariants}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group"
              >
                <Card className="h-full glass-effect border-white/30 hover:border-white/50 transition-all duration-300 text-center">
                  <CardContent className="p-6">
                    <div
                      className={`w-12 h-12 mx-auto mb-4 ${method.gradient} rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300`}
                    >
                      {method.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">{method.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-3">{method.description}</p>
                    <p className="font-semibold text-gray-800 dark:text-white mb-4">{method.contact}</p>
                    <Button className={`w-full ${method.gradient} hover:scale-105 transition-all duration-300`}>
                      {method.action}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Contact Form */}
      <section
        id="contact-form"
        className="py-24 px-4 sm:px-6 lg:px-8 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm"
      >
        <div className="max-w-4xl mx-auto">
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
              Send Us a Message
            </motion.h2>
            <motion.p variants={itemVariants} className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Fill out the form below and we'll get back to you within 2 hours during business hours.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={containerVariants}
          >
            <Card className="glass-effect border-white/20 hover:border-white/40 transition-all duration-300">
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <motion.div variants={itemVariants}>
                      <Label htmlFor="name" className="text-gray-700 dark:text-gray-300 font-medium">
                        Full Name *
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="mt-2 glass-effect border-white/30 focus:border-white/50"
                        placeholder="Enter your full name"
                      />
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <Label htmlFor="email" className="text-gray-700 dark:text-gray-300 font-medium">
                        Email Address *
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="mt-2 glass-effect border-white/30 focus:border-white/50"
                        placeholder="Enter your email address"
                      />
                    </motion.div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <motion.div variants={itemVariants}>
                      <Label htmlFor="company" className="text-gray-700 dark:text-gray-300 font-medium">
                        Company/Organization
                      </Label>
                      <Input
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        className="mt-2 glass-effect border-white/30 focus:border-white/50"
                        placeholder="Enter your company name"
                      />
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <Label htmlFor="type" className="text-gray-700 dark:text-gray-300 font-medium">
                        Inquiry Type *
                      </Label>
                      <Select onValueChange={handleSelectChange} required>
                        <SelectTrigger className="mt-2 glass-effect border-white/30 focus:border-white/50">
                          <SelectValue placeholder="Select inquiry type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="intern">I'm an Intern</SelectItem>
                          <SelectItem value="startup">I'm a Startup</SelectItem>
                          <SelectItem value="partnership">Partnership Inquiry</SelectItem>
                          <SelectItem value="support">Technical Support</SelectItem>
                          <SelectItem value="media">Media/Press</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </motion.div>
                  </div>

                  <motion.div variants={itemVariants}>
                    <Label htmlFor="subject" className="text-gray-700 dark:text-gray-300 font-medium">
                      Subject *
                    </Label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="mt-2 glass-effect border-white/30 focus:border-white/50"
                      placeholder="Brief subject of your message"
                    />
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <Label htmlFor="message" className="text-gray-700 dark:text-gray-300 font-medium">
                      Message *
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className="mt-2 glass-effect border-white/30 focus:border-white/50 resize-none"
                      placeholder="Tell us more about your inquiry..."
                    />
                  </motion.div>

                  <motion.div variants={itemVariants} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                      <Shield className="w-4 h-4" />
                      <span>Your information is secure and encrypted</span>
                    </div>
                    <Button
                      type="submit"
                      size="lg"
                      className="px-8 py-3 bg-gradient-primary hover:scale-105 transition-all duration-300 pulse-glow rounded-full group"
                    >
                      <Send className="mr-2 w-5 h-5" />
                      Send Message
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </motion.div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Office Hours & Info */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 gradient-bg">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={containerVariants}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12"
          >
            <motion.div variants={itemVariants}>
              <Card className="glass-effect border-white/30 hover:border-white/50 transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center text-white">
                      <Clock className="w-5 h-5" />
                    </div>
                    <CardTitle className="text-2xl text-gray-800 dark:text-white">Office Hours</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {officeHours.map((schedule, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center py-2 border-b border-white/10 last:border-b-0"
                    >
                      <span className="text-gray-700 dark:text-gray-300 font-medium">{schedule.day}</span>
                      <span className="text-gray-600 dark:text-gray-400">{schedule.hours}</span>
                    </div>
                  ))}
                  <div className="mt-6 p-4 bg-gradient-primary/10 rounded-lg">
                    <div className="flex items-center space-x-2 text-sm">
                      <Zap className="w-4 h-4 text-blue-600" />
                      <span className="text-gray-700 dark:text-gray-300">
                        Emergency support available 24/7 for critical issues
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="glass-effect border-white/30 hover:border-white/50 transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-secondary rounded-lg flex items-center justify-center text-white">
                      <Globe className="w-5 h-5" />
                    </div>
                    <CardTitle className="text-2xl text-gray-800 dark:text-white">Global Presence</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Headquarters</h4>
                      <p className="text-gray-600 dark:text-gray-400">
                        123 Innovation Drive
                        <br />
                        San Francisco, CA 94105
                        <br />
                        United States
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 dark:text-white mb-2">European Office</h4>
                      <p className="text-gray-600 dark:text-gray-400">
                        45 Tech Square
                        <br />
                        London, UK EC2A 4DN
                        <br />
                        United Kingdom
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Asia Pacific</h4>
                      <p className="text-gray-600 dark:text-gray-400">
                        88 Marina Bay
                        <br />
                        Singapore 018956
                        <br />
                        Singapore
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 px-4 sm:px-6 lg:px-8 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto">
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
              Frequently Asked Questions
            </motion.h2>
            <motion.p variants={itemVariants} className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Find answers to common questions about our platform and services.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={containerVariants}
          >
            <Card className="glass-effect border-white/20 hover:border-white/40 transition-all duration-300">
              <CardContent className="p-8">
                <Accordion type="single" collapsible className="space-y-4">
                  {faqs.map((faq, index) => (
                    <motion.div key={index} variants={itemVariants}>
                      <AccordionItem value={`item-${index}`} className="border-white/20">
                        <AccordionTrigger className="text-left text-gray-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                          <div className="flex items-center space-x-3">
                            <HelpCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                            <span>{faq.question}</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-600 dark:text-gray-400 leading-relaxed pl-8">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    </motion.div>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
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
              Still Have Questions?
            </motion.h2>
            <motion.p variants={itemVariants} className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Our team is standing by to help you succeed. Don't hesitate to reach out.
            </motion.p>
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                asChild
                size="lg"
                className="px-8 py-4 text-lg bg-gradient-primary hover:scale-105 transition-all duration-300 pulse-glow rounded-full group"
              >
                <Link href="#contact-form">
                  <MessageSquare className="mr-2 w-5 h-5" />
                  Start Conversation
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

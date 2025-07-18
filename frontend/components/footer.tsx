"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AnimatedLogo } from "@/components/animated-logo"
import { motion } from "framer-motion"
import { Facebook, Twitter, Linkedin, Instagram, Mail, Phone, MapPin, ArrowRight, Heart } from "lucide-react"

export function Footer() {
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

  const socialLinks = [
    { icon: <Facebook className="w-5 h-5" />, href: "#", label: "Facebook" },
    { icon: <Twitter className="w-5 h-5" />, href: "#", label: "Twitter" },
    { icon: <Linkedin className="w-5 h-5" />, href: "#", label: "LinkedIn" },
    { icon: <Instagram className="w-5 h-5" />, href: "#", label: "Instagram" },
  ]

  const quickLinks = [
    { href: "/home", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/services", label: "Services" },
    { href: "/contact", label: "Contact" },
  ]

  const resources = [
    { href: "#", label: "Help Center" },
    { href: "#", label: "Privacy Policy" },
    { href: "#", label: "Terms of Service" },
    { href: "#", label: "Cookie Policy" },
  ]

  const solutions = [
    { href: "#", label: "For Interns" },
    { href: "#", label: "For Startups" },
    { href: "#", label: "Enterprise" },
    { href: "#", label: "API Access" },
  ]

  return (
    <footer className="relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 gradient-bg opacity-90" />

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 10 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8"
          >
            {/* Brand Section */}
            <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6">
              <Link href="/" className="flex items-center space-x-3 group">
                <div className="w-10 h-10 group-hover:scale-110 transition-transform duration-300">
                  <AnimatedLogo />
                </div>
                <span className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">INTERLINK</span>
              </Link>

              <p className="text-gray-600 dark:text-gray-400 leading-relaxed max-w-md">
                Connecting ambitious talent with innovative startups. We're building the future of professional
                networking, one connection at a time.
              </p>

              {/* Newsletter Signup */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-800 dark:text-white">Stay Updated</h4>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    className="glass-effect border-white/30 bg-white/20 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                  />
                  <Button className="bg-gradient-primary hover:scale-105 transition-all duration-300 group">
                    Subscribe
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex space-x-4">
                {socialLinks.map((social) => (
                  <Link
                    key={social.label}
                    href={social.href}
                    className="p-2 glass-effect rounded-full hover:bg-white/20 transition-all duration-300 group"
                    aria-label={social.label}
                  >
                    <div className="text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-white transition-colors">
                      {social.icon}
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div variants={itemVariants} className="space-y-6">
              <h4 className="text-lg font-semibold text-gray-800 dark:text-white">Quick Links</h4>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors duration-300 group flex items-center"
                    >
                      <span className="group-hover:translate-x-1 transition-transform duration-300">{link.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Solutions */}
            <motion.div variants={itemVariants} className="space-y-6">
              <h4 className="text-lg font-semibold text-gray-800 dark:text-white">Solutions</h4>
              <ul className="space-y-3">
                {solutions.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors duration-300 group flex items-center"
                    >
                      <span className="group-hover:translate-x-1 transition-transform duration-300">{link.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Resources & Contact */}
            <motion.div variants={itemVariants} className="space-y-6">
              <h4 className="text-lg font-semibold text-gray-800 dark:text-white">Resources</h4>
              <ul className="space-y-3">
                {resources.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors duration-300 group flex items-center"
                    >
                      <span className="group-hover:translate-x-1 transition-transform duration-300">{link.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Contact Info */}
              <div className="space-y-3 pt-4 border-t border-white/20">
                <h5 className="font-semibold text-gray-800 dark:text-white">Contact</h5>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                    <Mail className="w-4 h-4" />
                    <span>hello@interlink.com</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                    <Phone className="w-4 h-4" />
                    <span>+1 (555) 123-4567</span>
                  </div>
                  <div className="flex items-start space-x-2 text-gray-600 dark:text-gray-400">
                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>123 Innovation St, Tech City, CA 90210</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.8 }}
          className="border-t border-white/20 glass-effect"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                <span>© 2024 INTERLINK. Made with</span>
                <Heart className="w-4 h-4 text-red-500 fill-current animate-pulse" />
                <span>for the future of work.</span>
              </div>

              <div className="flex items-center space-x-6 text-sm">
                <Link
                  href="#"
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors duration-300"
                >
                  Privacy
                </Link>
                <Link
                  href="#"
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors duration-300"
                >
                  Terms
                </Link>
                <Link
                  href="#"
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors duration-300"
                >
                  Cookies
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}

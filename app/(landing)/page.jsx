'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { useTheme } from '@/context/ThemeContext'
import { 
  BookOpen, Brain, Mic, FileText, HelpCircle, Sparkles, 
  ArrowRight, CheckCircle, Star, Play, Users, Zap, Shield,
  Clock, BarChart3, MessageSquare, ChevronRight, Menu, X, Sun, Moon
} from 'lucide-react'

export default function LandingPage() {
  const { user, loading } = useAuth()
  const { darkMode, toggleTheme } = useTheme()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const features = [
    {
      icon: Brain,
      title: 'Socratic Learning',
      description: 'Learn through guided questioning that helps you truly understand concepts, not just memorize them.',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: Mic,
      title: 'Voice Notes',
      description: 'Record your thoughts and lectures. AI automatically formats them into structured study notes.',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: FileText,
      title: 'Smart Summarization',
      description: 'Upload any study material and get intelligent summaries highlighting key concepts.',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: HelpCircle,
      title: 'Quiz Generator',
      description: 'Auto-generate quizzes from your notes to test understanding and retention.',
      color: 'from-orange-500 to-orange-600'
    },
    {
      icon: MessageSquare,
      title: 'AI Chat Assistant',
      description: 'Ask questions anytime. Get clear explanations with examples tailored to your level.',
      color: 'from-pink-500 to-pink-600'
    },
    {
      icon: BarChart3,
      title: 'Progress Tracking',
      description: 'Monitor your learning journey with detailed analytics and insights.',
      color: 'from-teal-500 to-teal-600'
    }
  ]

  const benefits = [
    {
      icon: Zap,
      title: 'Learn 3x Faster',
      description: 'AI-powered tools accelerate your understanding and retention of complex topics.'
    },
    {
      icon: Clock,
      title: 'Save Hours Daily',
      description: 'Automate note-taking, summarization, and quiz creation to focus on actual learning.'
    },
    {
      icon: Shield,
      title: 'Deeper Understanding',
      description: 'Socratic method ensures you truly grasp concepts, not just surface-level memorization.'
    },
    {
      icon: Users,
      title: 'Study Your Way',
      description: 'Multiple tools and modes adapt to your unique learning style and preferences.'
    }
  ]

  const testimonials = [
    {
      name: 'Priya Sharma',
      role: 'Medical Student, AIIMS',
      image: null,
      content: 'StudySync AI has completely changed how I prepare for exams. The Socratic mode helped me understand complex anatomy concepts that I previously just memorized.',
      rating: 5
    },
    {
      name: 'Rahul Verma',
      role: 'Engineering Student, IIT Delhi',
      image: null,
      content: 'The voice notes feature is a game-changer. I record lectures and get perfectly formatted notes. Saved me hours of manual work every week.',
      rating: 5
    },
    {
      name: 'Ananya Patel',
      role: 'Law Student, NLU',
      image: null,
      content: 'Quiz generation from my case study notes is brilliant. It tests exactly what I need to know. My grades have improved significantly.',
      rating: 5
    },
    {
      name: 'Vikram Singh',
      role: 'MBA Student, IIM Bangalore',
      image: null,
      content: 'The AI assistant explains business concepts with real-world examples. Its like having a personal tutor available 24/7.',
      rating: 5
    }
  ]

  const stats = [
    { value: '50,000+', label: 'Active Students' },
    { value: '2M+', label: 'Notes Created' },
    { value: '500K+', label: 'Quizzes Generated' },
    { value: '98%', label: 'Satisfaction Rate' }
  ]

  return (
    <div className="min-h-screen bg-cream dark:bg-dark-bg">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 dark:bg-dark-card/95 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-soft-orange dark:bg-dark-surface rounded-xl sm:rounded-2xl flex items-center justify-center border border-peach dark:border-dark-border">
                <BookOpen className="text-brand-orange" size={16} />
              </div>
              <span className="text-lg sm:text-xl font-playfair font-semibold text-gray-800 dark:text-dark-text">StudySync AI</span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-600 dark:text-dark-text-muted hover:text-gray-900 dark:hover:text-dark-text font-medium transition-colors">Features</a>
              <a href="#benefits" className="text-gray-600 dark:text-dark-text-muted hover:text-gray-900 dark:hover:text-dark-text font-medium transition-colors">Benefits</a>
              <a href="#testimonials" className="text-gray-600 dark:text-dark-text-muted hover:text-gray-900 dark:hover:text-dark-text font-medium transition-colors">Testimonials</a>
            </div>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center gap-4">
              {/* Theme Toggle */}
              <button
                onClick={() => toggleTheme()}
                className="p-2 rounded-xl bg-soft-orange dark:bg-dark-surface border border-peach dark:border-dark-border text-gray-600 dark:text-dark-text hover:bg-light-orange dark:hover:bg-dark-border transition-colors"
              >
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              
              {!loading && (
                user ? (
                  <Link 
                    href="/dashboard" 
                    className="px-6 py-2.5 bg-gradient-to-r from-deep-orange to-dark-orange text-white font-semibold rounded-button hover:shadow-lg transition-all"
                  >
                    Go to Dashboard
                  </Link>
                ) : (
                  <>
                    <Link href="/login" className="text-gray-700 dark:text-dark-text-muted font-medium hover:text-gray-900 dark:hover:text-dark-text transition-colors">
                      Sign In
                    </Link>
                    <Link 
                      href="/register" 
                      className="px-6 py-2.5 bg-gradient-to-r from-deep-orange to-dark-orange text-white font-semibold rounded-button hover:shadow-lg transition-all"
                    >
                      Get Started Free
                    </Link>
                  </>
                )
              )}
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white dark:bg-dark-card border-t dark:border-dark-border">
            <div className="px-6 py-4 space-y-4">
              <a href="#features" className="block text-gray-600 dark:text-dark-text-muted font-medium">Features</a>
              <a href="#benefits" className="block text-gray-600 dark:text-dark-text-muted font-medium">Benefits</a>
              <a href="#testimonials" className="block text-gray-600 dark:text-dark-text-muted font-medium">Testimonials</a>
              
              {/* Theme Toggle for Mobile */}
              <button
                onClick={() => toggleTheme()}
                className="flex items-center gap-2 text-gray-600 dark:text-dark-text-muted font-medium"
              >
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                {darkMode ? 'Light Mode' : 'Dark Mode'}
              </button>
              
              <hr className="my-4 dark:border-dark-border" />
              {!loading && !user && (
                <>
                  <Link href="/login" className="block text-gray-700 dark:text-dark-text-muted font-medium">Sign In</Link>
                  <Link href="/register" className="block w-full text-center px-6 py-3 bg-gradient-to-r from-deep-orange to-dark-orange text-white font-semibold rounded-button">
                    Get Started Free
                  </Link>
                </>
              )}
              {user && (
                <Link href="/dashboard" className="block w-full text-center px-6 py-3 bg-gradient-to-r from-deep-orange to-dark-orange text-white font-semibold rounded-button">
                  Go to Dashboard
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-24 sm:pt-32 pb-12 sm:pb-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-soft-orange dark:bg-dark-surface rounded-full mb-4 sm:mb-6">
                <Sparkles className="text-deep-orange" size={14} />
                <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-dark-text-muted">AI-Powered Learning Platform</span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-playfair font-semibold text-gray-800 dark:text-dark-text leading-tight mb-4 sm:mb-6">
                The AI That <span className="text-brand-orange">Teaches</span>, 
                Not Just Tells
              </h1>
              
              <p className="text-base sm:text-lg text-gray-600 dark:text-dark-text-muted leading-relaxed mb-6 sm:mb-8 max-w-lg mx-auto lg:mx-0">
                Transform how you study with AI-powered tools that guide you to truly understand 
                concepts through Socratic questioning, voice notes, and intelligent summarization.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8 sm:mb-12 justify-center lg:justify-start">
                <Link 
                  href="/register" 
                  className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-brand-orange to-deep-orange text-white font-medium rounded-xl sm:rounded-2xl hover:shadow-lg hover:scale-105 transition-all text-sm sm:text-base"
                >
                  Start Learning Free
                  <ArrowRight size={16} />
                </Link>
                <a 
                  href="#features" 
                  className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-white dark:bg-dark-surface border border-border-dark dark:border-dark-border text-gray-700 dark:text-dark-text font-medium rounded-xl sm:rounded-2xl hover:border-brand-orange hover:text-brand-orange transition-all text-sm sm:text-base"
                >
                  <Play size={16} />
                  See How It Works
                </a>
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center gap-4 sm:gap-6 justify-center lg:justify-start">
                <div className="flex -space-x-2 sm:-space-x-3">
                  {[1,2,3,4,5].map(i => (
                    <div key={i} className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full border-2 border-white flex items-center justify-center">
                      <Users size={12} className="text-gray-500" />
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-0.5 sm:gap-1">
                    {[1,2,3,4,5].map(i => (
                      <Star key={i} size={14} className="text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-dark-text-muted">Loved by 50,000+ students</p>
                </div>
              </div>
            </div>

            {/* Right - Hero Image/Visual */}
            <div className="relative hidden md:block">
              <div className="bg-white dark:bg-dark-card rounded-3xl shadow-lg p-6 border border-border-dark dark:border-dark-border">
                {/* Mock App Interface */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-11 h-11 bg-soft-orange dark:bg-dark-surface rounded-2xl flex items-center justify-center border border-peach dark:border-dark-border">
                    <Brain className="text-brand-orange" size={20} />
                  </div>
                  <div>
                    <h3 className="font-playfair font-semibold text-gray-800 dark:text-dark-text">Socratic Mode</h3>
                    <p className="text-sm text-gray-500 dark:text-dark-text-muted">Learning through discovery</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-light-orange dark:bg-dark-surface rounded-2xl p-4 border border-border-light dark:border-dark-border">
                    <p className="text-sm text-gray-700 dark:text-dark-text">You: What is photosynthesis?</p>
                  </div>
                  <div className="bg-cream dark:bg-dark-surface/50 rounded-2xl p-4 border border-border-light dark:border-dark-border">
                    <p className="text-sm text-gray-700 dark:text-dark-text">
                      <span className="text-brand-orange font-medium">AI:</span> Great question! Let me guide you to discover this yourself. 
                      What do you think plants need to survive? And where do you think they get their energy from?
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1 h-10 bg-light-orange dark:bg-dark-surface rounded-xl"></div>
                    <div className="w-10 h-10 bg-brand-orange rounded-xl flex items-center justify-center">
                      <ArrowRight className="text-white" size={16} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 bg-white dark:bg-dark-card rounded-2xl shadow-md p-4 border border-border-light dark:border-dark-border">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-50 dark:bg-green-900/20 rounded-xl flex items-center justify-center border border-green-100 dark:border-green-800">
                    <CheckCircle className="text-green-500" size={14} />
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-dark-text">Quiz Completed!</span>
                </div>
              </div>

              <div className="absolute -bottom-4 -left-4 bg-white dark:bg-dark-card rounded-2xl shadow-md p-4 border border-border-light dark:border-dark-border">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center border border-blue-100 dark:border-blue-800">
                    <Mic className="text-blue-500" size={14} />
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-dark-text">Voice note saved</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-10 sm:py-16 bg-white dark:bg-dark-card border-y border-border-light dark:border-dark-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="text-2xl sm:text-3xl md:text-4xl font-playfair font-semibold text-brand-orange mb-1 sm:mb-2">{stat.value}</div>
                <div className="text-xs sm:text-sm md:text-base text-gray-500 dark:text-dark-text-muted">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-12 sm:py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-soft-orange dark:bg-dark-surface rounded-full mb-3 sm:mb-4 border border-peach dark:border-dark-border">
              <Sparkles className="text-brand-orange" size={12} />
              <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-dark-text-muted">Powerful Features</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-playfair font-semibold text-gray-800 dark:text-dark-text mb-3 sm:mb-4">
              Everything You Need to Study Smarter
            </h2>
            <p className="text-sm sm:text-base text-gray-500 dark:text-dark-text-muted max-w-2xl mx-auto px-2">
              A complete suite of AI-powered tools designed to transform your learning experience
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {features.map((feature, idx) => (
              <div 
                key={idx}
                className="bg-white dark:bg-dark-card rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-border-dark dark:border-dark-border hover:shadow-md hover:border-brand-orange/30 transition-all group"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-soft-orange dark:bg-dark-surface rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-5 border border-peach dark:border-dark-border group-hover:scale-105 transition-transform">
                  <feature.icon className="text-brand-orange" size={18} />
                </div>
                <h3 className="text-base sm:text-lg font-playfair font-semibold text-gray-800 dark:text-dark-text mb-2 sm:mb-3">{feature.title}</h3>
                <p className="text-gray-500 dark:text-dark-text-muted text-xs sm:text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-12 sm:py-20 px-4 sm:px-6 bg-gradient-to-br from-accent-dark to-accent-violet">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-playfair font-semibold text-white mb-3 sm:mb-4">
              Why Students Love StudySync AI
            </h2>
            <p className="text-sm sm:text-base text-white/70 max-w-2xl mx-auto px-2">
              Real benefits that make a difference in your academic journey
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
            {benefits.map((benefit, idx) => (
              <div 
                key={idx}
                className="bg-white/10 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-white/15 hover:bg-white/15 transition-all"
              >
                <div className="w-9 h-9 sm:w-11 sm:h-11 bg-white/15 rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-4 border border-white/20">
                  <benefit.icon className="text-white" size={16} />
                </div>
                <h3 className="text-sm sm:text-base font-medium text-white mb-1.5 sm:mb-2">{benefit.title}</h3>
                <p className="text-white/70 text-xs sm:text-sm hidden sm:block">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-12 sm:py-20 px-4 sm:px-6 bg-white dark:bg-dark-card">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-soft-orange dark:bg-dark-surface rounded-full mb-3 sm:mb-4">
              <Star className="text-deep-orange fill-deep-orange" size={14} />
              <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-dark-text-muted">Student Reviews</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-dark-text mb-3 sm:mb-4">
              Loved by Students Everywhere
            </h2>
            <p className="text-sm sm:text-lg text-gray-600 dark:text-dark-text-muted max-w-2xl mx-auto px-2">
              See what students are saying about their learning transformation
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 sm:gap-8">
            {testimonials.map((testimonial, idx) => (
              <div 
                key={idx}
                className="bg-cream dark:bg-dark-surface rounded-xl sm:rounded-2xl p-5 sm:p-8 border border-gray-100 dark:border-dark-border"
              >
                <div className="flex items-center gap-0.5 mb-3 sm:mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={14} className="text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 dark:text-dark-text leading-relaxed mb-4 sm:mb-6 text-sm sm:text-lg">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-deep-orange to-dark-orange rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm sm:text-base">{testimonial.name.charAt(0)}</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-dark-text text-sm sm:text-base">{testimonial.name}</div>
                    <div className="text-xs sm:text-sm text-gray-500 dark:text-dark-text-muted">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-dark-text mb-4 sm:mb-6">
            Ready to Transform Your Learning?
          </h2>
          <p className="text-sm sm:text-lg text-gray-600 dark:text-dark-text-muted mb-6 sm:mb-8 max-w-2xl mx-auto px-2">
            Join thousands of students who are already studying smarter with AI. 
            Get started for free today.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link 
              href="/register" 
              className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-deep-orange to-dark-orange text-white font-semibold rounded-button hover:shadow-xl hover:scale-105 transition-all text-sm sm:text-base"
            >
              Get Started Free
              <ArrowRight size={18} />
            </Link>
            <Link 
              href="/login" 
              className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-white dark:bg-dark-surface border-2 border-gray-200 dark:border-dark-border text-gray-700 dark:text-dark-text font-semibold rounded-button hover:border-deep-orange transition-all text-sm sm:text-base"
            >
              Already have an account?
              <ChevronRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-10 sm:py-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12 mb-8 sm:mb-12">
            {/* Brand */}
            <div className="sm:col-span-2">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-deep-orange to-dark-orange rounded-lg sm:rounded-xl flex items-center justify-center">
                  <BookOpen className="text-white" size={16} />
                </div>
                <span className="text-lg sm:text-xl font-bold">StudySync AI</span>
              </div>
              <p className="text-gray-400 max-w-md text-sm sm:text-base">
                The AI-powered learning platform that helps you understand concepts deeply 
                through Socratic questioning, voice notes, and intelligent study tools.
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Product</h4>
              <ul className="space-y-1.5 sm:space-y-2 text-gray-400 text-sm">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#benefits" className="hover:text-white transition-colors">Benefits</a></li>
                <li><a href="#testimonials" className="hover:text-white transition-colors">Testimonials</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Company</h4>
              <ul className="space-y-1.5 sm:space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-6 sm:pt-8 text-center text-gray-400 text-xs sm:text-sm">
            <p>&copy; {new Date().getFullYear()} StudySync AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

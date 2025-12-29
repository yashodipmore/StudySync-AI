'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, Mail, Lock, User, Loader2, ArrowRight, BookOpen, CheckCircle, ArrowLeft } from 'lucide-react'

export default function RegisterPage() {
  const [step, setStep] = useState(1) // 1: Form, 2: OTP
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [resendTimer, setResendTimer] = useState(0)
  
  const router = useRouter()
  const otpRefs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()]

  // Resend timer countdown
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendTimer])

  const handleSendOTP = async (e) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, password, type: 'register' })
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error)
        setLoading(false)
        return
      }

      setStep(2)
      setResendTimer(60)
    } catch (err) {
      setError('Network error. Please try again.')
    }
    
    setLoading(false)
  }

  const handleOtpChange = (index, value) => {
    if (value.length > 1) value = value[0]
    if (!/^\d*$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Auto focus next input
    if (value && index < 5) {
      otpRefs[index + 1].current?.focus()
    }
  }

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs[index - 1].current?.focus()
    }
  }

  const handleOtpPaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').slice(0, 6)
    if (!/^\d+$/.test(pastedData)) return

    const newOtp = [...otp]
    pastedData.split('').forEach((char, i) => {
      if (i < 6) newOtp[i] = char
    })
    setOtp(newOtp)
  }

  const handleVerifyOTP = async () => {
    setError('')
    const otpString = otp.join('')
    
    if (otpString.length !== 6) {
      setError('Please enter complete OTP')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: otpString, type: 'register' })
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error)
        setLoading(false)
        return
      }

      router.push('/dashboard')
    } catch (err) {
      setError('Network error. Please try again.')
    }
    
    setLoading(false)
  }

  const handleResendOTP = async () => {
    if (resendTimer > 0) return
    
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, password, type: 'register' })
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error)
      } else {
        setResendTimer(60)
        setOtp(['', '', '', '', '', ''])
      }
    } catch (err) {
      setError('Network error. Please try again.')
    }
    
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-cream dark:bg-dark-bg flex">
      {/* Left Side - Visual */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-deep-orange to-dark-orange items-center justify-center p-12">
        <div className="max-w-lg text-white">
          <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mb-8 backdrop-blur-sm">
            <BookOpen size={48} className="text-white" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Join StudySync AI Today</h2>
          <p className="text-white/90 text-lg leading-relaxed mb-8">
            Create your free account and unlock the power of AI-assisted learning. 
            Study smarter, not harder.
          </p>
          
          {/* Features List */}
          <div className="space-y-4">
            {[
              'AI-powered study assistant',
              'Voice notes with smart formatting',
              'Socratic learning method',
              'Auto-generated quizzes'
            ].map((feature, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                  <CheckCircle size={14} className="text-white" />
                </div>
                <span className="text-white/90">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center px-8 py-12">
        <div className="w-full max-w-md">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 bg-gradient-to-br from-deep-orange to-dark-orange rounded-xl flex items-center justify-center">
              <BookOpen className="text-white" size={24} />
            </div>
            <span className="text-2xl font-bold text-gray-900 dark:text-dark-text">StudySync AI</span>
          </Link>

          {step === 1 ? (
            <>
              {/* Heading */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-dark-text mb-2">Create your account</h1>
                <p className="text-gray-600 dark:text-dark-text-muted">Start your learning journey with AI</p>
              </div>

              {/* Error Alert */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400 text-sm">
                  {error}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSendOTP} className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-dark-text-muted mb-2">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      required
                      className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-dark-surface border-2 border-gray-200 dark:border-dark-border rounded-xl focus:outline-none focus:border-deep-orange transition-colors text-gray-900 dark:text-dark-text placeholder-gray-400 dark:placeholder-gray-500"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-dark-text-muted mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-dark-surface border-2 border-gray-200 dark:border-dark-border rounded-xl focus:outline-none focus:border-deep-orange transition-colors text-gray-900 dark:text-dark-text placeholder-gray-400 dark:placeholder-gray-500"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-dark-text-muted mb-2">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min. 6 characters"
                      required
                      className="w-full pl-12 pr-12 py-3.5 bg-white dark:bg-dark-surface border-2 border-gray-200 dark:border-dark-border rounded-xl focus:outline-none focus:border-deep-orange transition-colors text-gray-900 dark:text-dark-text placeholder-gray-400 dark:placeholder-gray-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-dark-text-muted mb-2">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your password"
                      required
                      className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-dark-surface border-2 border-gray-200 dark:border-dark-border rounded-xl focus:outline-none focus:border-deep-orange transition-colors text-gray-900 dark:text-dark-text placeholder-gray-400 dark:placeholder-gray-500"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-gradient-to-r from-deep-orange to-dark-orange text-white font-semibold rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-6"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Sending OTP...
                    </>
                  ) : (
                    <>
                      Continue
                      <ArrowRight size={20} />
                    </>
                  )}
                </button>
              </form>
            </>
          ) : (
            <>
              {/* OTP Step */}
              <button
                onClick={() => setStep(1)}
                className="flex items-center gap-2 text-gray-600 dark:text-dark-text-muted hover:text-gray-900 dark:hover:text-dark-text mb-8 transition-colors"
              >
                <ArrowLeft size={20} />
                Back
              </button>

              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-dark-text mb-2">Verify your email</h1>
                <p className="text-gray-600 dark:text-dark-text-muted">
                  We've sent a 6-digit code to <span className="font-medium text-gray-900 dark:text-dark-text">{email}</span>
                </p>
              </div>

              {/* Error Alert */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400 text-sm">
                  {error}
                </div>
              )}

              {/* OTP Input */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 dark:text-dark-text-muted mb-4">Enter OTP</label>
                <div className="flex gap-3 justify-center" onPaste={handleOtpPaste}>
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={otpRefs[index]}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      className="w-12 h-14 text-center text-xl font-bold bg-white dark:bg-dark-surface border-2 border-gray-200 dark:border-dark-border rounded-xl focus:outline-none focus:border-deep-orange transition-colors text-gray-900 dark:text-dark-text"
                    />
                  ))}
                </div>
              </div>

              {/* Verify Button */}
              <button
                onClick={handleVerifyOTP}
                disabled={loading || otp.join('').length !== 6}
                className="w-full py-3.5 bg-gradient-to-r from-deep-orange to-dark-orange text-white font-semibold rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Verifying...
                  </>
                ) : (
                  <>
                    Verify & Create Account
                    <CheckCircle size={20} />
                  </>
                )}
              </button>

              {/* Resend OTP */}
              <div className="mt-6 text-center">
                <p className="text-gray-600 dark:text-dark-text-muted text-sm">
                  Didn't receive the code?{' '}
                  {resendTimer > 0 ? (
                    <span className="text-gray-400 dark:text-gray-500">Resend in {resendTimer}s</span>
                  ) : (
                    <button
                      onClick={handleResendOTP}
                      disabled={loading}
                      className="text-deep-orange font-semibold hover:text-dark-orange transition-colors"
                    >
                      Resend OTP
                    </button>
                  )}
                </p>
              </div>
            </>
          )}

          {/* Login Link */}
          <p className="mt-8 text-center text-gray-600 dark:text-dark-text-muted">
            Already have an account?{' '}
            <Link href="/login" className="text-deep-orange font-semibold hover:text-dark-orange transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

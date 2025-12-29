'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { Eye, EyeOff, Mail, Lock, User, Loader2, ArrowRight, BookOpen, CheckCircle, ArrowLeft } from 'lucide-react'

// Google Icon Component
const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
)

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
  const [googleLoading, setGoogleLoading] = useState(false)
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

  // Google Sign In Handler
  const handleGoogleSignIn = async () => {
    setGoogleLoading(true)
    setError('')
    try {
      await signIn('google', { callbackUrl: '/dashboard' })
    } catch (err) {
      setError('Failed to sign in with Google')
      setGoogleLoading(false)
    }
  }

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
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-accent-dark to-accent-violet items-center justify-center p-12">
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

              {/* Divider */}
              <div className="flex items-center gap-4 my-6">
                <div className="flex-1 h-px bg-gray-200 dark:bg-dark-border"></div>
                <span className="text-sm text-gray-500 dark:text-dark-text-muted">or continue with</span>
                <div className="flex-1 h-px bg-gray-200 dark:bg-dark-border"></div>
              </div>

              {/* Google Sign In Button */}
              <button
                onClick={handleGoogleSignIn}
                disabled={googleLoading}
                className="w-full py-3.5 bg-white dark:bg-dark-surface border-2 border-gray-200 dark:border-dark-border text-gray-700 dark:text-dark-text font-semibold rounded-xl hover:border-gray-400 hover:bg-gray-50 dark:hover:bg-dark-card transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {googleLoading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <GoogleIcon />
                )}
                {googleLoading ? 'Signing up...' : 'Continue with Google'}
              </button>
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

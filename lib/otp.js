import nodemailer from 'nodemailer'

// In-memory OTP storage (use Redis in production)
const otpStore = new Map()

// OTP expiry time (5 minutes)
const OTP_EXPIRY = 5 * 60 * 1000

// Generate 6-digit OTP
export function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Store OTP with expiry
export function storeOTP(email, otp, purpose = 'register') {
  const data = {
    otp,
    purpose,
    createdAt: Date.now(),
    attempts: 0
  }
  otpStore.set(email.toLowerCase(), data)
  
  // Auto-delete after expiry
  setTimeout(() => {
    const stored = otpStore.get(email.toLowerCase())
    if (stored && stored.createdAt === data.createdAt) {
      otpStore.delete(email.toLowerCase())
    }
  }, OTP_EXPIRY)
  
  return data
}

// Verify OTP
export function verifyOTP(email, otp, purpose = 'register') {
  const stored = otpStore.get(email.toLowerCase())
  
  if (!stored) {
    return { valid: false, error: 'OTP expired or not found. Please request a new one.' }
  }
  
  if (stored.purpose !== purpose) {
    return { valid: false, error: 'Invalid OTP purpose.' }
  }
  
  // Check expiry
  if (Date.now() - stored.createdAt > OTP_EXPIRY) {
    otpStore.delete(email.toLowerCase())
    return { valid: false, error: 'OTP has expired. Please request a new one.' }
  }
  
  // Check attempts (max 3)
  if (stored.attempts >= 3) {
    otpStore.delete(email.toLowerCase())
    return { valid: false, error: 'Too many failed attempts. Please request a new OTP.' }
  }
  
  // Verify OTP
  if (stored.otp !== otp) {
    stored.attempts++
    return { valid: false, error: `Invalid OTP. ${3 - stored.attempts} attempts remaining.` }
  }
  
  // OTP is valid - remove it
  otpStore.delete(email.toLowerCase())
  return { valid: true }
}

// Check if OTP exists for email
export function hasActiveOTP(email) {
  const stored = otpStore.get(email.toLowerCase())
  if (!stored) return false
  
  // Check if expired
  if (Date.now() - stored.createdAt > OTP_EXPIRY) {
    otpStore.delete(email.toLowerCase())
    return false
  }
  
  return true
}

// Get remaining time for OTP
export function getOTPRemainingTime(email) {
  const stored = otpStore.get(email.toLowerCase())
  if (!stored) return 0
  
  const elapsed = Date.now() - stored.createdAt
  const remaining = Math.max(0, OTP_EXPIRY - elapsed)
  return Math.ceil(remaining / 1000) // Return seconds
}

// Create email transporter
export function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  })
}

// Send OTP email
export async function sendOTPEmail(email, otp, purpose = 'register') {
  const transporter = createTransporter()
  
  const purposeText = purpose === 'register' 
    ? 'complete your registration' 
    : purpose === 'login'
    ? 'sign in to your account'
    : 'reset your password'
  
  const mailOptions = {
    from: process.env.EMAIL_FROM || 'StudySync AI <noreply@studysync.ai>',
    to: email,
    subject: `${otp} is your StudySync AI verification code`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify your email</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #FFF9F5;">
        <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <!-- Header -->
          <div style="text-align: center; margin-bottom: 40px;">
            <div style="display: inline-block; background: linear-gradient(135deg, #F97316, #EA580C); padding: 16px; border-radius: 16px; margin-bottom: 16px;">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
              </svg>
            </div>
            <h1 style="color: #1F2937; font-size: 24px; font-weight: 700; margin: 0;">StudySync AI</h1>
          </div>
          
          <!-- Main Content -->
          <div style="background: white; border-radius: 16px; padding: 40px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); border: 1px solid #E5E7EB;">
            <h2 style="color: #1F2937; font-size: 20px; font-weight: 600; margin: 0 0 16px 0; text-align: center;">
              Verify Your Email
            </h2>
            
            <p style="color: #6B7280; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0; text-align: center;">
              Use the following code to ${purposeText}:
            </p>
            
            <!-- OTP Code -->
            <div style="background: linear-gradient(135deg, #FFF7ED, #FFEDD5); border: 2px solid #F97316; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
              <div style="font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #EA580C;">
                ${otp}
              </div>
            </div>
            
            <p style="color: #9CA3AF; font-size: 14px; text-align: center; margin: 0 0 8px 0;">
              This code will expire in <strong>5 minutes</strong>.
            </p>
            
            <p style="color: #9CA3AF; font-size: 14px; text-align: center; margin: 0;">
              If you didn't request this code, please ignore this email.
            </p>
          </div>
          
          <!-- Footer -->
          <div style="text-align: center; margin-top: 32px;">
            <p style="color: #9CA3AF; font-size: 12px; margin: 0;">
              © ${new Date().getFullYear()} StudySync AI. All rights reserved.
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `Your StudySync AI verification code is: ${otp}\n\nThis code will expire in 5 minutes.\n\nIf you didn't request this code, please ignore this email.`
  }
  
  try {
    await transporter.sendMail(mailOptions)
    return { success: true }
  } catch (error) {
    console.error('Email sending error:', error)
    return { success: false, error: error.message }
  }
}

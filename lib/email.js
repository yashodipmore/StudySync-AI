import nodemailer from 'nodemailer'

// Create transporter - use hostname for Vercel, IPv6 was only for local network
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false
  },
  connectionTimeout: 30000,
  greetingTimeout: 30000,
  socketTimeout: 30000,
})

// Generate 6-digit OTP
export function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Send OTP email
export async function sendOTPEmail(email, otp, type = 'verify') {
  const subject = type === 'verify' 
    ? 'Verify Your Email - StudySync AI' 
    : 'Login OTP - StudySync AI'
  
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #FFF9F5;">
      <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 40px;">
          <div style="display: inline-block; background: linear-gradient(135deg, #F97316, #EA580C); padding: 16px 24px; border-radius: 16px;">
            <span style="color: white; font-size: 24px; font-weight: bold;">📚 StudySync AI</span>
          </div>
        </div>
        
        <!-- Main Card -->
        <div style="background: white; border-radius: 20px; padding: 40px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); border: 1px solid #FFEDD5;">
          <h1 style="color: #1F2937; font-size: 28px; margin: 0 0 16px 0; text-align: center;">
            ${type === 'verify' ? 'Verify Your Email' : 'Login Verification'}
          </h1>
          
          <p style="color: #6B7280; font-size: 16px; line-height: 1.6; text-align: center; margin: 0 0 32px 0;">
            ${type === 'verify' 
              ? 'Thank you for signing up! Use the code below to verify your email address.' 
              : 'Use this code to complete your login to StudySync AI.'}
          </p>
          
          <!-- OTP Box -->
          <div style="background: linear-gradient(135deg, #FFF4ED, #FFEDD5); border: 2px solid #F97316; border-radius: 16px; padding: 24px; text-align: center; margin: 0 0 32px 0;">
            <p style="color: #6B7280; font-size: 14px; margin: 0 0 8px 0; text-transform: uppercase; letter-spacing: 1px;">Your OTP Code</p>
            <div style="font-size: 40px; font-weight: bold; color: #F97316; letter-spacing: 8px; font-family: monospace;">
              ${otp}
            </div>
          </div>
          
          <p style="color: #9CA3AF; font-size: 14px; text-align: center; margin: 0;">
            This code expires in <strong style="color: #F97316;">10 minutes</strong>
          </p>
        </div>
        
        <!-- Footer -->
        <div style="text-align: center; margin-top: 32px;">
          <p style="color: #9CA3AF; font-size: 13px; margin: 0;">
            If you didn't request this code, please ignore this email.
          </p>
          <p style="color: #9CA3AF; font-size: 13px; margin: 8px 0 0 0;">
            © ${new Date().getFullYear()} StudySync AI. All rights reserved.
          </p>
        </div>
      </div>
    </body>
    </html>
  `

  const mailOptions = {
    from: `"StudySync AI" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: subject,
    html: htmlContent,
  }

  try {
    await transporter.sendMail(mailOptions)
    return { success: true }
  } catch (error) {
    console.error('Email send error:', error)
    return { success: false, error: error.message }
  }
}

import { NextResponse } from 'next/server'
import { findUserByEmail, storeOTP, hashPassword } from '@/lib/auth'
import { generateOTP, sendOTPEmail } from '@/lib/email'

export async function POST(request) {
  try {
    const { email, name, password, type = 'register' } = await request.json()

    // Validate email
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // For registration
    if (type === 'register') {
      if (!name || !password) {
        return NextResponse.json(
          { error: 'Name and password are required' },
          { status: 400 }
        )
      }

      if (password.length < 6) {
        return NextResponse.json(
          { error: 'Password must be at least 6 characters' },
          { status: 400 }
        )
      }

      // Check if user exists
      const existingUser = await findUserByEmail(email)
      if (existingUser) {
        return NextResponse.json(
          { error: 'User with this email already exists' },
          { status: 409 }
        )
      }

      // Generate OTP and store with user data
      const otp = generateOTP()
      const hashedPassword = await hashPassword(password)
      
      storeOTP(email, otp, { name, password: hashedPassword })
      
      // Log OTP for debugging (remove in production)
      console.log(`\n========== OTP FOR ${email} ==========`)
      console.log(`OTP: ${otp}`)
      console.log(`==========================================\n`)

      // Send OTP email
      const emailResult = await sendOTPEmail(email, otp, 'verify')
      
      if (!emailResult.success) {
        return NextResponse.json(
          { error: 'Failed to send OTP. Please try again.' },
          { status: 500 }
        )
      }

      return NextResponse.json({
        success: true,
        message: 'OTP sent to your email'
      })
    }

    // For login
    if (type === 'login') {
      const existingUser = await findUserByEmail(email)
      if (!existingUser) {
        return NextResponse.json(
          { error: 'No account found with this email' },
          { status: 404 }
        )
      }

      // Generate OTP
      const otp = generateOTP()
      storeOTP(email, otp, { userId: existingUser.id })
      
      // Log OTP for debugging (remove in production)
      console.log(`\n========== LOGIN OTP FOR ${email} ==========`)
      console.log(`OTP: ${otp}`)
      console.log(`==============================================\n`)

      // Send OTP email
      const emailResult = await sendOTPEmail(email, otp, 'login')
      
      if (!emailResult.success) {
        return NextResponse.json(
          { error: 'Failed to send OTP. Please try again.' },
          { status: 500 }
        )
      }

      return NextResponse.json({
        success: true,
        message: 'OTP sent to your email'
      })
    }

    return NextResponse.json(
      { error: 'Invalid request type' },
      { status: 400 }
    )

  } catch (error) {
    console.error('Send OTP error:', error)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}

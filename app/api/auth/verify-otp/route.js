import { NextResponse } from 'next/server'
import { 
  findUserByEmail, 
  findUserById,
  getStoredOTP, 
  clearOTP, 
  createUser, 
  generateToken 
} from '@/lib/auth'

export async function POST(request) {
  try {
    const { email, otp, type = 'register' } = await request.json()

    // Validate input
    if (!email || !otp) {
      return NextResponse.json(
        { error: 'Email and OTP are required' },
        { status: 400 }
      )
    }

    // Get stored OTP data
    const storedData = getStoredOTP(email)
    
    // Debug log
    console.log(`\n========== VERIFY OTP ==========`)
    console.log(`Email: ${email}`)
    console.log(`Entered OTP: ${otp}`)
    console.log(`Stored Data:`, storedData)
    console.log(`================================\n`)
    
    if (!storedData) {
      return NextResponse.json(
        { error: 'OTP expired or not found. Please request a new one.' },
        { status: 400 }
      )
    }

    // Verify OTP
    if (storedData.otp !== otp) {
      return NextResponse.json(
        { error: 'Invalid OTP. Please try again.' },
        { status: 400 }
      )
    }

    // For registration - create new user
    if (type === 'register') {
      const user = await createUser({
        name: storedData.userData?.name || storedData.name,
        email: email,
        password: storedData.userData?.password || storedData.password
      })

      // Clear OTP
      clearOTP(email)

      // Generate JWT token
      const token = generateToken(user)

      // Create response with cookie
      const response = NextResponse.json({
        success: true,
        message: 'Account created successfully',
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        }
      })

      // Set HTTP-only cookie
      response.cookies.set('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7 // 7 days
      })

      return response
    }

    // For login - verify and login
    if (type === 'login') {
      const user = await findUserByEmail(email)
      
      if (!user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        )
      }

      // Clear OTP
      clearOTP(email)

      // Generate JWT token
      const token = generateToken(user)

      // Create response with cookie
      const response = NextResponse.json({
        success: true,
        message: 'Login successful',
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        }
      })

      // Set HTTP-only cookie
      response.cookies.set('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7 // 7 days
      })

      return response
    }

    return NextResponse.json(
      { error: 'Invalid request type' },
      { status: 400 }
    )

  } catch (error) {
    console.error('Verify OTP error:', error)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}

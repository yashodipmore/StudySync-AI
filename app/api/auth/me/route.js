import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyToken, findUserById } from '@/lib/auth'

export async function GET() {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get('token')?.value

    if (!token) {
      return NextResponse.json(
        { authenticated: false, user: null },
        { status: 200 }
      )
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json(
        { authenticated: false, user: null },
        { status: 200 }
      )
    }

    const user = await findUserById(decoded.id || decoded.userId)
    if (!user) {
      return NextResponse.json(
        { authenticated: false, user: null },
        { status: 200 }
      )
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    })

  } catch (error) {
    console.error('Auth check error:', error)
    return NextResponse.json(
      { authenticated: false, user: null },
      { status: 200 }
    )
  }
}

import AuthController from '../../../../server/controllers/AuthController'

export async function POST(request) {
  return await AuthController.login(request)
}
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import dbConnect from '../../../../lib/mongodb'
import User from '../../../../models/User'

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-replace-in-production'

export async function POST_OLD(request) {
  try {
    await dbConnect()
    
    const { email, password } = await request.json()
    
    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      )
    }
    
    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() })
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      )
    }
    
    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password)
    
    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      )
    }
    
    // Create JWT token
    const token = jwt.sign(
      { 
        userId: user._id,
        email: user.email,
        username: user.username 
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    )
    
    // Return user data without password
    const userResponse = {
      _id: user._id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      avatar: user.avatar,
      bio: user.bio,
      hobbies: user.hobbies
    }
    
    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      user: userResponse,
      token
    })
    
    // Set HTTP-only cookie for extra security (optional)
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    })
    
    return response
    
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { success: false, error: 'Authentication failed', details: error.message },
      { status: 500 }
    )
  }
}
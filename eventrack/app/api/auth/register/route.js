import AuthController from '../../../../server/controllers/AuthController'

export async function POST(request) {
  return await AuthController.register(request)
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
    
    const { firstName, lastName, username, email, password, role, hobbies } = await request.json()
    
    // Validate required fields
    if (!firstName || !lastName || !username || !email || !password) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      )
    }
    
    // Validate email format
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid email address' },
        { status: 400 }
      )
    }
    
    // Validate password strength
    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 6 characters long' },
        { status: 400 }
      )
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [
        { email: email.toLowerCase() },
        { username: username.toLowerCase() }
      ]
    })
    
    if (existingUser) {
      if (existingUser.email === email.toLowerCase()) {
        return NextResponse.json(
          { success: false, error: 'An account with this email already exists' },
          { status: 409 }
        )
      } else {
        return NextResponse.json(
          { success: false, error: 'This username is already taken' },
          { status: 409 }
        )
      }
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)
    
    // Create user
    const user = await User.create({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      username: username.toLowerCase().trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: role || 'participant',
      hobbies: hobbies || []
    })
    
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
      message: 'Account created successfully',
      user: userResponse,
      token
    }, { status: 201 })
    
    // Set HTTP-only cookie for extra security (optional)
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    })
    
    return response
    
  } catch (error) {
    console.error('Registration error:', error)
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message)
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { success: false, error: 'Registration failed', details: error.message },
      { status: 500 }
    )
  }
}
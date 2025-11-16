import { NextResponse } from 'next/server'
import dbConnect from '../../../lib/mongodb'
import User from '../../../models/User'
import bcrypt from 'bcryptjs'

// GET - Fetch users
export async function GET(request) {
  try {
    await dbConnect()
    
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('id')
    const username = searchParams.get('username')
    const email = searchParams.get('email')
    
    if (userId) {
      const user = await User.findById(userId)
        .select('-password')
        .populate('savedEvents')
        .populate('createdEvents')
      
      if (!user) {
        return NextResponse.json(
          { success: false, error: 'User not found' },
          { status: 404 }
        )
      }
      
      return NextResponse.json({ success: true, data: user })
    }
    
    if (username) {
      const user = await User.findOne({ username })
        .select('-password')
        .populate('savedEvents')
        .populate('createdEvents')
      
      if (!user) {
        return NextResponse.json(
          { success: false, error: 'User not found' },
          { status: 404 }
        )
      }
      
      return NextResponse.json({ success: true, data: user })
    }
    
    if (email) {
      const user = await User.findOne({ email })
        .select('-password')
        .populate('savedEvents')
        .populate('createdEvents')
      
      if (!user) {
        return NextResponse.json(
          { success: false, error: 'User not found' },
          { status: 404 }
        )
      }
      
      return NextResponse.json({ success: true, data: user })
    }
    
    const users = await User.find({ isActive: true })
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(50)
    
    return NextResponse.json({ success: true, data: users })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch users', details: error.message },
      { status: 500 }
    )
  }
}

// POST - Create new user (registration)
export async function POST(request) {
  try {
    await dbConnect()
    
    const { username, email, firstName, lastName, password, hobbies } = await request.json()
    
    // Validate required fields
    if (!username || !email || !firstName || !lastName || !password) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      )
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    })
    
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'User with this email or username already exists' },
        { status: 409 }
      )
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)
    
    // Create user
    const user = await User.create({
      username,
      email,
      firstName,
      lastName,
      password: hashedPassword,
      hobbies: hobbies || []
    })
    
    // Return user without password
    const userResponse = await User.findById(user._id).select('-password')
    
    return NextResponse.json(
      { 
        success: true, 
        data: userResponse, 
        message: 'User created successfully' 
      }, 
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating user:', error)
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message)
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to create user', details: error.message },
      { status: 500 }
    )
  }
}

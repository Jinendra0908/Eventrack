import { NextResponse } from 'next/server'
import { connectToDatabase } from '../../../../lib/mongodb'
import User from '../../../../models/User'
import jwt from 'jsonwebtoken'

export async function GET(request) {
  try {
    // Get authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'Authorization token required' },
        { status: 401 }
      )
    }

    const token = authHeader.split(' ')[1]
    
    // Verify JWT token
    let decoded
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET)
    } catch (error) {
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 401 }
      )
    }

    await connectToDatabase()

    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || ''
    const limit = parseInt(searchParams.get('limit')) || 10

    if (!query || query.length < 2) {
      return NextResponse.json({
        success: true,
        users: []
      })
    }

    // Search for users by name, username, or email
    const searchRegex = new RegExp(query, 'i')
    const users = await User.find({
      _id: { $ne: decoded.userId }, // Exclude current user
      $or: [
        { firstName: searchRegex },
        { lastName: searchRegex },
        { username: searchRegex },
        { email: searchRegex }
      ]
    })
    .select('_id firstName lastName username avatar email')
    .limit(limit)

    return NextResponse.json({
      success: true,
      users: users.map(user => ({
        id: user._id,
        name: `${user.firstName} ${user.lastName}`,
        username: user.username,
        email: user.email,
        avatar: user.avatar
      }))
    })

  } catch (error) {
    console.error('User search error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
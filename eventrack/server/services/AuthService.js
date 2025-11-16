import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../../models/User'
import { config } from '../config'
import { USER_ROLES } from '../config/constants'

/**
 * AuthService - Handles authentication business logic
 */
class AuthService {
  /**
   * Register new user
   */
  async register(userData) {
    const { username, email, password, firstName, lastName, role } = userData
    
    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    })
    
    if (existingUser) {
      if (existingUser.email === email) {
        throw new Error('Email already registered')
      }
      if (existingUser.username === username) {
        throw new Error('Username already taken')
      }
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)
    
    // Create user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role: role || USER_ROLES.PARTICIPANT
    })
    
    // Generate token
    const token = this.generateToken(user._id)
    
    // Return user without password
    const userObject = user.toObject()
    delete userObject.password
    
    return { user: userObject, token }
  }
  
  /**
   * Login user
   */
  async login(email, password) {
    // Find user by email
    const user = await User.findOne({ email })
    
    if (!user) {
      throw new Error('Invalid credentials')
    }
    
    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password)
    
    if (!isValidPassword) {
      throw new Error('Invalid credentials')
    }
    
    // Generate token
    const token = this.generateToken(user._id)
    
    // Return user without password
    const userObject = user.toObject()
    delete userObject.password
    
    return { user: userObject, token }
  }
  
  /**
   * Get user by ID
   */
  async getUserById(userId) {
    const user = await User.findById(userId).select('-password')
    
    if (!user) {
      throw new Error('User not found')
    }
    
    return user
  }
  
  /**
   * Update user profile
   */
  async updateProfile(userId, updateData) {
    const allowedUpdates = ['firstName', 'lastName', 'bio', 'avatar', 'hobbies']
    const updates = {}
    
    for (const field of allowedUpdates) {
      if (updateData[field] !== undefined) {
        updates[field] = updateData[field]
      }
    }
    
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password')
    
    if (!user) {
      throw new Error('User not found')
    }
    
    return user
  }
  
  /**
   * Generate JWT token
   */
  generateToken(userId) {
    return jwt.sign(
      { userId },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    )
  }
}

export default new AuthService()

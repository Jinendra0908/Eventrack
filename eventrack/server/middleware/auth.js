import jwt from 'jsonwebtoken'
import { config } from '../config'
import { ApiResponse } from '../utils/apiResponse'
import User from '../../models/User'

/**
 * Authentication middleware - Verify JWT token
 */
export const authenticate = async (request) => {
  try {
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Error('No token provided')
    }

    const token = authHeader.split(' ')[1]
    
    // Verify token
    const decoded = jwt.verify(token, config.jwt.secret)
    
    // Attach user info to request
    return {
      userId: decoded.userId,
      token
    }
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      throw new Error('Invalid token')
    }
    if (error.name === 'TokenExpiredError') {
      throw new Error('Token expired')
    }
    throw error
  }
}

/**
 * Role-based authorization middleware
 */
export const authorize = (...roles) => {
  return async (request, authData) => {
    try {
      const user = await User.findById(authData.userId)
      
      if (!user) {
        throw new Error('User not found')
      }
      
      if (roles.length && !roles.includes(user.role)) {
        throw new Error('Insufficient permissions')
      }
      
      return user
    } catch (error) {
      throw error
    }
  }
}

/**
 * Get authenticated user
 */
export const getAuthenticatedUser = async (request) => {
  try {
    const authData = await authenticate(request)
    const user = await User.findById(authData.userId)
    
    if (!user) {
      throw new Error('User not found')
    }
    
    return { user, token: authData.token }
  } catch (error) {
    throw error
  }
}

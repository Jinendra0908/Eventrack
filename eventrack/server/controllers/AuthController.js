import { NextResponse } from 'next/server'
import AuthService from '../services/AuthService'
import { ApiResponse, sendResponse } from '../utils/apiResponse'
import { validateLogin, validateRegistration } from '../middleware/validation'
import { getAuthenticatedUser } from '../middleware/auth'
import dbConnect from '../../lib/mongodb'

/**
 * AuthController - Handles authentication HTTP requests
 */
class AuthController {
  /**
   * POST /api/auth/register
   * Register new user
   */
  async register(request) {
    try {
      await dbConnect()
      
      const body = await request.json()
      
      // Validate request
      const validationError = validateRegistration(body)
      if (validationError) {
        return NextResponse.json(validationError, { status: validationError.statusCode })
      }
      
      // Call service
      const result = await AuthService.register(body)
      
      const response = ApiResponse.created(result, 'User registered successfully')
      return NextResponse.json(response, { status: response.statusCode })
      
    } catch (error) {
      console.error('Registration error:', error)
      
      const response = error.message.includes('already') || error.message.includes('taken')
        ? ApiResponse.badRequest(error.message)
        : ApiResponse.error('Registration failed', 500, error.message)
      
      return NextResponse.json(response, { status: response.statusCode })
    }
  }
  
  /**
   * POST /api/auth/login
   * Login user
   */
  async login(request) {
    try {
      await dbConnect()
      
      const body = await request.json()
      
      // Validate request
      const validationError = validateLogin(body)
      if (validationError) {
        return NextResponse.json(validationError, { status: validationError.statusCode })
      }
      
      // Call service
      const result = await AuthService.login(body.email, body.password)
      
      const response = ApiResponse.success(result, 'Login successful')
      return NextResponse.json(response, { status: response.statusCode })
      
    } catch (error) {
      console.error('Login error:', error)
      
      const response = error.message === 'Invalid credentials'
        ? ApiResponse.unauthorized(error.message)
        : ApiResponse.error('Login failed', 500, error.message)
      
      return NextResponse.json(response, { status: response.statusCode })
    }
  }
  
  /**
   * GET /api/auth/me
   * Get current authenticated user
   */
  async getCurrentUser(request) {
    try {
      await dbConnect()
      
      // Authenticate request
      const { user } = await getAuthenticatedUser(request)
      
      const response = ApiResponse.success({ user }, 'User retrieved successfully')
      return NextResponse.json(response, { status: response.statusCode })
      
    } catch (error) {
      console.error('Get current user error:', error)
      
      const response = ApiResponse.unauthorized(error.message)
      return NextResponse.json(response, { status: response.statusCode })
    }
  }
  
  /**
   * POST /api/auth/logout
   * Logout user (client-side token removal)
   */
  async logout(request) {
    try {
      const response = ApiResponse.success(null, 'Logged out successfully')
      return NextResponse.json(response, { status: response.statusCode })
    } catch (error) {
      const response = ApiResponse.error('Logout failed', 500, error.message)
      return NextResponse.json(response, { status: response.statusCode })
    }
  }
}

export default new AuthController()

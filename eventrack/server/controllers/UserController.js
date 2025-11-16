import { NextResponse } from 'next/server'
import UserService from '../services/UserService'
import { ApiResponse } from '../utils/apiResponse'
import { getAuthenticatedUser } from '../middleware/auth'
import dbConnect from '../../lib/mongodb'

/**
 * UserController - Handles user HTTP requests
 */
class UserController {
  /**
   * GET /api/users/search
   * Search for users
   */
  async searchUsers(request) {
    try {
      await dbConnect()
      
      // Authenticate
      const { user } = await getAuthenticatedUser(request)
      
      const { searchParams } = new URL(request.url)
      const query = searchParams.get('q') || ''
      const limit = parseInt(searchParams.get('limit')) || 10
      
      const users = await UserService.searchUsers(query, user._id, limit)
      
      const response = ApiResponse.success({ users }, 'Users retrieved successfully')
      return NextResponse.json(response, { status: response.statusCode })
      
    } catch (error) {
      console.error('Search users error:', error)
      
      const response = ApiResponse.error('Failed to search users', 500, error.message)
      return NextResponse.json(response, { status: response.statusCode })
    }
  }
  
  /**
   * GET /api/users/saved
   * Get user's saved events
   */
  async getSavedEvents(request) {
    try {
      await dbConnect()
      
      // Authenticate
      const { user } = await getAuthenticatedUser(request)
      
      const savedEvents = await UserService.getSavedEvents(user._id)
      
      const response = ApiResponse.success({ events: savedEvents }, 'Saved events retrieved successfully')
      return NextResponse.json(response, { status: response.statusCode })
      
    } catch (error) {
      console.error('Get saved events error:', error)
      
      const response = ApiResponse.error('Failed to fetch saved events', 500, error.message)
      return NextResponse.json(response, { status: response.statusCode })
    }
  }
  
  /**
   * GET /api/users
   * Get user profile (or list of users for admin)
   */
  async getUsers(request) {
    try {
      await dbConnect()
      
      // Authenticate
      const { user } = await getAuthenticatedUser(request)
      
      const profile = await UserService.getUserProfile(user._id)
      
      const response = ApiResponse.success({ user: profile }, 'User profile retrieved successfully')
      return NextResponse.json(response, { status: response.statusCode })
      
    } catch (error) {
      console.error('Get users error:', error)
      
      const response = ApiResponse.error('Failed to fetch users', 500, error.message)
      return NextResponse.json(response, { status: response.statusCode })
    }
  }
}

export default new UserController()

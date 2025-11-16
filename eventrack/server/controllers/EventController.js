import { NextResponse } from 'next/server'
import EventService from '../services/EventService'
import { ApiResponse } from '../utils/apiResponse'
import { validateEventCreation } from '../middleware/validation'
import { getAuthenticatedUser, authorize } from '../middleware/auth'
import dbConnect from '../../lib/mongodb'
import { USER_ROLES } from '../config/constants'

/**
 * EventController - Handles event HTTP requests
 */
class EventController {
  /**
   * GET /api/events
   * Get all events with filters
   */
  async getEvents(request) {
    try {
      await dbConnect()
      
      const { searchParams } = new URL(request.url)
      
      const filters = {
        category: searchParams.get('category'),
        search: searchParams.get('search'),
        limit: parseInt(searchParams.get('limit')) || undefined,
        page: parseInt(searchParams.get('page')) || undefined
      }
      
      const result = await EventService.getEvents(filters)
      
      const response = ApiResponse.success(result, 'Events retrieved successfully')
      return NextResponse.json(response, { status: response.statusCode })
      
    } catch (error) {
      console.error('Get events error:', error)
      
      const response = ApiResponse.error('Failed to fetch events', 500, error.message)
      return NextResponse.json(response, { status: response.statusCode })
    }
  }
  
  /**
   * POST /api/events
   * Create new event
   */
  async createEvent(request) {
    try {
      await dbConnect()
      
      // Authenticate and authorize
      const { user } = await getAuthenticatedUser(request)
      await authorize(USER_ROLES.HOST)(request, { userId: user._id })
      
      const body = await request.json()
      
      // Validate request
      const validationError = validateEventCreation(body)
      if (validationError) {
        return NextResponse.json(validationError, { status: validationError.statusCode })
      }
      
      // Call service
      const event = await EventService.createEvent(user._id, body)
      
      const response = ApiResponse.created({ event }, 'Event created successfully')
      return NextResponse.json(response, { status: response.statusCode })
      
    } catch (error) {
      console.error('Create event error:', error)
      
      let response
      if (error.message.includes('Only hosts')) {
        response = ApiResponse.forbidden(error.message)
      } else if (error.name === 'ValidationError') {
        const errors = Object.values(error.errors).map(err => err.message)
        response = ApiResponse.validationError(errors)
      } else {
        response = ApiResponse.error('Failed to create event', 500, error.message)
      }
      
      return NextResponse.json(response, { status: response.statusCode })
    }
  }
  
  /**
   * GET /api/events/host
   * Get events created by authenticated host
   */
  async getHostEvents(request) {
    try {
      await dbConnect()
      
      // Authenticate and authorize
      const { user } = await getAuthenticatedUser(request)
      await authorize(USER_ROLES.HOST)(request, { userId: user._id })
      
      const events = await EventService.getHostEvents(user._id)
      
      const response = ApiResponse.success({ events }, 'Host events retrieved successfully')
      return NextResponse.json(response, { status: response.statusCode })
      
    } catch (error) {
      console.error('Get host events error:', error)
      
      const response = error.message.includes('permission')
        ? ApiResponse.forbidden(error.message)
        : ApiResponse.error('Failed to fetch host events', 500, error.message)
      
      return NextResponse.json(response, { status: response.statusCode })
    }
  }
  
  /**
   * GET /api/events/[id]
   * Get event by ID
   */
  async getEventById(request, params) {
    try {
      await dbConnect()
      
      const event = await EventService.getEventById(params.id)
      
      const response = ApiResponse.success({ event }, 'Event retrieved successfully')
      return NextResponse.json(response, { status: response.statusCode })
      
    } catch (error) {
      console.error('Get event error:', error)
      
      const response = error.message === 'Event not found'
        ? ApiResponse.notFound(error.message)
        : ApiResponse.error('Failed to fetch event', 500, error.message)
      
      return NextResponse.json(response, { status: response.statusCode })
    }
  }
  
  /**
   * PUT /api/events/[id]
   * Update event
   */
  async updateEvent(request, params) {
    try {
      await dbConnect()
      
      // Authenticate
      const { user } = await getAuthenticatedUser(request)
      
      const body = await request.json()
      
      // Call service (permission check inside service)
      const event = await EventService.updateEvent(params.id, user._id, body)
      
      const response = ApiResponse.success({ event }, 'Event updated successfully')
      return NextResponse.json(response, { status: response.statusCode })
      
    } catch (error) {
      console.error('Update event error:', error)
      
      let response
      if (error.message.includes('not found')) {
        response = ApiResponse.notFound(error.message)
      } else if (error.message.includes('permission')) {
        response = ApiResponse.forbidden(error.message)
      } else if (error.name === 'ValidationError') {
        const errors = Object.values(error.errors).map(err => err.message)
        response = ApiResponse.validationError(errors)
      } else {
        response = ApiResponse.error('Failed to update event', 500, error.message)
      }
      
      return NextResponse.json(response, { status: response.statusCode })
    }
  }
  
  /**
   * DELETE /api/events/[id]
   * Delete event
   */
  async deleteEvent(request, params) {
    try {
      await dbConnect()
      
      // Authenticate
      const { user } = await getAuthenticatedUser(request)
      
      // Call service (permission check inside service)
      const result = await EventService.deleteEvent(params.id, user._id)
      
      const response = ApiResponse.success(result, result.message)
      return NextResponse.json(response, { status: response.statusCode })
      
    } catch (error) {
      console.error('Delete event error:', error)
      
      let response
      if (error.message.includes('not found')) {
        response = ApiResponse.notFound(error.message)
      } else if (error.message.includes('permission')) {
        response = ApiResponse.forbidden(error.message)
      } else {
        response = ApiResponse.error('Failed to delete event', 500, error.message)
      }
      
      return NextResponse.json(response, { status: response.statusCode })
    }
  }
  
  /**
   * POST /api/events/[id]/register
   * Register user for an event
   */
  async registerForEvent(request, params) {
    try {
      await dbConnect()
      
      // Authenticate user
      const { user } = await getAuthenticatedUser(request)
      
      // Call service to register user for event
      const result = await EventService.registerUserForEvent(params.id, user._id)
      
      const response = ApiResponse.success(result, 'Successfully registered for event')
      return NextResponse.json(response, { status: response.statusCode })
      
    } catch (error) {
      console.error('Register for event error:', error)
      
      let response
      if (error.message.includes('not found')) {
        response = ApiResponse.notFound(error.message)
      } else if (error.message.includes('already registered')) {
        response = ApiResponse.error(error.message, 400)
      } else if (error.message.includes('full') || error.message.includes('capacity')) {
        response = ApiResponse.error(error.message, 400)
      } else {
        response = ApiResponse.error('Failed to register for event', 500, error.message)
      }
      
      return NextResponse.json(response, { status: response.statusCode })
    }
  }
}

const eventController = new EventController()
export { eventController as EventController }
export default eventController

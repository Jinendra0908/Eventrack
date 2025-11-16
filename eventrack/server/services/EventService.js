import Event from '../../models/Event'
import User from '../../models/User'
import { EVENT_STATUS, EVENT_VISIBILITY } from '../config/constants'
import { config } from '../config'

/**
 * EventService - Handles event business logic
 */
class EventService {
  /**
   * Get all events with filtering and pagination
   */
  async getEvents(filters = {}) {
    const {
      category,
      search,
      visibility = EVENT_VISIBILITY.PUBLIC,
      limit = config.pagination.defaultLimit,
      page = 1
    } = filters
    
    const query = { isActive: true }
    
    // Only show public events by default (unless authenticated user requests their own)
    if (visibility === EVENT_VISIBILITY.PUBLIC) {
      query.visibility = EVENT_VISIBILITY.PUBLIC
      query.status = EVENT_STATUS.PUBLISHED
    }
    
    // Category filter
    if (category && category !== 'All') {
      if (category === 'Trending') {
        query.isFeatured = true
      } else {
        query.category = category
      }
    }
    
    // Search filter
    if (search) {
      query.$text = { $search: search }
    }
    
    const skip = (page - 1) * limit
    
    const events = await Event.find(query)
      .populate('organizer.userId', 'username firstName lastName avatar')
      .sort(search ? { score: { $meta: 'textScore' } } : { createdAt: -1 })
      .skip(skip)
      .limit(limit)
    
    const total = await Event.countDocuments(query)
    
    return {
      events,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    }
  }
  
  /**
   * Get event by ID
   */
  async getEventById(eventId) {
    const event = await Event.findById(eventId)
      .populate('organizer.userId', 'username firstName lastName avatar')
      .populate('coHosts.userId', 'username firstName lastName avatar')
    
    if (!event) {
      throw new Error('Event not found')
    }
    
    return event
  }
  
  /**
   * Get events created by a specific host
   */
  async getHostEvents(userId) {
    const events = await Event.find({
      'organizer.userId': userId
    }).sort({ createdAt: -1 })
    
    return events
  }
  
  /**
   * Create new event
   */
  async createEvent(userId, eventData) {
    // Get user info for organizer field
    const user = await User.findById(userId)
    
    if (!user) {
      throw new Error('User not found')
    }
    
    if (user.role !== 'host') {
      throw new Error('Only hosts can create events')
    }
    
    // Prepare event data with organizer
    const newEventData = {
      ...eventData,
      organizer: {
        userId: user._id,
        name: `${user.firstName} ${user.lastName}`,
        avatar: user.avatar
      },
      image: eventData.image || 'https://images.pexels.com/photos/2747449/pexels-photo-2747449.jpeg'
    }
    
    // Create event
    const event = await Event.create(newEventData)
    
    // Add to user's createdEvents
    await User.findByIdAndUpdate(
      userId,
      { $push: { createdEvents: event._id } }
    )
    
    const populatedEvent = await Event.findById(event._id)
      .populate('organizer.userId', 'username firstName lastName avatar')
    
    return populatedEvent
  }
  
  /**
   * Update event
   */
  async updateEvent(eventId, userId, updateData) {
    const event = await Event.findById(eventId)
    
    if (!event) {
      throw new Error('Event not found')
    }
    
    // Check permissions
    const isOrganizer = event.organizer.userId.toString() === userId
    const isCoHostWithPermission = event.coHosts?.some(
      coHost => coHost.userId.toString() === userId && coHost.permissions.canEdit
    )
    
    if (!isOrganizer && !isCoHostWithPermission) {
      throw new Error('You do not have permission to edit this event')
    }
    
    // Update event
    const updatedEvent = await Event.findByIdAndUpdate(
      eventId,
      { $set: updateData },
      { new: true, runValidators: true }
    )
      .populate('organizer.userId', 'username firstName lastName avatar')
      .populate('coHosts.userId', 'username firstName lastName avatar')
    
    return updatedEvent
  }
  
  /**
   * Delete event
   */
  async deleteEvent(eventId, userId) {
    const event = await Event.findById(eventId)
    
    if (!event) {
      throw new Error('Event not found')
    }
    
    // Check permissions
    const isOrganizer = event.organizer.userId.toString() === userId
    const isCoHostWithPermission = event.coHosts?.some(
      coHost => coHost.userId.toString() === userId && coHost.permissions.canCancel
    )
    
    if (!isOrganizer && !isCoHostWithPermission) {
      throw new Error('You do not have permission to delete this event')
    }
    
    // Delete event
    await Event.findByIdAndDelete(eventId)
    
    // Remove from organizer's createdEvents
    await User.findByIdAndUpdate(
      event.organizer.userId,
      { $pull: { createdEvents: eventId } }
    )
    
    // Remove from all users' savedEvents
    await User.updateMany(
      { savedEvents: eventId },
      { $pull: { savedEvents: eventId } }
    )
    
    return { message: 'Event deleted successfully' }
  }
  
  /**
   * Toggle save event for user
   */
  async toggleSaveEvent(userId, eventId) {
    const user = await User.findById(userId)
    const event = await Event.findById(eventId)
    
    if (!event) {
      throw new Error('Event not found')
    }
    
    const isSaved = user.savedEvents.includes(eventId)
    
    if (isSaved) {
      await User.findByIdAndUpdate(
        userId,
        { $pull: { savedEvents: eventId } }
      )
      return { saved: false, message: 'Event removed from saved' }
    } else {
      await User.findByIdAndUpdate(
        userId,
        { $push: { savedEvents: eventId } }
      )
      return { saved: true, message: 'Event saved successfully' }
    }
  }
  
  /**
   * Register user for an event
   */
  async registerUserForEvent(eventId, userId) {
    const event = await Event.findById(eventId)
    
    if (!event) {
      throw new Error('Event not found')
    }
    
    // Check if user is already registered
    const isAlreadyRegistered = event.attendees.some(
      attendee => attendee.toString() === userId
    )
    
    if (isAlreadyRegistered) {
      throw new Error('You are already registered for this event')
    }
    
    // Check if event is at capacity
    if (event.maxAttendees && event.attendees.length >= event.maxAttendees) {
      throw new Error('Event is at full capacity')
    }
    
    // Get user data
    const user = await User.findById(userId)
    if (!user) {
      throw new Error('User not found')
    }
    
    // Add user to event attendees
    event.attendees.push(userId)
    await event.save()
    
    // Optionally add event to user's registered events
    // (if you have a registeredEvents field in User model)
    // await User.findByIdAndUpdate(userId, { $push: { registeredEvents: eventId } })
    
    return {
      event: {
        id: event._id,
        title: event.title,
        date: event.date,
        venue: event.venue
      },
      attendeeCount: event.attendees.length
    }
  }
}

export default new EventService()

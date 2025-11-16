import { NextResponse } from 'next/server'
import dbConnect from '../../../../lib/mongodb'
import User from '../../../../models/User'
import Event from '../../../../models/Event'

// GET - Get user's saved events
export async function GET(request) {
  try {
    await dbConnect()
    
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      )
    }
    
    const user = await User.findById(userId)
      .populate({
        path: 'savedEvents',
        populate: {
          path: 'organizer.userId',
          select: 'username firstName lastName avatar'
        }
      })
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ 
      success: true, 
      data: user.savedEvents || [] 
    })
  } catch (error) {
    console.error('Error fetching saved events:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch saved events', details: error.message },
      { status: 500 }
    )
  }
}

// POST - Save/unsave event
export async function POST(request) {
  try {
    await dbConnect()
    
    const { userId, eventId, action } = await request.json()
    
    if (!userId || !eventId || !action) {
      return NextResponse.json(
        { success: false, error: 'userId, eventId, and action are required' },
        { status: 400 }
      )
    }
    
    if (!['save', 'unsave'].includes(action)) {
      return NextResponse.json(
        { success: false, error: 'Action must be "save" or "unsave"' },
        { status: 400 }
      )
    }
    
    const user = await User.findById(userId)
    const event = await Event.findById(eventId)
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }
    
    if (!event) {
      return NextResponse.json(
        { success: false, error: 'Event not found' },
        { status: 404 }
      )
    }
    
    if (action === 'save') {
      if (!user.savedEvents.includes(eventId)) {
        user.savedEvents.push(eventId)
        await user.save()
        
        return NextResponse.json({
          success: true,
          message: 'Event saved successfully',
          data: { saved: true }
        })
      } else {
        return NextResponse.json({
          success: true,
          message: 'Event already saved',
          data: { saved: true }
        })
      }
    } else {
      user.savedEvents = user.savedEvents.filter(id => id.toString() !== eventId)
      await user.save()
      
      return NextResponse.json({
        success: true,
        message: 'Event removed from saved',
        data: { saved: false }
      })
    }
  } catch (error) {
    console.error('Error saving/unsaving event:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to save/unsave event', details: error.message },
      { status: 500 }
    )
  }
}

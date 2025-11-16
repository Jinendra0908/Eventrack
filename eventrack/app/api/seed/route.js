import { NextResponse } from 'next/server'
import dbConnect from '../../../lib/mongodb'
import User from '../../../models/User'
import Event from '../../../models/Event'
import bcrypt from 'bcryptjs'

export async function POST(request) {
  try {
    await dbConnect()
    
    // Clear existing data (optional - remove in production)
    await User.deleteMany({})
    await Event.deleteMany({})
    
    console.log('🗑️ Cleared existing data')
    
    // Create sample users
    const hashedPassword = await bcrypt.hash('password123', 12)
    
    const users = await User.create([
      {
        username: 'jinendra',
        email: 'jinendra@eventrack.com',
        firstName: 'Jinendra',
        lastName: 'Sharma',
        password: hashedPassword,
        bio: 'Event organizer and tech enthusiast',
        hobbies: ['Technology', 'Music', 'Sports']
      },
      {
        username: 'techevents',
        email: 'tech@events.com',
        firstName: 'Tech',
        lastName: 'Events',
        password: hashedPassword,
        bio: 'Professional event organizers since 2010',
        hobbies: ['Technology', 'Business']
      },
      {
        username: 'musicmaker',
        email: 'music@events.com',
        firstName: 'Music',
        lastName: 'Maker',
        password: hashedPassword,
        bio: 'Creating amazing musical experiences',
        hobbies: ['Music', 'Art']
      },
      {
        username: 'gamesmaster',
        email: 'games@events.com',
        firstName: 'Game',
        lastName: 'Master',
        password: hashedPassword,
        bio: 'Gaming events and tournaments',
        hobbies: ['Gaming', 'Technology']
      }
    ])
    
    console.log('👥 Created sample users')
    
    // Create sample events
    const events = await Event.create([
      {
        title: 'Summer Music Festival 2025',
        description: 'Join us for the biggest music event of the year with amazing artists and unforgettable performances!',
        image: 'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg',
        date: 'December 15, 2025',
        time: '6:00 PM',
        location: 'Bhopal',
        venue: 'City Stadium',
        price: '150',
        category: 'Music',
        isFeatured: true,
        organizer: {
          userId: users[2]._id,
          name: `${users[2].firstName} ${users[2].lastName}`,
          avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg'
        },
        tags: ['music', 'festival', 'live', 'summer']
      },
      {
        title: 'Future Tech Conference 2025',
        description: 'Exploring the latest in AI, blockchain technology, and the future of digital innovation',
        image: 'https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg',
        date: 'November 22, 2025',
        time: '9:00 AM',
        location: 'Indore',
        venue: 'Convention Center',
        price: '299',
        category: 'Technology',
        isFeatured: true,
        organizer: {
          userId: users[1]._id,
          name: `${users[1].firstName} ${users[1].lastName}`,
          avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg'
        },
        tags: ['technology', 'AI', 'blockchain', 'innovation']
      },
      {
        title: 'Modern Art Exhibition',
        description: 'Showcasing contemporary artists from around the world with stunning visual displays',
        image: 'https://images.pexels.com/photos/248159/pexels-photo-248159.jpeg',
        date: 'October 25, 2025',
        time: '11:00 AM',
        location: 'Bhopal',
        venue: 'Art Gallery Complex',
        price: '45',
        category: 'Art',
        organizer: {
          userId: users[0]._id,
          name: `${users[0].firstName} ${users[0].lastName}`,
          avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg'
        },
        tags: ['art', 'exhibition', 'contemporary', 'gallery']
      },
      {
        title: 'Gaming Championship 2025',
        description: 'Ultimate esports tournament with massive prizes and the best gamers from around the country',
        image: 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg',
        date: 'December 10, 2025',
        time: '2:00 PM',
        location: 'Delhi',
        venue: 'Gaming Arena Hub',
        price: '75',
        category: 'Gaming',
        organizer: {
          userId: users[3]._id,
          name: `${users[3].firstName} ${users[3].lastName}`,
          avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg'
        },
        tags: ['gaming', 'esports', 'tournament', 'competition']
      },
      {
        title: 'Marathon Championship',
        description: 'Annual city marathon for fitness enthusiasts with prizes for different categories',
        image: 'https://images.pexels.com/photos/618612/pexels-photo-618612.jpeg',
        date: 'November 15, 2025',
        time: '6:00 AM',
        location: 'Mumbai',
        venue: 'Marine Drive',
        price: '120',
        category: 'Sports',
        organizer: {
          userId: users[2]._id,
          name: `${users[2].firstName} ${users[2].lastName}`,
          avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg'
        },
        tags: ['sports', 'marathon', 'fitness', 'running']
      },
      {
        title: 'Startup Pitch Night',
        description: 'Innovative startups presenting their groundbreaking ideas to investors and venture capitalists',
        image: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg',
        date: 'December 20, 2025',
        time: '7:00 PM',
        location: 'Bangalore',
        venue: 'Business Hub Center',
        price: '199',
        category: 'Business',
        organizer: {
          userId: users[0]._id,
          name: `${users[0].firstName} ${users[0].lastName}`,
          avatar: 'https://images.pexels.com/photos/3778966/pexels-photo-3778966.jpeg'
        },
        tags: ['business', 'startup', 'investment', 'pitch']
      }
    ])
    
    console.log('🎪 Created sample events')
    
    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully!',
      data: {
        users: users.length,
        events: events.length
      }
    })
    
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to seed database', details: error.message },
      { status: 500 }
    )
  }
}

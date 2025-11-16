import mongoose from 'mongoose'

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Event description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  image: {
    type: String,
    required: [true, 'Event image is required']
  },
  poster: {
    type: String,
    default: null // Additional poster/flyer image
  },
  date: {
    type: String,
    required: [true, 'Event date is required']
  },
  time: {
    type: String,
    default: '10:00 AM'
  },
  location: {
    type: String,
    required: [true, 'Event location is required'],
    trim: true
  },
  venue: {
    type: String,
    required: [true, 'Event venue is required'],
    trim: true
  },
  price: {
    type: String,
    required: [true, 'Event price is required'],
    default: '0'
  },
  ticketType: {
    type: String,
    enum: ['free', 'paid'],
    default: 'free'
  },
  ticketPrice: {
    type: Number,
    default: 0
  },
  ticketDetails: {
    type: String,
    maxlength: [500, 'Ticket details cannot exceed 500 characters'],
    default: ''
  },
  category: {
    type: String,
    required: [true, 'Event category is required'],
    enum: ['Technology', 'Music', 'Art', 'Sports', 'Gaming', 'Business', 'Food & Drink', 'General', 'Trending']
  },
  visibility: {
    type: String,
    enum: ['public', 'private', 'invite-only'],
    default: 'public'
  },
  organizer: {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    avatar: {
      type: String,
      required: true
    }
  },
  coHosts: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    name: {
      type: String,
      required: true
    },
    avatar: {
      type: String,
      required: true
    },
    permissions: {
      canEdit: {
        type: Boolean,
        default: false
      },
      canManageAttendees: {
        type: Boolean,
        default: false
      },
      canCancel: {
        type: Boolean,
        default: false
      }
    }
  }],
  attendees: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  invitedUsers: [{ // For invite-only events
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  maxAttendees: {
    type: Number,
    default: null
  },
  tags: [{
    type: String
  }],
  status: {
    type: String,
    enum: ['draft', 'published', 'cancelled', 'completed'],
    default: 'published'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
})

// Add indexes for better query performance
eventSchema.index({ category: 1 })
eventSchema.index({ title: 'text', description: 'text', location: 'text' })
eventSchema.index({ createdAt: -1 })

// Prevent model re-compilation during development
export default mongoose.models.Event || mongoose.model('Event', eventSchema)

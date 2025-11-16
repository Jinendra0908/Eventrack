import mongoose from 'mongoose'

const notificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Notification title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  subtitle: {
    type: String,
    required: [true, 'Notification subtitle is required'],
    trim: true,
    maxlength: [200, 'Subtitle cannot exceed 200 characters']
  },
  dueDate: {
    type: String,
    required: [true, 'Due date is required']
  },
  targetDate: {
    type: Date,
    required: [true, 'Target date is required']
  },
  priority: {
    type: String,
    enum: ['urgent', 'warning', 'normal'],
    default: 'normal'
  },
  type: {
    type: String,
    enum: ['deadline', 'alarm', 'reminder', 'event'],
    required: [true, 'Notification type is required']
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    default: null
  },
  isRead: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
})

// Add indexes for better query performance
notificationSchema.index({ userId: 1, isRead: 1 })
notificationSchema.index({ createdAt: -1 })

// Prevent model re-compilation during development
export default mongoose.models.Notification || mongoose.model('Notification', notificationSchema)

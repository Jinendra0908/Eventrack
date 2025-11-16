import User from '../../models/User'

/**
 * UserService - Handles user-related business logic
 */
class UserService {
  /**
   * Search users by query
   */
  async searchUsers(query, currentUserId, limit = 10) {
    if (!query || query.length < 2) {
      return []
    }
    
    const searchRegex = new RegExp(query, 'i')
    
    const users = await User.find({
      _id: { $ne: currentUserId },
      $or: [
        { firstName: searchRegex },
        { lastName: searchRegex },
        { username: searchRegex },
        { email: searchRegex }
      ]
    })
      .select('_id firstName lastName username avatar email')
      .limit(limit)
    
    return users.map(user => ({
      id: user._id,
      name: `${user.firstName} ${user.lastName}`,
      username: user.username,
      email: user.email,
      avatar: user.avatar
    }))
  }
  
  /**
   * Get user profile
   */
  async getUserProfile(userId) {
    const user = await User.findById(userId)
      .select('-password')
      .populate('createdEvents')
      .populate('savedEvents')
    
    if (!user) {
      throw new Error('User not found')
    }
    
    return user
  }
  
  /**
   * Get user's saved events
   */
  async getSavedEvents(userId) {
    const user = await User.findById(userId).populate({
      path: 'savedEvents',
      populate: {
        path: 'organizer.userId',
        select: 'username firstName lastName avatar'
      }
    })
    
    if (!user) {
      throw new Error('User not found')
    }
    
    return user.savedEvents
  }
  
  /**
   * Update user's hobbies/preferences
   */
  async updateHobbies(userId, hobbies) {
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: { hobbies } },
      { new: true }
    ).select('-password')
    
    if (!user) {
      throw new Error('User not found')
    }
    
    return user
  }
}

export default new UserService()

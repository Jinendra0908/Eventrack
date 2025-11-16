import { ApiResponse } from '../utils/apiResponse'
import { validateRequiredFields } from '../utils/helpers'

/**
 * Validate login request
 */
export const validateLogin = (data) => {
  const validation = validateRequiredFields(data, ['email', 'password'])
  
  if (!validation.isValid) {
    return ApiResponse.badRequest(`Missing required fields: ${validation.missing.join(', ')}`)
  }
  
  return null
}

/**
 * Validate registration request
 */
export const validateRegistration = (data) => {
  const requiredFields = ['username', 'email', 'password', 'firstName', 'lastName', 'role']
  const validation = validateRequiredFields(data, requiredFields)
  
  if (!validation.isValid) {
    return ApiResponse.badRequest(`Missing required fields: ${validation.missing.join(', ')}`)
  }
  
  // Email validation
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
  if (!emailRegex.test(data.email)) {
    return ApiResponse.badRequest('Invalid email format')
  }
  
  // Password validation
  if (data.password.length < 6) {
    return ApiResponse.badRequest('Password must be at least 6 characters long')
  }
  
  return null
}

/**
 * Validate event creation request
 */
export const validateEventCreation = (data) => {
  const requiredFields = ['title', 'description', 'date', 'location', 'venue', 'category']
  const validation = validateRequiredFields(data, requiredFields)
  
  if (!validation.isValid) {
    return ApiResponse.badRequest(`Missing required fields: ${validation.missing.join(', ')}`)
  }
  
  return null
}

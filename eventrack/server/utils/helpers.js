/**
 * Async handler wrapper to catch errors in async route handlers
 */
export const asyncHandler = (fn) => {
  return async (req, ...args) => {
    try {
      return await fn(req, ...args)
    } catch (error) {
      console.error('Async handler error:', error)
      throw error
    }
  }
}

/**
 * Validation helper
 */
export const validateRequiredFields = (data, requiredFields) => {
  const missing = []
  
  for (const field of requiredFields) {
    if (!data[field]) {
      missing.push(field)
    }
  }
  
  if (missing.length > 0) {
    return {
      isValid: false,
      missing
    }
  }
  
  return { isValid: true }
}

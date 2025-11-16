import { HTTP_STATUS } from '../config/constants'

/**
 * API Response utility functions
 */
export class ApiResponse {
  static success(data, message = 'Success', statusCode = HTTP_STATUS.OK) {
    return {
      success: true,
      message,
      data,
      statusCode
    }
  }

  static error(message, statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR, details = null) {
    return {
      success: false,
      message,
      ...(details && { details }),
      statusCode
    }
  }

  static created(data, message = 'Created successfully') {
    return this.success(data, message, HTTP_STATUS.CREATED)
  }

  static badRequest(message = 'Bad request', details = null) {
    return this.error(message, HTTP_STATUS.BAD_REQUEST, details)
  }

  static unauthorized(message = 'Unauthorized') {
    return this.error(message, HTTP_STATUS.UNAUTHORIZED)
  }

  static forbidden(message = 'Forbidden') {
    return this.error(message, HTTP_STATUS.FORBIDDEN)
  }

  static notFound(message = 'Resource not found') {
    return this.error(message, HTTP_STATUS.NOT_FOUND)
  }

  static validationError(errors) {
    return this.error('Validation failed', HTTP_STATUS.BAD_REQUEST, errors)
  }
}

/**
 * Send API response
 */
export const sendResponse = (res, response) => {
  return res.status(response.statusCode).json(response)
}

// Application constants
export const USER_ROLES = {
  PARTICIPANT: 'participant',
  HOST: 'host'
}

export const EVENT_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed'
}

export const EVENT_VISIBILITY = {
  PUBLIC: 'public',
  PRIVATE: 'private',
  INVITE_ONLY: 'invite-only'
}

export const TICKET_TYPES = {
  FREE: 'free',
  PAID: 'paid'
}

export const EVENT_CATEGORIES = [
  'Technology',
  'Music',
  'Art',
  'Sports',
  'Gaming',
  'Business',
  'Food & Drink',
  'General',
  'Trending'
]

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
}

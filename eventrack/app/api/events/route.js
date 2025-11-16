import EventController from '../../../server/controllers/EventController'

export async function GET(request) {
  return await EventController.getEvents(request)
}

export async function POST(request) {
  return await EventController.createEvent(request)
}

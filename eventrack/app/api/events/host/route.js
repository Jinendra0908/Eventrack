import EventController from '../../../../server/controllers/EventController'

export async function GET(request) {
  return await EventController.getHostEvents(request)
}

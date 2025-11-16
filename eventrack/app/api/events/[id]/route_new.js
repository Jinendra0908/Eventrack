import EventController from '../../../../server/controllers/EventController'

export async function GET(request, context) {
  return await EventController.getEventById(request, context)
}

export async function PUT(request, context) {
  return await EventController.updateEvent(request, context)
}

export async function DELETE(request, context) {
  return await EventController.deleteEvent(request, context)
}

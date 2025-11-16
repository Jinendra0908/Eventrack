import EventController from '../../../../server/controllers/EventController'

// GET - Get specific event
export async function GET(request, { params }) {
  const resolvedParams = await params
  return await EventController.getEventById(request, resolvedParams)
}

// PUT - Update event
export async function PUT(request, { params }) {
  const resolvedParams = await params
  return await EventController.updateEvent(request, resolvedParams)
}

// DELETE - Delete event
export async function DELETE(request, { params }) {
  const resolvedParams = await params
  return await EventController.deleteEvent(request, resolvedParams)
}
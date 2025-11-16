import { EventController } from '../../../../../server/controllers/EventController'

export async function POST(request, { params }) {
  const resolvedParams = await params
  return EventController.registerForEvent(request, resolvedParams)
}

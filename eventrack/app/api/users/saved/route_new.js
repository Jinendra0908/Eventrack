import UserController from '../../../../server/controllers/UserController'

export async function GET(request) {
  return await UserController.getSavedEvents(request)
}

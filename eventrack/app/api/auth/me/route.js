import AuthController from '../../../../server/controllers/AuthController'

export async function GET(request) {
  return await AuthController.getCurrentUser(request)
}

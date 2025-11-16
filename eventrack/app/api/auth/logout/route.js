import AuthController from '../../../../server/controllers/AuthController'

export async function POST(request) {
  return await AuthController.logout(request)
}

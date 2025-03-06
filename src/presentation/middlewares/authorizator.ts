import { AuthorizatorUseCase } from '../../domain/use-cases/auth/authorizator';
import { errorResponse, serverResponse } from '../helpers/response-builder';
import { Controller } from '../protocols/controller';
import { PresentationRequest, PresentationResponse } from '../protocols/reqRes';


export class AuthorizatorMiddleware implements Controller {
  constructor(private readonly authorizator: AuthorizatorUseCase) {}

  async handle(request: PresentationRequest): Promise<PresentationResponse> {
    try { 
      const { headers } = request;
      const loggedUser = await this.authorizator.isAuthorized(headers.authorization);
      if (!loggedUser) {
        return serverResponse({
          code: 401,
          data: {},
        });
      }
      request.currentUser = loggedUser;
      return serverResponse({
        data: loggedUser,
      });
    } catch (error) {
      return errorResponse(error);
    }
  }
}
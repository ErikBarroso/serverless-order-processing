import { LoginUseCase } from '../../../domain/use-cases/auth/login';
import { errorResponse, successResponse } from '../../helpers/response-builder';
import { Controller } from '../../protocols/controller';
import { PresentationRequest, PresentationResponse } from '../../protocols/reqRes';

export class LoginController implements Controller {
  public constructor( private readonly useCase: LoginUseCase ) {}

  public async handle(request: PresentationRequest ): Promise<PresentationResponse> {
    try {
      const { email, password } = request.body;
      const result = await this.useCase.exec(email, password);
      return successResponse(result);    
    } catch (error) {
      return errorResponse(error);  
    }
  }
}
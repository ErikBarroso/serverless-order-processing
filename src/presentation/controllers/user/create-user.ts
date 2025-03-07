import { CreateUserUseCase } from '../../../domain/use-cases/user/create-user';
import { errorResponse, serverResponse } from '../../helpers/response-builder';
import { Controller } from '../../protocols/controller';
import { PresentationRequest, PresentationResponse } from '../../protocols/reqRes';


export class CreateUserController implements Controller {
  constructor( private readonly useCase: CreateUserUseCase ) {}

  async handle(request: PresentationRequest): Promise<PresentationResponse> {
    const { name, email, password } = request.body;
    const user = { name, email, password };
    try {
      const result = await this.useCase.exec(user);
      return serverResponse(result);      
    } catch (error) {
      return errorResponse(error);    
    }
  }
}
import { FindOrdersUseCase } from '../../../domain/use-cases/order/find-orders';
import { errorResponse, serverResponse } from '../../helpers/response-builder';
import { Controller } from '../../protocols/controller';
import { PresentationRequest, PresentationResponse } from '../../protocols/reqRes';


export class FindOrdersController implements Controller {
  constructor( private readonly useCase: FindOrdersUseCase ) {}

  async handle(request: PresentationRequest): Promise<PresentationResponse> {
    const userId = request.currentUser as string;
    try {
      const result = await this.useCase.exec(userId);
      return serverResponse(result);      
    } catch (error) {
      return errorResponse(error);    
    }
  }
}
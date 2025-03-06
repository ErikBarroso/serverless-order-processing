import { DeleteOrderUseCase } from '../../../domain/use-cases/order/delete-order';
import { errorResponse, serverResponse } from '../../helpers/response-builder';
import { Controller } from '../../protocols/controller';
import { PresentationRequest, PresentationResponse } from '../../protocols/reqRes';


export class DeleteOrderController implements Controller {
  constructor( private readonly useCase: DeleteOrderUseCase) {}

  async handle(request: PresentationRequest): Promise<PresentationResponse> {
    const { id }  = request.params;
    const userId = request.currentUser as string;
    try {
      const result = await this.useCase.exec(id, userId);
      return serverResponse(result);      
    } catch (error) {
      return errorResponse(error);    
    }
  }
}
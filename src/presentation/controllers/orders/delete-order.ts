import { DeleteOrderUseCase } from '../../../domain/use-cases/order/delete-order';
import { errorResponse, serverResponse } from '../../helpers/response-builder';
import { Controller } from '../../protocols/controller';
import { PresentationRequest, PresentationResponse } from '../../protocols/reqRes';


export class DeleteOrderController implements Controller {
  constructor( private readonly useCase: DeleteOrderUseCase) {}

  async handle(request: PresentationRequest): Promise<PresentationResponse> {
    const { items } = request.body;
    const userId = request.currentUser as string;
    try {
      const result = await this.useCase.exec(items, userId);
      return serverResponse(result);      
    } catch (error) {
      return errorResponse(error);    
    }
  }
}
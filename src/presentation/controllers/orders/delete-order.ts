import { DeleteOrderUseCase } from '../../../domain/use-cases/order/delete-order';
import { errorResponse, successResponse } from '../../helpers/response-builder';
import { Controller } from '../../protocols/controller';
import { PresentationRequest, PresentationResponse } from '../../protocols/reqRes';


export class DeleteOrderController implements Controller {
  constructor( private readonly useCase: DeleteOrderUseCase) {}

  async handle(request: PresentationRequest): Promise<PresentationResponse> {
    const { id } = request.params;
    const {  customerId } = request.body;
    try {
      // dps pegar o user logado
      const result = await this.useCase.exec(id, customerId);
      return successResponse(result);      
    } catch (error) {
      return errorResponse(error);    
    }
  }
}
import { CreateOrderUseCase } from '../../../domain/use-cases/order/create-order';
import { errorResponse, successResponse } from '../../helpers/response-builder';
import { Controller } from '../../protocols/controller';
import { PresentationRequest, PresentationResponse } from '../../protocols/reqRes';


export class CreateOrderController implements Controller {
  constructor( private readonly useCase: CreateOrderUseCase) {}

  async handle(request: PresentationRequest): Promise<PresentationResponse> {
    const { items, customerId } = request.body;
    try {
      // dps pegar o user logado
      const result = await this.useCase.exec(items, customerId);
      return successResponse(result);      
    } catch (error) {
      return errorResponse(error);    
    }
  }
}
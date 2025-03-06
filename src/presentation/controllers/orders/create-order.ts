import { CreateOrderUseCase } from '../../../domain/use-cases/order/create-order';
import { errorResponse, serverResponse } from '../../helpers/response-builder';
import { Controller } from '../../protocols/controller';
import { PresentationRequest, PresentationResponse } from '../../protocols/reqRes';


export class CreateOrderController implements Controller {
  constructor( private readonly useCase: CreateOrderUseCase) {}

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
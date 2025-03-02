import { GetOrderByIdUseCase } from '../../../domain/use-cases/order/get-order-by-id';
import { errorResponse, successResponse } from '../../helpers/response-builder';
import { Controller } from '../../protocols/controller';
import { PresentationRequest, PresentationResponse } from '../../protocols/reqRes';


export class GetOrderByIdController implements Controller {
  constructor( private readonly useCase: GetOrderByIdUseCase) {}

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
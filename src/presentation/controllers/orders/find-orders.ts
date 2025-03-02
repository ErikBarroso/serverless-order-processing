import { FindOrdersUseCase } from '../../../domain/use-cases/order/find-orders';
import { errorResponse, successResponse } from '../../helpers/response-builder';
import { Controller } from '../../protocols/controller';
import { PresentationRequest, PresentationResponse } from '../../protocols/reqRes';


export class FindOrdersController implements Controller {
  constructor( private readonly useCase: FindOrdersUseCase ) {}

  async handle(request: PresentationRequest): Promise<PresentationResponse> {
    const { customerId } = request.body;
    try {
      // dps pegar o user logado
      const result = await this.useCase.exec(customerId);
      return successResponse(result);      
    } catch (error) {
      return errorResponse(error);    
    }
  }
}
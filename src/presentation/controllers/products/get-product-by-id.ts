import { GetProductByIdUseCase } from '../../../domain/use-cases/product/get-product-by-id';
import { errorResponse, serverResponse } from '../../helpers/response-builder';
import { Controller } from '../../protocols/controller';
import { PresentationRequest, PresentationResponse } from '../../protocols/reqRes';


export class GetProductByIdController implements Controller {
  constructor( private readonly useCase: GetProductByIdUseCase) {}

  async handle(request: PresentationRequest): Promise<PresentationResponse> {
    const { id } = request.params;
    try {
      const result = await this.useCase.exec(id);
      return serverResponse(result);      
    } catch (error) {
      return errorResponse(error);    
    }
  }
}
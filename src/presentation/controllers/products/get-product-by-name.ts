import { GetProductByNameUseCase } from '../../../domain/use-cases/product/get-product-by-name';
import { errorResponse, serverResponse } from '../../helpers/response-builder';
import { Controller } from '../../protocols/controller';
import { PresentationRequest, PresentationResponse } from '../../protocols/reqRes';


export class GetProductByNameController implements Controller {
  constructor( private readonly useCase: GetProductByNameUseCase) {}

  async handle(request: PresentationRequest): Promise<PresentationResponse> {
    const { name } = request.params;
    try {
      const result = await this.useCase.exec(name);
      return serverResponse(result);      
    } catch (error) {
      return errorResponse(error);    
    }
  }
}
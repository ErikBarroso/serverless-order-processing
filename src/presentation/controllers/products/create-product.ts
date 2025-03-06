import { CreateProductUseCase } from '../../../domain/use-cases/product/create-product';
import { errorResponse, serverResponse } from '../../helpers/response-builder';
import { Controller } from '../../protocols/controller';
import { PresentationRequest, PresentationResponse } from '../../protocols/reqRes';


export class CreateProductController implements Controller {
  constructor( private readonly useCase: CreateProductUseCase) {}

  async handle(request: PresentationRequest): Promise<PresentationResponse> {
    const { name, price, stock } = request.body;
    const product = { name, price, stock };
    try {
      const result = await this.useCase.exec(product);
      return serverResponse(result);      
    } catch (error) {
      return errorResponse(error);    
    }
  }
}
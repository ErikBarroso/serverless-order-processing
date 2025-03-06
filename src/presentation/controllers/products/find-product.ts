import { FindProductsUseCase } from '../../../domain/use-cases/product/find-products';
import { errorResponse, serverResponse } from '../../helpers/response-builder';
import { Controller } from '../../protocols/controller';
import { PresentationRequest, PresentationResponse } from '../../protocols/reqRes';


export class FindProductsController implements Controller {
  constructor( private readonly useCase: FindProductsUseCase ) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async handle(request: PresentationRequest): Promise<PresentationResponse> {
    try {
      const result = await this.useCase.exec();
      return serverResponse(result);      
    } catch (error) {
      return errorResponse(error);    
    }
  }
}
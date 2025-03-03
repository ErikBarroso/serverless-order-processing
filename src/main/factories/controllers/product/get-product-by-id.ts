import { GetProductByIdUseCaseImpl } from '../../../../data/useCases/product/get-product';
import { DynamoProductRepository } from '../../../../infrastructure/repositories/dynamo/product';
import { GetProductByIdController } from '../../../../presentation/controllers/products/get-product-by-id';

export default (): GetProductByIdController => {
  const repo = new DynamoProductRepository();
  const useCase = new GetProductByIdUseCaseImpl(
    repo,
  );
  const controller = new GetProductByIdController(
    useCase,
  );
  return controller;
};
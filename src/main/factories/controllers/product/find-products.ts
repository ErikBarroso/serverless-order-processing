import { FindProductsUseCaseImpl } from '../../../../data/use-cases/product/find-products';
import { DynamoProductRepository } from '../../../../infrastructure/repositories/dynamo/product';
import { FindProductsController } from '../../../../presentation/controllers/products/find-product';

export default (): FindProductsController => {
  const repo = new DynamoProductRepository();
  const useCase = new FindProductsUseCaseImpl(
    repo,
  );
  const controller = new FindProductsController(
    useCase,
  );
  return controller;
};
import { DeleteProductUseCaseImpl } from '../../../../data/use-cases/product/delete-product';
import { DynamoProductRepository } from '../../../../infrastructure/repositories/dynamo/product';
import { DeleteProductController } from '../../../../presentation/controllers/products/delete-product';

export default (): DeleteProductController => {
  const repo = new DynamoProductRepository();
  const useCase = new DeleteProductUseCaseImpl(
    repo,
  );
  const controller = new DeleteProductController(
    useCase,
  );
  return controller;
};
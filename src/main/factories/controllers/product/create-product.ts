import { CreateProductUseCaseImpl } from '../../../../data/use-cases/product/create-product';
import { DynamoProductRepository } from '../../../../infrastructure/repositories/dynamo/product';
import { CreateProductController } from '../../../../presentation/controllers/products/create-product';

export default (): CreateProductController => {
  const repo = new DynamoProductRepository();
  const useCase = new CreateProductUseCaseImpl(
    repo,
  );
  const controller = new CreateProductController(
    useCase,
  );
  return controller;
};
import { GetProductByNameUseCaseImpl } from '../../../../data/use-cases/product/get-product-by-name';
import { DynamoProductRepository } from '../../../../infrastructure/repositories/dynamo/product';
import { GetProductByNameController } from '../../../../presentation/controllers/products/get-product-by-name';

export default (): GetProductByNameController => {
  const repo = new DynamoProductRepository();
  const useCase = new GetProductByNameUseCaseImpl(
    repo,
  );
  const controller = new GetProductByNameController(
    useCase,
  );
  return controller;
};
import { CreateOrderUseCaseImpl } from '../../../data/use-cases/order/create-orders';
import { DynamoOrderRepository } from '../../../infrastructure/repositories/dynamo/order';
import { DynamoProductRepository } from '../../../infrastructure/repositories/dynamo/product';
import { CreateOrderController } from '../../../presentation/controllers/orders/create-order';

export default (): CreateOrderController => {
  const odersRepo = new DynamoOrderRepository();
  const productRepo = new DynamoProductRepository();
  const useCase = new CreateOrderUseCaseImpl(
    odersRepo,
    productRepo,
  );
  const controller = new CreateOrderController(
    useCase,
  );
  return controller;
};
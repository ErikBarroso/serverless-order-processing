import { CreateOrderUseCaseImpl } from '../../../data/use-cases/order/create-orders';
import { DynamoOrderRepository } from '../../../infrastructure/repositories/dynamo/order';
import { CreateOrderController } from '../../../presentation/controllers/orders/create-order';

export default (): CreateOrderController => {
  const repo = new DynamoOrderRepository();
  const useCase = new CreateOrderUseCaseImpl(
    repo,
  );
  const controller = new CreateOrderController(
    useCase,
  );
  return controller;
};
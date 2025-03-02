import { DeleteOrderUseCaseImpl } from '../../../data/useCases/order/delete-orders';
import { DynamoOrderRepository } from '../../../infrastructure/repositories/dynamo/order';
import { DeleteOrderController } from '../../../presentation/controllers/orders/delete-order';

export default (): DeleteOrderController => {
  const repo = new DynamoOrderRepository();
  const useCase = new DeleteOrderUseCaseImpl(
    repo,
  );
  const controller = new DeleteOrderController(
    useCase,
  );
  return controller;
};
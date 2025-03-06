import { FindOrdersUseCaseImpl } from '../../../data/use-cases/order/find-orders';
import { DynamoOrderRepository } from '../../../infrastructure/repositories/dynamo/order';
import { FindOrdersController } from '../../../presentation/controllers/orders/find-orders';

export default (): FindOrdersController => {
  const repo = new DynamoOrderRepository();
  const useCase = new FindOrdersUseCaseImpl(
    repo,
  );
  const controller = new FindOrdersController(
    useCase,
  );
  return controller;
};
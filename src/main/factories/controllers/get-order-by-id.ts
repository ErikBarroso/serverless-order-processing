import { GetOrderByIdUseCaseImpl } from '../../../data/useCases/order/get-order';
import { DynamoOrderRepository } from '../../../infrastructure/repositories/dynamo/order';
import { GetOrderByIdController } from '../../../presentation/controllers/orders/get-order-by-id';

export default (): GetOrderByIdController => {
  const repo = new DynamoOrderRepository();
  const useCase = new GetOrderByIdUseCaseImpl(
    repo,
  );
  const controller = new GetOrderByIdController(
    useCase,
  );
  return controller;
};
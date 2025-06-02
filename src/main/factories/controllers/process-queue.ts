import { SQSConsumerService } from '../../../data/services/sqs-services';
import { UpdateOrderUseCaseImpl } from '../../../data/use-cases/order/update-orders';
import { DynamoOrderRepository } from '../../../infrastructure/repositories/dynamo/order';
import { ProcessQueueController } from '../../../presentation/controllers/orders/process-queue';

export default (): ProcessQueueController => {
  const queueUrl = process.env.QUEUE_URL as string;
  const orderRepo = new DynamoOrderRepository();
  const updateOrderUseCase = new UpdateOrderUseCaseImpl(orderRepo);
  const sqsConsumerService = new SQSConsumerService(queueUrl, updateOrderUseCase);
  
  const controller = new ProcessQueueController(sqsConsumerService);
  return controller;
}; 
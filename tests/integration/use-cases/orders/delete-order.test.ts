import { Order, OrderStatus } from '../../../../src/domain/entities/order';
import { DynamoOrderRepository } from '../../../../src/infrastructure/repositories/dynamo/order';
import AWS from 'aws-sdk';

export const docClient = new AWS.DynamoDB.DocumentClient({
  region: 'us-east-1',
  endpoint: process.env.DYNAMODB_ENDPOINT || 'http://db:4566',
  accessKeyId: 'fakeAccessKeyId',
  secretAccessKey: 'fakeSecretAccessKey',
});

describe('DynamoOrderRepository', () => {
  let sut: DynamoOrderRepository;

  const testOrder: Order = {
    id: 'test-order-01',
    customerId: 'customerId',
    orderStatus: OrderStatus.PENDING,
    items: ['id-01', 'id-02'],
    createdAt: 'createdAt',
  };

  beforeAll(async () => {
    sut = new DynamoOrderRepository();
    await sut.create(testOrder);
  }, 50000);

  it('should delete a order successfully', async () => {
    await sut.delete(testOrder.id, testOrder.customerId);

    const product = await sut.findById(testOrder.id, testOrder.customerId);
    expect(product).toBeNull();
  }, 50000);

  afterAll(async () => {
    // Verifica se o item ainda existe antes de tentar deletá-lo
    const existingOrder = await sut.findById(testOrder.id, testOrder.customerId);
    if (existingOrder) {
      await sut.delete(testOrder.id, testOrder.customerId);
    }
  }, 50000);

});
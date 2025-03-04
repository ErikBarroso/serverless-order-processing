import { Order, OrderStatus } from '../../../../src/domain/entities/order';
import { DynamoOrderRepository } from '../../../../src/infrastructure/repositories/dynamo/order';

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
    const result = await sut.create(testOrder);
    expect(result).toBeDefined();
  }, 50000);

  it('should delete a order successfully', async () => {
    await sut.delete(testOrder.id, testOrder.customerId);

    const product = await sut.findById(testOrder.id, testOrder.customerId);
    expect(product).toBeUndefined();
  }, 50000);

  afterAll(async () => {
    const existingOrder = await sut.findById(testOrder.id, testOrder.customerId);
    if (existingOrder) {
      await sut.delete(testOrder.id, testOrder.customerId);
    }
  }, 50000);

});
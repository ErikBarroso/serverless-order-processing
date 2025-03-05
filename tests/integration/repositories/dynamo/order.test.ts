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
  }, 50000);

  beforeEach(async () => {
    await sut.create(testOrder);   
  });

  afterEach(async () => {
    await sut.delete(testOrder.id, testOrder.customerId);
  });

  it('should create a order successfully', async () => {
    const order = await sut.findById(testOrder.id, testOrder.customerId);
    expect(order).toEqual(testOrder);
  });

  it('should delete a order successfully', async () => {
    await sut.delete(testOrder.id, testOrder.customerId);
    const order = await sut.findById(testOrder.id, testOrder.customerId);
    expect(order).toBeUndefined();
  }, 50000);

  it('should find all orders and include the newly created order', async () => {
    const order = await sut.findAll(testOrder.customerId);
    expect(order).toEqual(expect.arrayContaining([testOrder]));
  });

  afterAll(async () => {
    const existingOrder = await sut.findById(testOrder.id, testOrder.customerId);
    if (existingOrder) {
      await sut.delete(testOrder.id, testOrder.customerId);
    }
  }, 50000);

});
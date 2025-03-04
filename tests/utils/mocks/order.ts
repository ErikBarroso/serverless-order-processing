import { Order, OrderStatus } from '../../../src/domain/entities/order';

const mockedOrder : Order = {
  id: 'id',
  customerId: 'customerId',
  orderStatus: OrderStatus.PENDING,
  items: ['id-01', 'id-02'],
  createdAt: '01/01/2025',
};

export default mockedOrder;
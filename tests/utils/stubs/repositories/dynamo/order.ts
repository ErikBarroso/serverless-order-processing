/* eslint-disable @typescript-eslint/no-unused-vars */
import { Order } from '../../../../../src/domain/entities/order';
import { OrderRepository } from '../../../../../src/domain/repositories/order';
import mockedOrder from '../../../mocks/order';

export class DynamoOrderRepositoryStub implements OrderRepository {
  create(item: Order): Promise<Order> {
    return Promise.resolve(mockedOrder);
  }

  delete(id: string, userId: string): Promise<void> {
    return Promise.resolve();
  }

  findAll(userId: string): Promise<Order[] | []> {
    return Promise.resolve([mockedOrder]);
  }

  findById(id: string, userId: string): Promise<Order | null> {
    return Promise.resolve(mockedOrder);
  }
}
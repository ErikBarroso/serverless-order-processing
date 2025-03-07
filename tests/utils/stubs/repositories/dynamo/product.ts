/* eslint-disable @typescript-eslint/no-unused-vars */
import { Order } from '../../../../../src/domain/entities/order';
import { Product } from '../../../../../src/domain/entities/product';
import { ProductRepository } from '../../../../../src/domain/repositories/product';
import mockedProduct from '../../../mocks/product';

export class DynamoProductRepositoryStub implements ProductRepository {
  create(item: Product): Promise<Product> {
    return Promise.resolve(mockedProduct);
  }

  delete(id: string): Promise<void> {
    return Promise.resolve();
  }

  findAll(): Promise<Product[] | []> {
    return Promise.resolve([mockedProduct]);
  }

  findByName(): Promise<Product[]> {
    return Promise.resolve([mockedProduct]);
  }

  findById(id: string): Promise<Product | null> {
    return Promise.resolve(mockedProduct);
  }
}
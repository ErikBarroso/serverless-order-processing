import { randomUUID } from 'crypto';
import { created } from '../../utils/result';
import { Product } from '../../../domain/entities/product';
import { CreateProductUseCase } from '../../../domain/use-cases/product/create-product';
import { ProductRepository } from '../../../domain/repositories/product';

export class CreateProductUseCaseImpl implements CreateProductUseCase {
  constructor(private readonly repo: ProductRepository) {}

  async exec(item: Omit<Product, 'id'>): Promise<Product> {
    const product: Product = {
      id: randomUUID(),
      name: item.name,
      price: item.price,
      stock: item.stock,
    };
    const result = await this.repo.create(product);
    return created('Produto criado com sucesso!', result);
  }
}
import { Product } from '../../../domain/entities/product';
import { ProductRepository } from '../../../domain/repositories/product';
import { FindProductsUseCase } from '../../../domain/use-cases/product/find-products';
import { ok } from '../../utils/result';

export class FindProductsUseCaseImpl implements FindProductsUseCase {
  constructor(private readonly repo: ProductRepository) {}

  async exec(): Promise<Product[]> {
    const products = await this.repo.findAll();
    return ok('Ação realizada com sucesso', products);
  }
}
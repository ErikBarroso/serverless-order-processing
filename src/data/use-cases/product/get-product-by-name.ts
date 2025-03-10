import { Product } from '../../../domain/entities/product';
import { ProductRepository } from '../../../domain/repositories/product';
import { GetProductByNameUseCase } from '../../../domain/use-cases/product/get-product-by-name';
import { notFound, ok } from '../../utils/result';

export class GetProductByNameUseCaseImpl implements GetProductByNameUseCase {
  constructor(private readonly repo: ProductRepository) {}

  async exec(name: Product['name']): Promise<Product[]> {
    const products = await this.repo.findByName(name.toLowerCase());
    if (products.length === 0) {
      return notFound('Não existe nenhum produto com esse nome. Tente novamente.');
    }
    return ok('Ação realizada com sucesso!', products);
  }
}
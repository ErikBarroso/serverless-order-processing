import { Product } from '../../../domain/entities/product';
import { ProductRepository } from '../../../domain/repositories/product';
import { GetProductByIdUseCase } from '../../../domain/use-cases/product/get-product-by-id';
import { notFound, ok } from '../../utils/result';

export class GetProductByIdUseCaseImpl implements GetProductByIdUseCase {
  constructor(private readonly repo: ProductRepository) {}

  async exec(id: Product['id']): Promise<Product> {
    const product = await this.repo.findById(id);
    if (!product) {
      return notFound('Produto não encontrado.');
    }
    return ok('Ação realizada com sucesso!', product);
  }
}
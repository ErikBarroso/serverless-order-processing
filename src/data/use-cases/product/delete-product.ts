import { Product } from '../../../domain/entities/product';
import { ProductRepository } from '../../../domain/repositories/product';
import { DeleteProductUseCase } from '../../../domain/use-cases/product/delete-product';
import { notFound, ok } from '../../utils/result';

export class DeleteProductUseCaseImpl implements DeleteProductUseCase {
  constructor(private readonly repo: ProductRepository) {}

  async exec(id: Product['id']): Promise<void> {
    const product = await this.repo.findById(id);
    if (!product) {
      return notFound('Produto não encontrado!');
    }
    await this.repo.delete(id);
    return ok('Produto deletado com sucesso!', product);
  }
}
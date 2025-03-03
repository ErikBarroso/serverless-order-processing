import { Product } from '../../../domain/entities/product';
import { ProductRepository } from '../../../domain/repositories/product';
import { DeleteProductUseCase } from '../../../domain/use-cases/product/delete-product';
import { ok } from '../../utils/result';

export class DeleteProductUseCaseImpl implements DeleteProductUseCase {
  constructor(private readonly repo: ProductRepository) {}

  async exec(id: Product['id']): Promise<void> {
    // buscar se product existe
    await this.repo.delete(id);
    return ok('Produto deletado com sucesso!');
  }
}
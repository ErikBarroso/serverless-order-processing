import { Order } from '../../../domain/entities/order';
import { OrderRepository } from '../../../domain/repositories/order';
import { DeleteOrderUseCase } from '../../../domain/use-cases/order/delete-order';
import { ok } from '../../utils/result';

export class DeleteOrderUseCaseImpl implements DeleteOrderUseCase {
  constructor(private readonly repo: OrderRepository) {}

  async exec(id: Order['id'], userId:string): Promise<void> {
    // buscar se order existe
    // buscar se o user é o msm q criou
    await this.repo.delete(id, userId);
    return ok('Pedido deletado com sucesso!');
  }
}
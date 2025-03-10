import { Order } from '../../../domain/entities/order';
import { OrderRepository } from '../../../domain/repositories/order';
import { DeleteOrderUseCase } from '../../../domain/use-cases/order/delete-order';
import { notFound, ok } from '../../utils/result';

export class DeleteOrderUseCaseImpl implements DeleteOrderUseCase {
  constructor(private readonly repo: OrderRepository) {}

  async exec(id: Order['id'], userId:string): Promise<void> {
    const order = await this.repo.findById(id, userId);
    if (!order) {
      return notFound('Pedido não encontrado');
    }
    await this.repo.delete(id, userId);
    return ok('Pedido deletado com sucesso!', order);
  }
}
import { Order } from '../../../domain/entities/order';
import { OrderRepository } from '../../../domain/repositories/order';
import { GetOrderByIdUseCase } from '../../../domain/use-cases/order/get-order-by-id';
import { notFound, ok } from '../../utils/result';

export class GetOrderByIdUseCaseImpl implements GetOrderByIdUseCase {
  constructor(private readonly repo: OrderRepository) {}

  async exec(id: Order['id'], userId: string): Promise<Order> {
    const order = await this.repo.findById(id, userId);
    if (!order) {
      return notFound('Pedido não encontrado');
    }
    return ok('Ação realizada com sucesso!', order);
  }
}
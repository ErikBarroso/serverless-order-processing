import { Order } from '../../../domain/entities/order';
import { OrderRepository } from '../../../domain/repositories/order';
import { FindOrdersUseCase } from '../../../domain/use-cases/order/find-orders';
import { ok } from '../../utils/result';

export class FindOrdersUseCaseImpl implements FindOrdersUseCase {
  constructor(private readonly repo: OrderRepository) {}

  async exec(userId: string): Promise<Order[]> {
    // buscar user
    const orders = await this.repo.findAll(userId);
    return ok('Ação realizada com sucesso',orders);
  }
}
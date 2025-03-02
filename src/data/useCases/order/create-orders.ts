import { randomUUID } from 'crypto';
import { Order, OrderStatus } from '../../../domain/entities/order';
import { OrderRepository } from '../../../domain/repositories/order';
import { CreateOrderUseCase } from '../../../domain/use-cases/order/create-order';
import { created } from '../../utils/result';
import { Product } from '../../../domain/entities/product';

export class CreateOrderUseCaseImpl implements CreateOrderUseCase {
  constructor(private readonly repo: OrderRepository) {}

  async exec(items: Product['id'][], customerId: string): Promise<Order> {
    // buscar o user
    // buscar os items para ver se existem = produtos
    const order: Order = {
      id: randomUUID(),
      customerId,
      orderStatus: OrderStatus.PENDING,
      items,
      createdAt: new Date().toISOString(),
    };

    const result = await this.repo.create(order);
    return created('Pedido criado com sucesso!', result);
  }
}
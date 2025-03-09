import { randomUUID } from 'crypto';
import { Order, OrderStatus } from '../../../domain/entities/order';
import { OrderRepository } from '../../../domain/repositories/order';
import { CreateOrderUseCase } from '../../../domain/use-cases/order/create-order';
import { created, notFound } from '../../utils/result';
import { Product } from '../../../domain/entities/product';
import { ProductRepository } from '../../../domain/repositories/product';

export class CreateOrderUseCaseImpl implements CreateOrderUseCase {
  constructor(
    private readonly ordersRepo: OrderRepository,
    private readonly productRepo: ProductRepository,
  ) {}

  async exec(items: Product['id'][], customerId: string): Promise<Order> {
    const productsDb = await this.productRepo.findAll();
    const productsIds = new Set(productsDb.map(product => product.id));

    const notFoundItems  = items.filter(itemId => !productsIds.has(itemId));
    if (notFoundItems.length > 0) {
      return notFound('Produtos não encontrados!');
    }
    
    // verificar se os meus items existem no products
    const order: Order = {
      id: randomUUID(),
      customerId,
      orderStatus: OrderStatus.PENDING,
      items,
      createdAt: new Date().toISOString(),
    };

    const result = await this.ordersRepo.create(order);
    return created('Pedido criado com sucesso!', result);
  }
}
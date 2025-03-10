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

  async exec(products: Product['id'][], customerId: string): Promise<Order> {
    const productsDb = await this.productRepo.findAll();
    
    const notFoundProducts = products.filter(product => !productsDb.some(productDb => productDb.id === product));
    if (notFoundProducts.length > 0) {
      return notFound('Algum dos produtos enviados são inválidos!');
    }
    
    const order: Order = {
      id: randomUUID(),
      customerId: customerId.toLowerCase(),
      orderStatus: OrderStatus.PENDING,
      items: products,
      createdAt: new Date().toISOString(),
    };

    const result = await this.ordersRepo.create(order);
    return created('Pedido criado com sucesso!', result);
  }
}
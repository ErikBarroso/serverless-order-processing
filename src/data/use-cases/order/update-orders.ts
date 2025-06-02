import { Order, OrderStatus } from '../../../domain/entities/order';
import { OrderRepository } from '../../../domain/repositories/order';
import { UpdateOrderUseCase } from '../../../domain/use-cases/order/update-order';
import { ok } from '../../utils/result';

export class UpdateOrderUseCaseImpl implements UpdateOrderUseCase {
  constructor(
    private readonly ordersRepo: OrderRepository,
  ) {}

  async exec(order: Order): Promise<Order[]> {
    const updatedOrders: Order[] = [];
    
    const updateData: Partial<Order> = {
      orderStatus: OrderStatus.COMPLETED,
      updatedAt: new Date().toISOString(),
    };
        
    const updatedOrder = await this.ordersRepo.update(
      order.id, 
      order.customerId, 
      updateData,
    );
    updatedOrders.push(updatedOrder);
        
    return ok('Pedido atualizado com sucesso!', updatedOrder);
  }
}
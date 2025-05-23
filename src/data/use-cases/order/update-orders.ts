import { Order, OrderStatus } from '../../../domain/entities/order';
import { OrderRepository } from '../../../domain/repositories/order';
import { UpdateOrderUseCase } from '../../../domain/use-cases/order/update-order';
import { ok } from '../../utils/result';

export class UpdateOrderUseCaseImpl implements UpdateOrderUseCase {
  constructor(
    private readonly ordersRepo: OrderRepository,
  ) {}

  async exec(orders: Order[]): Promise<Order[]> {
    const updatedOrders: Order[] = [];
    
    try {
      for (const order of orders) {
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
      }

      return ok('Pedidos atualizados com sucesso!', updatedOrders);
    } catch (error) {
      console.error('Erro ao atualizar orders:', error);
      throw error;
    }
  }
}
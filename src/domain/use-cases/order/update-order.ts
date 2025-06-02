import { Order } from '../../entities/order';

export interface UpdateOrderUseCase {
    exec(order: Order): Promise<Order[]>;
}
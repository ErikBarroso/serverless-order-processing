import { Order } from '../../entities/order';

export interface UpdateOrderUseCase {
    exec(orders: Order[]): Promise<Order[]>;
}
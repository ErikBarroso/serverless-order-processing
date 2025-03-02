import { Order } from '../../entities/order';
import { Product } from '../../entities/product';

export interface CreateOrderUseCase {
    exec(items: Product['id'][], customerId: string): Promise<Order>;
}
import { Order } from '../../entities/order';

export interface FindOrdersUseCase {
    exec(userId: string): Promise<Order[]>;
}
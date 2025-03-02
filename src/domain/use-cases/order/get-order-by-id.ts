import { Order } from '../../entities/order';

export interface GetOrderByIdUseCase {
    exec(id: Order['id'], userId: string): Promise<Order>;
}
import { Order } from '../entities/order';

export interface OrderRepository {
    create(item: Order): Promise<Order>;
    delete(id: string, userId: string): Promise<void>;
    findById(id: string, userId: string): Promise<Order | null>;
    findAll(userId: string): Promise<Order[]>;
}
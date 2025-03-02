import { Order } from '../../entities/order';

export interface DeleteOrderUseCase {
    exec(id: Order['id'], userId:string): Promise<void>;
}
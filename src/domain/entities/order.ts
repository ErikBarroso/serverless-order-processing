import { Product } from './product';

export type Order = {
    id: string;
    customerId: string;
    orderStatus: OrderStatus;
    items: Product['id'][];
    createdAt: string;
}

export enum OrderStatus {
    PENDING = 'Pending',
    PROCESSING = 'Processing',
    COMPLETED= 'Completed',
    CANCELLED = 'Cancelled'
}
import { OrderItem } from "./order-item";

export type Order = {
    id: string;
    customerId: string;
    orderStatus: OrderStatus;
    items: OrderItem[];
    createdAt: Date
}

export enum OrderStatus {
    'PENDING',
    'PROCESSING',
    'COMPLETED',
    'CANCELLED'
}
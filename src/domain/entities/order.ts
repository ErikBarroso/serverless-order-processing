import { Product } from "./product";

export type Order = {
    id: string;
    customerId: string;
    orderStatus: OrderStatus;
    items: Product[];
    createdAt: Date
}

export enum OrderStatus {
    'PENDING',
    'PROCESSING',
    'COMPLETED',
    'CANCELLED'
}
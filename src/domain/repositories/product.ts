import { Product } from '../entities/product';

export interface ProductRepository {
    create(item: Product): Promise<Product>;
    delete(id: string): Promise<void>;
    findById(id: string): Promise<Product | null>;
    findByName(name: string): Promise<Product[]>;
    findAll(): Promise<Product[]>;
}
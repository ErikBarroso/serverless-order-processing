import { Product } from '../../entities/product';

export interface CreateProductUseCase {
    exec(item: Omit<Product,'id'>): Promise<Product>;
}
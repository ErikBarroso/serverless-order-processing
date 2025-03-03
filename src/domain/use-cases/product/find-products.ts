import { Product } from '../../entities/product';

export interface FindProductsUseCase {
    exec(): Promise<Product[]>;
}
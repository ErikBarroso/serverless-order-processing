import { Product } from '../../entities/product';

export interface GetProductByNameUseCase {
    exec(name: Product['name']): Promise<Product[]>;
}
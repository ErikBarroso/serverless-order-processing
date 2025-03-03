import { Product } from '../../entities/product';

export interface GetProductByIdUseCase {
    exec(id: Product['id']): Promise<Product>;
}
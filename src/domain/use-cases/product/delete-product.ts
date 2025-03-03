import { Product } from '../../entities/product';

export interface DeleteProductUseCase {
    exec(id: Product['id']): Promise<void>;
}
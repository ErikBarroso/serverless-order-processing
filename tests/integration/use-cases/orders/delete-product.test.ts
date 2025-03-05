import { Product } from '../../../../src/domain/entities/product';
import { DynamoProductRepository } from '../../../../src/infrastructure/repositories/dynamo/product';

describe('DynamoProductRepository', () => {
  let sut: DynamoProductRepository;

  const testProduct: Product = {
    id: 'test-product-01',
    name: 'name',
    price: 10,
    stock: 30,
  };

  beforeAll(async () => {
    sut = new DynamoProductRepository();
  }, 50000);

  it('should create a product successfully', async () => {
    await sut.create(testProduct);   
    const product = await sut.findById(testProduct.id);
    expect(product).toEqual(testProduct);
  });

  it('should delete a product successfully', async () => {
    await sut.delete(testProduct.id);
    const product = await sut.findById(testProduct.id);
    expect(product).toBeUndefined();
  }, 50000);

  afterAll(async () => {
    const existingProduct = await sut.findById(testProduct.id);
    if (existingProduct) {
      await sut.delete(testProduct.id);
    }
  }, 50000);
});
import { CreateProductUseCaseImpl } from '../../../../src/data/use-cases/product/create-product';
import { created } from '../../../../src/data/utils/result';
import mockedProduct from '../../../utils/mocks/product';
import { DynamoProductRepositoryStub } from '../../../utils/stubs/repositories/dynamo/product';

interface SutTypes {
    sut: CreateProductUseCaseImpl
    dynamoProductRepositoryStub : DynamoProductRepositoryStub
}

const makeSut = (): SutTypes => {
  const dynamoProductRepositoryStub = new DynamoProductRepositoryStub();
  const sut = new CreateProductUseCaseImpl(
    dynamoProductRepositoryStub,
  );
  return {
    sut,
    dynamoProductRepositoryStub,
  };
};

describe('CreateProductUseCaseImpl', () => {
  it('should return 201 if an product is created successfully', async () => {
    const { sut } = makeSut();
    const res = await sut.exec({
      name: 'name',
      price: 10,
      stock: 40,
    });

    expect(res).toEqual(created('Produto criado com sucesso!', mockedProduct));
  });
});
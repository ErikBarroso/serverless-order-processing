import { FindProductsUseCaseImpl } from '../../../../src/data/use-cases/product/find-products';
import {  ok } from '../../../../src/data/utils/result';
import mockedProduct from '../../../utils/mocks/product';
import { DynamoProductRepositoryStub } from '../../../utils/stubs/repositories/dynamo/product';

interface SutTypes {
    sut: FindProductsUseCaseImpl
    dynamoProductRepositoryStub : DynamoProductRepositoryStub
}

const makeSut = (): SutTypes => {
  const dynamoProductRepositoryStub = new DynamoProductRepositoryStub();
  const sut = new FindProductsUseCaseImpl(
    dynamoProductRepositoryStub,
  );
  return {
    sut,
    dynamoProductRepositoryStub,
  };
};

describe('FindProductsUseCaseImpl', () => {
  it('should return 200 if returning existing products', async () => {
    const { sut } = makeSut();
    const res = await sut.exec();

    expect(res).toEqual(ok('Ação realizada com sucesso', [mockedProduct]));
  });
});
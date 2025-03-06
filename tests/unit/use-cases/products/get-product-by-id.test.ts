import { GetProductByIdUseCaseImpl } from '../../../../src/data/use-cases/product/get-product';
import {  ok } from '../../../../src/data/utils/result';
import mockedProduct from '../../../utils/mocks/product';
import { DynamoProductRepositoryStub } from '../../../utils/stubs/repositories/dynamo/product';

interface SutTypes {
    sut: GetProductByIdUseCaseImpl
    dynamoProductRepositoryStub : DynamoProductRepositoryStub
}

const makeSut = (): SutTypes => {
  const dynamoProductRepositoryStub = new DynamoProductRepositoryStub();
  const sut = new GetProductByIdUseCaseImpl(
    dynamoProductRepositoryStub,
  );
  return {
    sut,
    dynamoProductRepositoryStub,
  };
};

describe('GetProductByIdUseCaseImpl', () => {
  it('should return 200 if it returns the searched product', async () => {
    const { sut } = makeSut();
    const res = await sut.exec('id-01');

    expect(res).toEqual(ok('Ação realizada com sucesso!', mockedProduct));
  });
});
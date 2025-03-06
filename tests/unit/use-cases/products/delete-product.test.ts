import { DeleteProductUseCaseImpl } from '../../../../src/data/use-cases/product/delete-product';
import {  ok } from '../../../../src/data/utils/result';
import { DynamoProductRepositoryStub } from '../../../utils/stubs/repositories/dynamo/product';

interface SutTypes {
    sut: DeleteProductUseCaseImpl
    dynamoProductRepositoryStub : DynamoProductRepositoryStub
}

const makeSut = (): SutTypes => {
  const dynamoProductRepositoryStub = new DynamoProductRepositoryStub();
  const sut = new DeleteProductUseCaseImpl(
    dynamoProductRepositoryStub,
  );
  return {
    sut,
    dynamoProductRepositoryStub,
  };
};

describe('DeleteProductUseCaseImpl', () => {
  it('should return 200 if an product is deleted successfully', async () => {
    const { sut } = makeSut();
    const res = await sut.exec('id-01');

    expect(res).toEqual(ok('Produto deletado com sucesso!'));
  });
});
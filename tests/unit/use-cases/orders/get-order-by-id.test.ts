import { GetOrderByIdUseCaseImpl } from '../../../../src/data/use-cases/order/get-order';
import {  ok } from '../../../../src/data/utils/result';
import mockedOrder from '../../../utils/mocks/order';
import { DynamoOrderRepositoryStub } from '../../../utils/stubs/repositories/dynamo/order';

interface SutTypes {
    sut: GetOrderByIdUseCaseImpl
    dynamoOrderRepositoryStub : DynamoOrderRepositoryStub
}

const makeSut = (): SutTypes => {
  const dynamoOrderRepositoryStub = new DynamoOrderRepositoryStub();
  const sut = new GetOrderByIdUseCaseImpl(
    dynamoOrderRepositoryStub,
  );
  return {
    sut,
    dynamoOrderRepositoryStub,
  };
};

describe('GetOrderByIdUseCaseImpl', () => {
  it('should return 200 if it returns the searched order', async () => {
    const { sut } = makeSut();
    const res = await sut.exec('id-01','customerId');

    expect(res).toEqual(ok('Ação realizada com sucesso!', mockedOrder));
  });
});
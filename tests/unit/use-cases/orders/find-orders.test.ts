import { FindOrdersUseCaseImpl } from '../../../../src/data/useCases/order/find-orders';
import {  ok } from '../../../../src/data/utils/result';
import mockedOrder from '../../../utils/mocks/order';
import { DynamoOrderRepositoryStub } from '../../../utils/stubs/repositories/dynamo/order';

interface SutTypes {
    sut: FindOrdersUseCaseImpl
    dynamoOrderRepositoryStub : DynamoOrderRepositoryStub
}

const makeSut = (): SutTypes => {
  const dynamoOrderRepositoryStub = new DynamoOrderRepositoryStub();
  const sut = new FindOrdersUseCaseImpl(
    dynamoOrderRepositoryStub,
  );
  return {
    sut,
    dynamoOrderRepositoryStub,
  };
};

describe('FindOrdersUseCaseImpl', () => {
  it('should return 200 if returning existing orders', async () => {
    const { sut } = makeSut();
    const res = await sut.exec('customerId');

    expect(res).toEqual(ok('Ação realizada com sucesso', [mockedOrder]));
  });
});
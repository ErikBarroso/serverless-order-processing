import { DeleteOrderUseCaseImpl } from '../../../../src/data/use-cases/order/delete-orders';
import {  ok } from '../../../../src/data/utils/result';
import mockedOrder from '../../../utils/mocks/order';
import { DynamoOrderRepositoryStub } from '../../../utils/stubs/repositories/dynamo/order';

interface SutTypes {
    sut: DeleteOrderUseCaseImpl
    dynamoOrderRepositoryStub : DynamoOrderRepositoryStub
}

const makeSut = (): SutTypes => {
  const dynamoOrderRepositoryStub = new DynamoOrderRepositoryStub();
  const sut = new DeleteOrderUseCaseImpl(
    dynamoOrderRepositoryStub,
  );
  return {
    sut,
    dynamoOrderRepositoryStub,
  };
};

describe('DeleteOrderUseCaseImpl', () => {
  it('should return 200 if an order is deleted successfully', async () => {
    const { sut } = makeSut();
    const res = await sut.exec('id-01', 'customerId');

    expect(res).toEqual(ok('Pedido deletado com sucesso!', mockedOrder));
  });
});
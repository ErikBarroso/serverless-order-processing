import { CreateOrderUseCaseImpl } from '../../../../src/data/use-cases/order/create-orders';
import { created } from '../../../../src/data/utils/result';
import mockedOrder from '../../../utils/mocks/order';
import { DynamoOrderRepositoryStub } from '../../../utils/stubs/repositories/dynamo/order';
import { DynamoProductRepositoryStub } from '../../../utils/stubs/repositories/dynamo/product';

interface SutTypes {
    sut: CreateOrderUseCaseImpl
    dynamoOrderRepositoryStub : DynamoOrderRepositoryStub
    dynamoProductRepositoryStub : DynamoProductRepositoryStub
}

const makeSut = (): SutTypes => {
  const dynamoOrderRepositoryStub = new DynamoOrderRepositoryStub();
  const dynamoProductRepositoryStub = new DynamoProductRepositoryStub();
  const sut = new CreateOrderUseCaseImpl(
    dynamoOrderRepositoryStub,
    dynamoProductRepositoryStub,
  );
  return {
    sut,
    dynamoOrderRepositoryStub,
    dynamoProductRepositoryStub,
  };
};

describe('CreateOrderUseCaseImpl', () => {
  it('should return 201 if an order is created successfully', async () => {
    const { sut } = makeSut();
    const res = await sut.exec(['id'], 'customerId');

    expect(res).toEqual(created('Pedido criado com sucesso!', mockedOrder));
  });
});
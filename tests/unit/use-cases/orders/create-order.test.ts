import { CreateOrderUseCaseImpl } from '../../../../src/data/useCases/order/create-orders';
import { created } from '../../../../src/data/utils/result';
import mockedOrder from '../../../utils/mocks/order';
import { DynamoOrderRepositoryStub } from '../../../utils/stubs/repositories/dynamo/order';

interface SutTypes {
    sut: CreateOrderUseCaseImpl
    dynamoOrderRepositoryStub : DynamoOrderRepositoryStub
}

const makeSut = (): SutTypes => {
  const dynamoOrderRepositoryStub = new DynamoOrderRepositoryStub();
  const sut = new CreateOrderUseCaseImpl(
    dynamoOrderRepositoryStub,
  );
  return {
    sut,
    dynamoOrderRepositoryStub,
  };
};

describe('CreateOrderUseCaseImpl', () => {
  it('should return 201 if an order is created successfully', async () => {
    const { sut } = makeSut();
    const res = await sut.exec(['id-01', 'id-02'], 'customerId');

    expect(res).toEqual(created('Pedido criado com sucesso!', mockedOrder));
  });
});
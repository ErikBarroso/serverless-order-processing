import { Customer } from '../../../../src/domain/entities/customer';
import { DynamoUserRepository } from '../../../../src/infrastructure/repositories/dynamo/user';

describe('DynamoUserRepository', () => {
  let sut: DynamoUserRepository;

  const testUser: Customer = {
    id: 'test-user-01',
    name: 'name',
    email: 'email',
    password: 'password',
  };

  beforeAll(async () => {
    sut = new DynamoUserRepository();
  }, 50000);

  beforeEach(async () => {
    await sut.create(testUser);   
  });

  afterEach(async () => {
    await sut.delete(testUser.id);
  });

  it('should create a user successfully', async () => {
    const user = await sut.findById(testUser.id);
    expect(user).toEqual(testUser);
  });

  it('should delete a user successfully', async () => {
    await sut.delete(testUser.id);
    const user = await sut.findById(testUser.id);
    expect(user).toBeNull();
  }, 50000);

  it('should find all users and include the newly created user', async () => {
    const users = await sut.findAll();
    expect(users).toEqual(expect.arrayContaining([testUser]));
  });

  afterAll(async () => {
    const existingUser = await sut.findById(testUser.id);
    if (existingUser) {
      await sut.delete(testUser.id);
    }
  }, 50000);
});
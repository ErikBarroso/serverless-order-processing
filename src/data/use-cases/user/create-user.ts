import { randomUUID } from 'crypto';
import { Customer } from '../../../domain/entities/customer';
import { UserRepository } from '../../../domain/repositories/user';
import { CreateUserUseCase } from '../../../domain/use-cases/user/create-user';
import { created } from '../../utils/result';
import { Encrypter } from '../../utils/encrypter';

export class CreateUserUseCaseImpl implements CreateUserUseCase {
  constructor(
    private readonly repo: UserRepository,
    private readonly encrypter: Encrypter,
  ) {}

  async exec(data: Omit<Customer, 'id'>): Promise<Customer> {
    const user: Customer = {
      id: randomUUID(),
      email: data.email ,
      name: data.name ,
      password: await this.encrypter.hash(data.password) as string,
    };
    const result = await this.repo.create(user);
    return created('Usuário criado com sucesso!', result);
  }
}
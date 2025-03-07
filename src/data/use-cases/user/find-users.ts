import { Customer } from '../../../domain/entities/customer';
import { UserRepository } from '../../../domain/repositories/user';
import { ok } from '../../utils/result';
import { FindUsersUseCase } from '../../../domain/use-cases/user/find-users';

export class FindUsersUseCaseImpl implements FindUsersUseCase {
  constructor( private readonly repo: UserRepository ) {}

  async exec(): Promise<Customer[]> {
    const users = await this.repo.findAll();
    return ok('Ação realizada com sucesso', users);
  }
}
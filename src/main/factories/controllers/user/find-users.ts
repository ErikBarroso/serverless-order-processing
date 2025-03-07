import { FindUsersUseCaseImpl } from '../../../../data/use-cases/user/find-users';
import { DynamoUserRepository } from '../../../../infrastructure/repositories/dynamo/user';
import { FindUsersController } from '../../../../presentation/controllers/user/find-users';

export default () : FindUsersController => {
  const repo = new DynamoUserRepository();
  const useCase = new FindUsersUseCaseImpl(repo);
  const controller = new FindUsersController(
    useCase,
  );
  return controller;
};
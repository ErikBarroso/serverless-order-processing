import { CreateUserUseCaseImpl } from '../../../../data/use-cases/user/create-user';
import Bcrypt from '../../../../infrastructure/encrypters/bcrypt';
import { DynamoUserRepository } from '../../../../infrastructure/repositories/dynamo/user';
import { CreateUserController } from '../../../../presentation/controllers/user/create-user';


export default () : CreateUserController => {
  const repo = new DynamoUserRepository();
  const encrypter = new Bcrypt();
  const useCase = new CreateUserUseCaseImpl(repo, encrypter );
  const controller = new CreateUserController(
    useCase,
  );
  return controller;
};
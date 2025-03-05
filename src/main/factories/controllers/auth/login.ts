import { LoginUseCaseImpl } from '../../../../data/useCases/auth/login';
import Bcrypt from '../../../../infrastructure/encrypters/bcrypt';
import { JsonWebToken } from '../../../../infrastructure/encrypters/jwt';
import { DynamoUserRepository } from '../../../../infrastructure/repositories/dynamo/user';
import { LoginController } from '../../../../presentation/controllers/auth/login';


export default (): LoginController => {
  const repo = new DynamoUserRepository();
  const bcrypt = new Bcrypt();
  const jsonWebToken = new JsonWebToken();
  const useCase = new LoginUseCaseImpl(
    repo,
    jsonWebToken,
    bcrypt,
  );
  const controller = new LoginController(
    useCase,
  );
  return controller;
};
import { AuthorizatorUseCaseImpl } from '../../../data/use-cases/auth/authorizator';
import { JsonWebToken } from '../../../infrastructure/encrypters/jwt';
import { AuthorizatorMiddleware } from '../../../presentation/middlewares/authorizator';

export default (): AuthorizatorMiddleware => {
  const jwt = new JsonWebToken();
  const useCase = new AuthorizatorUseCaseImpl(jwt);
  const controller = new AuthorizatorMiddleware(useCase);
  return controller;
};
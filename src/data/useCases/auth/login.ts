import { UserRepository } from '../../../domain/repositories/user';
import { LoginUseCase, LoginUseCaseResult } from '../../../domain/use-cases/auth/login';
import { Encrypter } from '../../utils/encrypter';
import { JWT } from '../../utils/jwt';
import { ok, unauthorized } from '../../utils/result';

export class LoginUseCaseImpl implements LoginUseCase {
  public constructor(
    private readonly userRepository: UserRepository,
    private readonly jwt: JWT,
    private readonly passwordEncrypter: Encrypter,
  ) {}

  async exec(email: string, password: string): Promise<LoginUseCaseResult> {
    const user = await this.userRepository.findByIdOrEmail(email);
    if (!user) {
      return unauthorized('Email ou senha inválido');
    }

    const isPasswordValid = await this.passwordEncrypter.compare(password, user.password);
    if (!isPasswordValid) {
      return unauthorized('Email ou senha inválido');
    }

    const accessToken = await this.jwt.sign({
      id: user.id }, 
    process.env.JWT_SECRET || 'defaultKey', 
    parseInt(process.env.JWT_EXPIRES_IN as string) || 60);
    const result: LoginUseCaseResult = {
      accessToken,
      user : {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
    return ok('Ação realizada com sucesso!', result);
  }
}
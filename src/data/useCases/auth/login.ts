import { UserRepository } from '../../../domain/repositories/user';
import { LoginUseCase, LoginUseCaseResult } from '../../../domain/use-cases/auth/login';
import { Encrypter } from '../../utils/encrypter';
import { JWT } from '../../utils/jwt';
import { JwtConfig } from '../../utils/jwt-config';
import { unauthorized } from '../../utils/result';

export class LoginUseCaseImpl implements LoginUseCase {
  public constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordEncrypter: Encrypter,
    private readonly jwt: JWT,
    private readonly jwtConfig: JwtConfig,
    private readonly refreshTokenEncrypter: Encrypter,
  ) {}

  async exec(email: string, pawword: string): Promise<LoginUseCaseResult> {
    const user = await this.userRepository.findByIdOrEmail(email);
    if (!user) {
      return unauthorized('Email ou senha inválido');
    }
    const isPasswordValid = await this.passwordEncrypter.compare(pawword, user.password);
    if (!isPasswordValid) {
      return unauthorized('Email ou senha inválido');
    }
    const accessToken = await this.jwt.sign({
      id: user.id,
    },this.jwtConfig);
    const refreshToken: string = await this.refreshTokenEncrypter.hash(
      this.hashPadding + accessToken + this.hashPadding,
    );
    // ver o lance do rregreshtoken
  }
}
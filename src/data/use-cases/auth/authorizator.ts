import { AuthorizatorUseCase } from '../../../domain/use-cases/auth/authorizator';
import { JWT } from '../../utils/jwt';

export class AuthorizatorUseCaseImpl implements AuthorizatorUseCase {
  constructor(private readonly jwt: JWT) {}

  async isAuthorized(accessToken: string): Promise<string | null> {
    if (!accessToken) {
      return null;
    }

    const secretKey = process.env.JWT_SECRET as string;
    const verifiedToken = await this.jwt.verify(accessToken, secretKey);
    if (!verifiedToken) {
      return null;
    }
    return verifiedToken.id;
  }
}
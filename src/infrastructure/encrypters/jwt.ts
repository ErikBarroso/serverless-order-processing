import { JWT } from '../../data/utils/jwt';
import { JwtConfig } from '../../data/utils/jwt-config';
import jsonWebToken from 'jsonwebtoken';
import { Token } from '../../domain/protocols/token';

export class JsonWebToken implements JWT {
  async sign(data: any, config: JwtConfig): Promise<string> {
    return jsonWebToken.sign(
      data, 
      config.key, 
      { expiresIn: config.expiresIn * 60 },
    );
  }

  async verify(token: string, key:string): Promise<Token | null > {
    try {
      return (jsonWebToken.verify(token, key)) as Token;
    } catch (err) {
      console.log('err', err);
      return null;
    }
  }

}
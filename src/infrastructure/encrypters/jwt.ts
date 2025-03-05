import { JWT } from '../../data/utils/jwt';
import jsonWebToken from 'jsonwebtoken';
import { Token } from '../../domain/protocols/token';

export class JsonWebToken implements JWT {
  async sign(data: any, key: string, expiresIn: number ): Promise<string> {
    return jsonWebToken.sign(
      data, 
      key, 
      { expiresIn: expiresIn * 60 },
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
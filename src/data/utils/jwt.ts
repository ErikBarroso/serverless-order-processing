import { Token } from '../../domain/protocols/token';
import { JwtConfig } from './jwt-config';

export interface JWT {
    sign: (data: any, config: JwtConfig) => Promise<string>;
    verify: (token :string, key: string,) => Promise<Token | null>;
}
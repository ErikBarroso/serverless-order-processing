import { Token } from '../../domain/protocols/token';

export interface JWT {
    sign: (data: any, key: string, expiresIn: number) => Promise<string>;
    verify: (token :string, key: string,) => Promise<Token | null>;
}
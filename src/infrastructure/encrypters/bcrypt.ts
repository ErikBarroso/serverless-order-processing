import bcrypt from 'bcryptjs';
import { Encrypter } from '../../data/utils/encrypter';

export class Bcrypt implements Encrypter {
  async compare(value: string, hash: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      bcrypt.compare(value, hash, (err, result) => {
        if (err) {
          reject(err);
        }
        resolve(result);
      });
    });
  }
}
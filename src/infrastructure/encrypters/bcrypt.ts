import bcrypt from 'bcryptjs';
import { Encrypter } from '../../data/utils/encrypter';

export default class Bcrypt implements Encrypter {
  async hash(value: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const saltRounds = 10;
      bcrypt.genSalt(saltRounds, (errSalt, salt) => {
        if (errSalt) {
          reject(errSalt);
        }
        bcrypt.hash(value, salt, (errHash, hash) => {
          if (errHash) {
            reject(errHash);
          }
          resolve(hash);
        });
      });
    });
  }

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
import bcrypt from 'bcryptjs';
import { Encrypter } from '../../data/utils/encrypter';

export default class Bcrypt implements Encrypter {
  async hash(value: string): Promise<string | null> {
    try {
      const salt = await bcrypt.genSalt(10);
      return bcrypt.hash(value, salt);
    } catch (error) {
      console.error('Erro ao comparar senha: ' + error);
      return null;
    }
  }

  async compare(value: string, hash: string): Promise<boolean> {
    try {
      return await bcrypt.compare(value, hash);
    } catch (error) {
      console.error('Erro ao comparar senha', error);
      return false;
    }
  }
}
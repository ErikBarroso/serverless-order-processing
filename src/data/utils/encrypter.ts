export interface Encrypter {
    hash(value: string): Promise<string | null>;
    compare(value: string, hash: string): Promise<boolean>;
  }
  
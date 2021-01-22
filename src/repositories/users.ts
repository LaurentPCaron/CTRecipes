import { accessSync, promises, write, writeFileSync } from 'fs';
import { CustomPromisify, promisify } from 'util';
import Crypto from 'crypto';

const scrypt: Function = promisify(Crypto.scrypt);

class UsersRepository {
  fileName: string;
  constructor(filename: string) {
    this.fileName = filename;
    try {
      accessSync(this.fileName);
    } catch (error) {
      writeFileSync(this.fileName, '[]');
    }
  }

  async create({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<IUser> {
    const id = Crypto.randomBytes(4).toString('hex');
    const saltyPassword = await this.generatePassword(password);

    return { id, email, password: saltyPassword };
  }

  async generatePassword(password: string): Promise<string> {
    const salt = Crypto.randomBytes(16).toString('hex');
    const saltPassword: Buffer = await scrypt(password, salt, 64);

    return `${saltPassword.toString('hex')}@${salt}`;
  }
}

interface IUser {
  id: string;
  email: string;
  password: string;
}

const test = new UsersRepository('users.json');

test.create({ email: 'Laurent', password: 'Manger' }).then(res => {
  console.log(res);
});

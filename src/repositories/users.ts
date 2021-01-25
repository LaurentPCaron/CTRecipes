import { accessSync, promises, write, writeFileSync, writeSync } from 'fs';
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

    const user = { id, email, password: saltyPassword };

    const users = await this.getAll();
    users.push(user);

    await this.writeAll(users);

    return user;
  }

  async generatePassword(password: string, _salt?: string): Promise<string> {
    const salt = _salt ? _salt : Crypto.randomBytes(16).toString('hex');
    const saltPassword: Buffer = await scrypt(password, salt, 64);

    return `${saltPassword.toString('hex')}@${salt}`;
  }

  async passwordsMatch(saved: string, sumitted: string) {
    const salt = saved.split('@')[1];
    const sumittedHash = await this.generatePassword(sumitted, salt);

    return saved === sumittedHash;
  }

  async getAll(): Promise<IUser[]> {
    return JSON.parse(
      await promises.readFile(this.fileName, { encoding: 'utf-8' })
    );
  }

  async writeAll(users: IUser[]): Promise<void> {
    await promises.writeFile(this.fileName, JSON.stringify(users, null, 2));
  }

  async getOneBy(filters: {
    [key: string]: string;
  }): Promise<IUser | undefined> {
    const users = await this.getAll();

    for (const user of users) {
      let isMatching = true;
      for (const key in filters) {
        if (filters[key] !== user[key]) {
          isMatching = false;
        }
      }
      if (isMatching) {
        return user;
      }
    }
  }

  async update(id: string, value: object): Promise<void> {
    const users = await this.getAll();
    const user = users.find(u => u.id === id);

    if (!user) {
      throw new Error(`No user found with the id "${id}"`);
    }

    Object.assign(user, value);
    await this.writeAll(users);
  }

  async delete(id: string): Promise<void> {
    const users = await this.getAll();
    const newUsersList = users.filter(u => u.id !== id);
    await this.writeAll(newUsersList);
  }
}

interface IUser {
  [key: string]: string;
  id: string;
  email: string;
  password: string;
}

export default new UsersRepository('users.json');

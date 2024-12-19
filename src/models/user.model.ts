import { RowDataPacket, ResultSetHeader } from 'mysql2';
import bcrypt from 'bcrypt';
import pool from '../config/database';
import { User, CreateUserDTO } from '../types/user';

export class UserModel {
  static async findAll(): Promise<User[]> {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT id, username, email, created_at FROM users');
    return rows as User[];
  }

  static async findById(id: number): Promise<User | null> {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT id, username, email, created_at FROM users WHERE id = ?', [id]);
    return rows[0] as User || null;
  }

  static async findByEmail(email: string): Promise<User | null> {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0] as User || null;
  }

  static async create(user: CreateUserDTO): Promise<User> {
    const { username, email, password } = user;
    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashedPassword]
    );

    const userId = result.insertId;
    return this.findById(userId) as Promise<User>;
  }

  static async verifyPassword(user: User, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.password);
  }
}


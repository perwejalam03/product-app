import { Request, Response, NextFunction } from 'express';
import { UserModel } from '../models/user.model';
import { CreateUserDTO, LoginUserDTO } from '../types/user';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export class UserController {
  static async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userData: CreateUserDTO = req.body;
      const user = await UserModel.create(userData);
      res.status(201).json({ id: user.id, username: user.username, email: user.email });
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password }: LoginUserDTO = req.body;
      const user = await UserModel.findByEmail(email);

      if (!user || !(await UserModel.verifyPassword(user, password))) {
        res.status(401).json({ error: 'Invalid credentials' });
        return;
      }

      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
      res.json({ token, user: { id: user.id, username: user.username, email: user.email } });
    } catch (error) {
      next(error);
    }
  }

  static async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).userId;
      const user = await UserModel.findById(userId);

      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      res.json({ id: user.id, username: user.username, email: user.email });
    } catch (error) {
      next(error);
    }
  }
}


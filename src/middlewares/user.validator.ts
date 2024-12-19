import { Request, Response, NextFunction } from 'express';
import { userSchema, loginSchema } from '../schemas/user.schema';

export const validateUser = (req: Request, res: Response, next: NextFunction): void => {
  const { error } = userSchema.validate(req.body);
  
  if (error) {
    res.status(400).json({ error: error.details[0].message });
    return;
  }
  
  next();
};

export const validateLogin = (req: Request, res: Response, next: NextFunction): void => {
  const { error } = loginSchema.validate(req.body);
  
  if (error) {
    res.status(400).json({ error: error.details[0].message });
    return;
  }
  
  next();
};


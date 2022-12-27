import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import config from '../../config';
import ErrorClass from '../types/error';

const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tokenHeader = req.headers.authorization?.split(' ');
    if (!tokenHeader) {
      next(new ErrorClass('Auth token missing', 422));
    }
    if (tokenHeader[0] !== 'Bearer') {
      next(new ErrorClass('Add a Bearer Token', 401));
    }
    if (tokenHeader.length !== 2) {
      next(new ErrorClass('Invalid Token Format', 401));
    }
    const token = tokenHeader[1];
    verify(token, config.auth.jwtSecret);
    res.locals.user = token;
    next();
  } catch (error: any) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
};

export default authenticate;

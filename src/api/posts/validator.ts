import { NextFunction, Request, Response } from 'express';
import LoggerInstance from '../../loaders/logger';
import { BlogSchema } from './schema';

export async function blogPostValidator(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    req.body = await BlogSchema.validate(req.body, { stripUnknown: true });
    next();
  } catch (e) {
    LoggerInstance.error(e);
    res.status(422).json({
      message: 'Validation field',
      error: e.errors.map(error => error),
    });
  }
}

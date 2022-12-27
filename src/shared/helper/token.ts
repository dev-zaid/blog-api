import * as jwt from 'jsonwebtoken';
import config from '../../config';
export const createToken = (data: { id: string }): string =>
  jwt.sign(data, config.jwtSecret, { expiresIn: '10 seconds' });
export const verifyToken = (token: string): any => jwt.verify(token, config.jwtSecret);

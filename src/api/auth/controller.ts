import database from '../../loaders/database';
import User, { LoginResponse } from './model';
import ErrorClass from '../../shared/types/error';
import bcrypt from 'bcrypt';
import { ObjectId } from 'mongodb';
import config from '../../config';
import { createToken, verifyToken } from '../../shared/helper/token';
import LoggerInstance from '../../loaders/logger';

export async function createUser(user: User): Promise<any> {
  const userExist = await (await database()).collection('users').findOne({ email: user.email });
  if (userExist) {
    throw new ErrorClass('User already exists', 404);
  }
  const saltData = await bcrypt.genSaltSync(config.auth.salt);
  user.password = await bcrypt.hashSync(user.password, saltData);
  const userID = ObjectId();
  await (await database()).collection('users').insertOne({ _id: userID, ...user });
  await (await database()).collection('user-profile').insertOne({ userID: userID, blogs: [] });
  return {
    success: true,
    message: 'User created successfully',
    status: 200,
  };
}

export async function loginUserByEmail(email: string, password: string): Promise<LoginResponse> {
  const user = await (await database()).collection('users').findOne({ email: email });
  if (!user) {
    throw new ErrorClass('User not found. Please Sign Up', 404);
  }
  if (bcrypt.compareSync(password, user.password)) {
    return {
      status: 200,
      message: 'Login successful',
      token: createToken({ id: user._id.toString() }),
    };
  }
  return { status: 401, message: 'Invalid credentials' };
}

export async function getProfile(id: string): Promise<User> {
  const user = await (await database()).collection('user-profile').findOne({ userID: new ObjectId(id) });
  if (!user) {
    throw {
      message: 'User does not exist',
      status: 404,
    };
  }
  return user;
}

import * as yup from 'yup';

const login = {
  email: yup.string().email('Enter a valid email').required('Email is required'),
  password: yup.string().min(6, 'Password should be greater than 6 characters').required('Password is required'),
};

const signUp = {
  name: yup.string().required('Name is required'),
  email: yup.string().email('Enter a valid email').required('Email is required'),
  password: yup.string().min(6, 'Password should be greater than 6 characters').required('Password is required'),
  phone: yup.number().min(10).required('Phone number is required'),
};

const getProfile = {
  authorization: yup.string().required('token missing'),
};

export const loginSchema = new yup.ObjectSchema(login);
export const signUpSchema = new yup.ObjectSchema(signUp);
export const getProfileSchema = new yup.ObjectSchema(getProfile);

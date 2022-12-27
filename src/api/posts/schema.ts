import * as yup from 'yup';

const blogData = {
  title: yup.string().required(),
  content: yup.array(yup.string().required()).required(),
};

export const BlogSchema = new yup.ObjectSchema(blogData);

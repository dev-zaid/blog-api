import * as yup from 'yup';

const blogData = {
  id: yup.string().required(),
  title: yup.string().required(),
  content: yup.string().required(),
  author: yup.string().required(),
  createdAt: yup.string().required(),
  lastModified: yup.string().required(),
  likes: yup.array(yup.string()).required(),
};

export const BlogSchema = new yup.ObjectSchema(blogData);

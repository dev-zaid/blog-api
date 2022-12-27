import { Router, Request, Response } from 'express';
import LoggerInstance from '../../loaders/logger';
import { deletePost, postBlog, updatePost } from './controller';
import { blogPostValidator } from './validator';
import { verifyToken } from '../../shared/helper/token';
import ErrorClass from '../../shared/types/error';
import { ObjectID } from 'mongodb';
import authenticate from '../../shared/middleware/authentication';

const blogPostRouter = Router();

async function handleBlogPost(req: Request, res: Response) {
  try {
    const postBlogStatus = await postBlog(req.body, res.locals.user);
    res.status(200).json({
      message: postBlogStatus.message,
    });
  } catch (e) {
    LoggerInstance.error(e);
    res.status(e.status || 500).json({
      message: e.message || 'Request Failed',
    });
  }
}

async function handleUpdatePost(req: Request, res: Response) {
  try {
    const updatePostStatus = await updatePost(req.params.id, req.body, res.locals.user);
    res.status(200).json({
      message: updatePostStatus.message,
    });
  } catch (e) {
    LoggerInstance.error(e);
    res.status(e.status || 500).json({
      message: e.message || "Post couldn't be updated",
    });
  }
}

async function handleDeletePost(req: Request, res: Response) {
  try {
    const deletePostStatus = await deletePost(req.params.id, res.locals.user);
    res.status(200).json({
      message: deletePostStatus.message,
    });
  } catch (e) {
    LoggerInstance.error(e);
    res.status(e.status || 500).json({
      message: e.message || "Post couldn't be deleted",
    });
  }
}

blogPostRouter.post('/', blogPostValidator, authenticate, handleBlogPost);
blogPostRouter.put('/:id', blogPostValidator, authenticate, handleUpdatePost);
blogPostRouter.delete('/:id', blogPostValidator, authenticate, handleDeletePost);

export default blogPostRouter;

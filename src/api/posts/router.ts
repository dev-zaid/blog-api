import { Router, Request, Response } from 'express';
import LoggerInstance from '../../loaders/logger';
import { postBlog, updatePost } from './controller';
import { blogPostValidator } from './validator';
import { verifyToken } from '../../shared/helper/token';
import ErrorClass from '../../shared/types/error';
import { ObjectID } from 'mongodb';

const blogPostRouter = Router();

async function handleBlogPost(req: Request, res: Response) {
  try {
    const id = verifyToken(req.headers.authorization?.split(' ')[1]);
    if (!id) {
      throw new ErrorClass('Unauthorized', 401);
    }
    const postBlogStatus = await postBlog(req.body, new ObjectID(id.id));
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
    const UserID = await verifyToken(req.headers.authorization?.split(' ')[1]);
    if (!UserID) {
      throw new ErrorClass('Unauthorized', 401);
    }
    const updatePostStatus = await updatePost(req.params.id, req.body, UserID.id);
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

async function handleDeletePost(req:Request, res: Response) {
  
}

blogPostRouter.post('/', blogPostValidator, handleBlogPost);
blogPostRouter.put('/:id', blogPostValidator, handleUpdatePost);

export default blogPostRouter;

import { Router, Request, Response } from 'express';
import LoggerInstance from '../../loaders/logger';
import { getAllComments, getCommentByID, postComment, updateComment } from './controller';
import authenticate from '../../shared/middleware/authentication';

const commentRouter = Router();

async function handleGetAllComments(req: Request, res: Response) {
  try {
    const response = await getAllComments(req.body.PostID);
    res.status(200).json({
      comments: response.data,
      message: response.message,
    });
  } catch (e) {
    LoggerInstance.error(e);
    res.status(e.status || 500).json({
      message: e.message || "Comments couldn't be fetched",
    });
  }
}

async function handleCommentByID(req: Request, res: Response) {
  try {
    const response = await getCommentByID(req.params.id);
    res.status(200).json({
      comment: response.data,
      message: response.message,
    });
  } catch (e) {
    LoggerInstance.error(e);
    res.status(e.status || 500).json({
      message: e.message || "Comment couldn't be fetched",
    });
  }
}

async function handlePostComment(req: Request, res: Response) {
  try {
    const response = await postComment(req.body.postID, req.body.comment, res.locals.user.id);
    res.status(200).json({
      comment: response.data,
      message: response.message,
    });
  } catch (e) {
    LoggerInstance.error(e);
    res.status(e.status || 500).json({
      message: e.message || "Comment couldn't be posted",
    });
  }
}

async function handleUpdateComment(req: Request, res: Response) {
  try {
    const response = await updateComment(req.body.comment, req.params.id, res.locals.user.id);
    res.status(200).json({
      comment: response.data,
      message: response.message,
    });
  } catch (e) {
    LoggerInstance.error(e);
    res.status(e.status || 500).json({
      message: e.message || "Comment couldn't be updated",
    });
  }
}

commentRouter.get('/', handleGetAllComments);
commentRouter.get('/:id', handleCommentByID);
commentRouter.post('/', authenticate, handlePostComment);
commentRouter.post('/:id', authenticate, handleUpdateComment);

export default commentRouter;

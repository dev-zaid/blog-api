import { Router, Request, Response } from 'express';
import LoggerInstance from '../../loaders/logger';
import { verifyToken } from '../../shared/helper/token';
import authenticate from '../../shared/middleware/authentication';
import { likePost, unlikePost } from './controller';

const likeRouter = Router();
const unlikeRouter = Router();

async function handleLike(req: Request, res: Response) {
  try {
    const likeStatus = await likePost(req.body.PostID, res.locals.user.id);
    res.status(200).json({
      message: likeStatus.message,
    });
  } catch (e) {
    LoggerInstance.error(e);
    res.status(e.status || 500).json({
      message: e.message || 'Error liking the post',
    });
  }
}
async function handleUnlike(req: Request, res: Response) {
  try {
    const unlikeStatus = await unlikePost(req.body.PostID, res.locals.user.id);
    res.status(200).json({
      message: unlikeStatus.message,
    });
  } catch (e) {
    LoggerInstance.error(e);
    res.status(e.status || 500).json({
      message: e.message || 'Error unliking the post',
    });
  }
}

likeRouter.post('/', authenticate, handleLike);
unlikeRouter.post('/', authenticate, handleUnlike);

export { likeRouter, unlikeRouter };

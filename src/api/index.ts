import { Router } from 'express';
import loginRouter, { signupRouter, userRouter } from './auth/router';
import commentRouter from './comments/router';
import { likeRouter, unlikeRouter } from './like/router';
import blogPostRouter from './posts/router';

export default (): Router => {
  const app = Router();

  app.use('/login', loginRouter);
  app.use('/signup', signupRouter);
  app.use('/users', userRouter);
  app.use('/posts', blogPostRouter);
  app.use('/like', likeRouter);
  app.use('/unlike', unlikeRouter);
  app.use('/comments', commentRouter);

  //TODO: add routes here...

  return app;
};

import { Router } from 'express';
import loginRouter, { signupRouter, userRouter } from './auth/router';
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

  //TODO: add routes here...

  return app;
};

import { Router } from 'express';
import adaptRoute from '../adpters/express-route-adpter';
import createUser from '../factories/controllers/user/create-user';
import findUsers from '../factories/controllers/user/find-users';
import authorizator from '../factories/middlewares/authorizator';
import adaptMiddleware from '../adpters/express-middleware-adpter';

const userRouter  = Router();

userRouter.post('/', adaptRoute(createUser));
userRouter.get('/', 
  adaptMiddleware(authorizator),
  adaptRoute(findUsers),
);

export default userRouter;
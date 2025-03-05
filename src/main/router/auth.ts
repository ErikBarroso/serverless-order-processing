import { Router } from 'express';
import adaptValidationMiddleware from '../adpters/validate-schema';
import { loginSchema } from '../../presentation/helpers/login-validator';
import adaptRoute from '../adpters/express-route-adpter';
import login from '../factories/controllers/auth/login';


const authRouter = Router();

authRouter.post('/', adaptValidationMiddleware(loginSchema), adaptRoute(login));

export default authRouter;
import { Router } from 'express';
import adaptValidationMiddleware from '../adpters/validate-schema';
import { loginSchema } from '../../presentation/helpers/login-validator';
import adaptRoute from '../adpters/express-route-adpter';
import login from '../factories/controllers/auth/login';
import rateLimit from 'express-rate-limit';

const authRouter = Router();

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 15,
  standardHeaders: true,
  legacyHeaders: false,
  handler(req, res /* next */) {
    res.status(429).json({
      message: 'Muitas requisições! Tente novamente mais tarde.',
    });
  },
});

authRouter.post('/', limiter, adaptValidationMiddleware(loginSchema), adaptRoute(login));

export default authRouter;
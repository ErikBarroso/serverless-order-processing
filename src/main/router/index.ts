import { Router } from 'express';
import productRouter from './product';
import orderRouter from './order';
import userRouter from './user';
import authRouter from './auth';

const router = Router();

router.use('/products', productRouter);
router.use('/orders', orderRouter);
router.use('/users', userRouter);
router.use('/login', authRouter);

export default router;
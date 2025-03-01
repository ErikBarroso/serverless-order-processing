import { Router } from 'express';
import productRouter from './product';
import orderRouter from './order';
import userRouter from './user';

const router = Router();

router.use('/products', productRouter);
router.use('/orders', orderRouter);
router.use('/users', userRouter);

export default router;
import { Router } from 'express';
import adaptRoute from '../adpters/express-route-adpter';
import findOrders from '../factories/controllers/find-orders';
import createOrder from '../factories/controllers/create-order';
import deleteOrder from '../factories/controllers/delete-order';
import getOrderById from '../factories/controllers/get-order-by-id';

const orderRouter  = Router();

orderRouter.post('/', adaptRoute(createOrder));
orderRouter.delete('/:id',adaptRoute(deleteOrder));
orderRouter.get('/:id',adaptRoute(getOrderById));
orderRouter.get('/', adaptRoute(findOrders));

export default orderRouter;
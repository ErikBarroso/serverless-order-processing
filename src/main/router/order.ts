import { Router } from 'express';
import adaptRoute from '../adpters/express-route-adpter';
import findOrders from '../factories/controllers/find-orders';
import createOrder from '../factories/controllers/create-order';
import deleteOrder from '../factories/controllers/delete-order';
import getOrderById from '../factories/controllers/get-order-by-id';
import adaptMiddleware from '../adpters/express-middleware-adpter';
import authorizator from '../factories/middlewares/authorizator';

const orderRouter  = Router();

orderRouter.post('/', 
  adaptMiddleware(authorizator),
  adaptRoute(createOrder),
);

orderRouter.delete('/:id',
  adaptMiddleware(authorizator),
  adaptRoute(deleteOrder),
);

orderRouter.get('/:id',
  adaptMiddleware(authorizator),
  adaptRoute(getOrderById),
);

orderRouter.get('/', 
  adaptRoute(findOrders),
);

export default orderRouter;
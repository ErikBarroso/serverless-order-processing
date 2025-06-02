import { Router } from 'express';
import adaptRoute from '../adpters/express-route-adpter';
import findOrders from '../factories/controllers/find-orders';
import createOrder from '../factories/controllers/create-order';
import deleteOrder from '../factories/controllers/delete-order';
import getOrderById from '../factories/controllers/get-order-by-id';
import processQueue from '../factories/controllers/process-queue';
import queueWorkerControl from '../factories/controllers/queue-worker-control';
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
  adaptMiddleware(authorizator),
  adaptRoute(findOrders),
);

// Rota para processar mensagens da fila SQS manualmente
orderRouter.post('/process-queue',
  adaptMiddleware(authorizator),
  adaptRoute(processQueue),
);

// Rotas para controlar o worker da fila
orderRouter.get('/worker/:action',
  adaptMiddleware(authorizator),
  adaptRoute(queueWorkerControl),
);

orderRouter.post('/worker/:action', 
  adaptMiddleware(authorizator),
  adaptRoute(queueWorkerControl),
);

export default orderRouter;
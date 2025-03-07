import { Router } from 'express';
import adaptRoute from '../adpters/express-route-adpter';
import getProductById from '../factories/controllers/product/get-product-by-id';
import findProducts from '../factories/controllers/product/find-products';
import deleteProduct from '../factories/controllers/product/delete-product';
import createProduct from '../factories/controllers/product/create-product';
import adaptMiddleware from '../adpters/express-middleware-adpter';
import authorizator from '../factories/middlewares/authorizator';
import getProductByName from '../factories/controllers/product/get-product-by-name';

const productRouter  = Router();

productRouter.post('/', 
  adaptMiddleware(authorizator),
  adaptRoute(createProduct),
);

productRouter.delete('/:id', 
  adaptMiddleware(authorizator),
  adaptRoute(deleteProduct),
);

productRouter.get('/id/:id', 
  adaptMiddleware(authorizator),
  adaptRoute(getProductById),
);

productRouter.get('/name/:name', 
  adaptMiddleware(authorizator),
  adaptRoute(getProductByName),
);

productRouter.get('/', adaptRoute(findProducts));

export default productRouter;
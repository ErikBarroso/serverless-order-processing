import { Router } from 'express';
import adaptRoute from '../adpters/express-route-adpter';
import getProductById from '../factories/controllers/product/get-product-by-id';
import findProducts from '../factories/controllers/product/find-products';
import deleteProduct from '../factories/controllers/product/delete-product';
import createProduct from '../factories/controllers/product/create-product';

const productRouter  = Router();
productRouter.post('/', adaptRoute(createProduct));
productRouter.delete('/:id', adaptRoute(deleteProduct));
productRouter.get('/:id', adaptRoute(getProductById));
productRouter.get('/', adaptRoute(findProducts));

export default productRouter;
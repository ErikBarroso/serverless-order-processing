import {  NextFunction, Request, Response } from 'express';
import { PresentationRequest } from '../../presentation/protocols/reqRes';

const adaptMiddleware = (factoryFn: () => any, params?: any) => (
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const middleware = factoryFn();
    const middlewareResponse = await middleware.handle(req as PresentationRequest, params);
    if (middlewareResponse.statusCode !== 200) {
      res.status(middlewareResponse.statusCode).json(middlewareResponse.body);
      return;
    }
    next();
  }
);
export default adaptMiddleware;
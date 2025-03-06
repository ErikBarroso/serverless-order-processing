import { Response, Request } from 'express';
import { Controller } from '../../presentation/protocols/controller';

export interface RequestMain extends Request {
    currentUser?: string
}

const adaptRoute = (factoryFn: () => Controller<any>) => (
  async (req: RequestMain, res: Response): Promise<void> =>  {
    const httpRequest = {
      request: {
        verb: req.method,
        path: req.path,
        route: req.route.path,
      },
      body: req.body,
      query: req.query,
      params: req.params,
      headers: req.header ,
      currentUser: req.currentUser,
    };

    const controller = factoryFn();
    const httpResponse = await controller.handle(httpRequest);
    res.status(httpResponse.statusCode).json(httpResponse.body);
  }
);

export default adaptRoute;

import { Response, Request } from 'express';
import { Controller } from '../../presentation/protocols/controller';

const adaptRoute = (factoryFn: () => Controller<any>) => (
  async (req: Request, res: Response): Promise<void> =>  {
    const httpRequest = {
      body: req.body,
      params: req.params,
      query: req.query,
      headers: req.headers,
      method: req.method,
      path: req.path,
    };

    const controller = factoryFn();
    const httpResponse = await controller.handle(httpRequest);
    res.status(httpResponse.statusCode).json(httpResponse.body);
  }
);

export default adaptRoute;

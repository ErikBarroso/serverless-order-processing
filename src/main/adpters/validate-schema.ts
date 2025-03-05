import { NextFunction, Request, Response } from 'express';
import { ZodSchema } from 'zod';

const adaptValidationMiddleware = (schema: ZodSchema<any>) => 
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ error: result.error.format() });
      return;
    }
    req.body = result.data;
    next();
  };

export default adaptValidationMiddleware;
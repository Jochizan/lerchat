import { NextFunction, Request, Response } from 'express';

const asyncHandler =
  (
    controllerFunc: (
      req: Request,
      res: Response,
      next?: NextFunction
    ) => Promise<void>
  ) =>
  (req: Request, res: Response, next?: NextFunction) =>
    Promise.resolve(controllerFunc(req, res, next)).catch(
      next ||
        ((err: any) => {
          console.error(err);
          res.status(500).send({ msg: err.message, err });
        })
    );

export default asyncHandler;

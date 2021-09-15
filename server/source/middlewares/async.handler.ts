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
    Promise.resolve(controllerFunc(req, res, next))
      .catch(
        next ||
          ((err: any) => {
            console.error(err);
            res
              .status(500)
              .type('json')
              .send({ msg: err.message || 'Internal Error', err });
          })
      )
      .finally(() =>
        console.info(req.url, req.headers.host, req.body, req.params, req.query)
      );

export default asyncHandler;

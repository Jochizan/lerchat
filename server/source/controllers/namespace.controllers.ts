import { Request, Response } from 'express';
import asyncHandler from '../middlewares/async.handler';
import Namespace from '../models/Namespace';

export const createNamespace = asyncHandler(
  async (req: Request, res: Response) => {
    const data = req.body;

    const _namespace = await Namespace.create(data);

    res.status(201).send({ msg: 'Create namespace success', _namespace });
  }
);

export const getAllNamespaces = asyncHandler(
  async (req: Request, res: Response) => {
    const _namespaces = await Namespace.find();

    res.status(200).send({ msg: 'Get all namespaces', _namespaces });
  }
);

export const getNamespacesByServer = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const _namespaces = await Namespace.find({ server: id });

    res
      .status(200)
      .send({ msg: `Get all namespaces by ${id} server`, _namespaces });
  }
);

export const updateNamespace = asyncHandler(
  async (req: Request, res: Response) => {}
);

export const deleteNamespace = asyncHandler(
  async (req: Request, res: Response) => {}
);

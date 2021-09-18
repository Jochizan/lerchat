import { Request, Response } from 'express';
import asyncHandler from '../middlewares/async.handler';
import Server from '../models/Server';

export const createServer = asyncHandler(
  async (req: Request, res: Response) => {
    const data = req.body;

    const _server = await Server.create(data);

    res.status(201).send({ msg: 'Create server success', _server });
  }
);

export const getAllServers = asyncHandler(
  async (req: Request, res: Response) => {
    const _servers = await Server.find();

    res.status(200).send({ msg: 'Get all servers', _servers });
  }
);

export const getServersByCreator = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const _servers = await Server.find({ creator: id });

    res.status(200).send({ msg: `Get all servers by creator ${id}`, _servers });
  }
);

export const updateServer = asyncHandler(
  async (req: Request, res: Response) => {}
);

export const deleteServer = asyncHandler(
  async (req: Request, res: Response) => {}
);

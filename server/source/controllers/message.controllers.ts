import { Request, Response } from 'express';
import asyncHandler from '../middlewares/async.handler';
import Message from '../models/Message';

export const createMessage = asyncHandler(
  async (req: Request, res: Response) => {}
);

export const getAllMessages = asyncHandler(
  async (req: Request, res: Response) => {
    const _messages = await Message.find();

    res.status(200).send({ msg: 'Get all messages', _messages });
  }
);

export const getMessagesByNamespace = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const _messages = await Message.find({ namespace: id });

    res.status(200).send({ msg: `Messages obtained from ${id}`, _messages });
  }
);

export const updateMessage = asyncHandler(
  async (req: Request, res: Response) => {}
);

export const deleteMessage = asyncHandler(
  async (req: Request, res: Response) => {}
);

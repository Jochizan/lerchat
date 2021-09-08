import { createConnection } from 'mongoose';
import { Request, Response } from 'express';
import Message from '../models/Message';
import UserSchema from '../models/User';
import config from '../config/config';

export const getMessageWithUser = async (req: Request, res: Response) => {
  const _messages = await Message.find();
  const _usersId = _messages.map((el) => el.author);

  const connection = createConnection(config.UL_DB);

  const UserModel = connection.model('Users', UserSchema);

  const _users = await UserModel.find({
    _id: {
      $in: _usersId
    }
  });

  res
    .status(200)
    .json({ message: 'Se obtuvieron todos los mensajes', _messages, _users });
};

export const createMessage = async (req: Request, res: Response) => {
  const data = req.body;

  const _message = await Message.create({
    ...data
  });

  res.status(201).json({ message: 'Se creo el mensaje', _message });
};

export const updateMessage = async (req: Request, res: Response) => {
  const id = req.params.id;
  const _message = await Message.findByIdAndUpdate(id, req.body, { new: true });

  res.status(201).json({ message: 'Se actualizao el mensaje', _message });
};

export const deleteMessage = async (req: Request, res: Response) => {
  const id = req.params.id;
  const _message = await Message.findByIdAndDelete(id);

  res.status(201).json({ message: 'Se borro el mensage', _message });
};

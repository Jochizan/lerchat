import { Router } from 'express';
import {
  createMessage,
  deleteMessage,
  getMessageWithUser,
  updateMessage
} from '../controllers/message.controller';

const router = Router();

/* Create message */
router.post('/', createMessage);

/* Read message */
router.get('/', getMessageWithUser);

/* Update message by id */
router.put('/:id', updateMessage);

/* Delete message by id */
router.delete('/:id', deleteMessage);

export default router;

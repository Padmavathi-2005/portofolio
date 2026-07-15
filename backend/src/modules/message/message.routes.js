import { Router } from 'express';
import * as messageController from './message.controller.js';
import { verifyAdminToken } from '../admin/admin.middleware.js';

const router = Router();

// Public route to submit a contact message
router.post('/', messageController.createMessage);

// Admin routes
router.get('/', verifyAdminToken, messageController.getMessages);
router.patch('/:id', verifyAdminToken, messageController.updateMessageReadStatus);
router.delete('/:id', verifyAdminToken, messageController.deleteMessage);

export default router;

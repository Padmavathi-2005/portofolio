import { Router } from 'express';
import * as adminController from './admin.controller.js';
import { verifyAdminToken } from './admin.middleware.js';

const router = Router();

router.post('/login', adminController.login);
router.get('/me', verifyAdminToken, adminController.checkAuth);

export default router;

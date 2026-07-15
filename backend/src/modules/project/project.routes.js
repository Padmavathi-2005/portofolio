import { Router } from 'express';
import * as projectController from './project.controller.js';
import { verifyAdminToken } from '../admin/admin.middleware.js';

const router = Router();

// Public routes
router.get('/', projectController.getProjects);
router.get('/:id', projectController.getProject);

// Admin-only routes
router.post('/', verifyAdminToken, projectController.createProject);
router.put('/:id', verifyAdminToken, projectController.updateProject);
router.delete('/:id', verifyAdminToken, projectController.deleteProject);

export default router;

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { errorHandler } from './middlewares/error.js';

// Import routers
import adminRouter from './modules/admin/admin.routes.js';
import projectRouter from './modules/project/project.routes.js';
import messageRouter from './modules/message/message.routes.js';

dotenv.config();

const app = express();

// Global Middlewares
app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Base API route
app.get('/', (req, res) => {
  res.status(200).json({ success: true, message: 'Portfolio API Server is Running' });
});

// Module Routes
app.use('/api/admin', adminRouter);
app.use('/api/projects', projectRouter);
app.use('/api/messages', messageRouter);

// Global Error Handler Middleware
app.use(errorHandler);

export default app;

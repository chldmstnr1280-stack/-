/**
 * SELLERY Backend Server
 * Express + TypeScript + MongoDB
 */

import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDatabase } from './config/database';

// Routes
import authRoutes from './routes/auth.routes';
import emotionRoutes from './routes/emotion.routes';
import routineRoutes from './routes/routine.routes';
import surveyRoutes from './routes/survey.routes';
import sellyRoutes from './routes/selly.routes';

// Load environment variables
dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'sellery-backend',
  });
});

// API info
app.get('/api', (req: Request, res: Response) => {
  res.json({
    message: 'SELLERY API v1',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      emotions: '/api/emotions',
      routines: '/api/routines',
      surveys: '/api/surveys',
      selly: '/api/selly',
    },
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/emotions', emotionRoutes);
app.use('/api/routines', routineRoutes);
app.use('/api/surveys', surveyRoutes);
app.use('/api/selly', sellyRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested resource does not exist',
  });
});

// Error handler
app.use((err: Error, req: Request, res: Response, next: any) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
  });
});

// Start server
const startServer = async () => {
  try {
    // Connect to database
    await connectDatabase();

    // Start listening
    app.listen(PORT, () => {
      console.log('🚀 SELLERY Backend Server Started');
      console.log(`📍 Port: ${PORT}`);
      console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 Health check: http://localhost:${PORT}/health`);
      console.log(`🔗 API endpoint: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;

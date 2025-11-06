import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yaml';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import emotionRoutes from './routes/emotion.js';
import mascotRoutes from './routes/mascot.js';
import reportRoutes from './routes/report.js';
import stepRoutes from './routes/steps.js';
import cycleRoutes from './routes/cycle.js';
import stubRoutes from './routes/stubs.js';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/auth', authRoutes);
app.use('/', userRoutes); // /me
app.use('/emotion', emotionRoutes);
app.use('/mascot', mascotRoutes);
app.use('/report', reportRoutes);
app.use('/steps', stepRoutes); // Phase 2: Step tracking
app.use('/cycle', cycleRoutes); // Phase 2: Cycle tracking
app.use('/', stubRoutes); // Phase 2/3 remaining stubs

// OpenAPI Documentation
try {
  const openApiPath = join(__dirname, '../openapi.yaml');
  const openApiDoc = YAML.parse(readFileSync(openApiPath, 'utf8'));
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(openApiDoc));
  console.log('📚 OpenAPI docs available at /docs');
} catch (error) {
  console.warn('⚠️  OpenAPI documentation not available:', error);
}

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🌱 SELLERY Server is running`);
  console.log(`   Port: ${PORT}`);
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`   API Docs: http://localhost:${PORT}/docs`);
  console.log(`   Health: http://localhost:${PORT}/health\n`);
});

export default app;

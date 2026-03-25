import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import logger from './utils/logger';
import routes from './routes';
import { setupSwagger } from './config/swagger';
import { errorHandler } from './middlewares/error.middleware';
import { apiLimiter } from './middlewares/rateLimit.middleware';

const app: Application = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use('/api/', apiLimiter); // Apply rate limiter to API routes

// Logging middleware
app.use(morgan('dev', {
  stream: {
    write: (message) => logger.info(message.trim())
  }
}));

// v1 api routes
app.use('/api', routes);

// Setup Swagger UI
setupSwagger(app);

// Basic route
app.get('/', (req: Request, res: Response) => {
  res.send('ReputeChain API is running. Visit /api-docs for documentation.');
});

// Global Error Handler
app.use(errorHandler);

export default app;
// Trigger restart for PUSH0 bug fix target paris
// Trigger restart for PUSH0 bug fix target paris
// Trigger restart for ABI schema bug
// Trigger restart for PUSH0 bug fix target paris
// Trigger restart for ABI schema bug
// Trigger restart for ABI schema bug
// Trigger restart for manual Ganache reboot
// Trigger restart for PUSH0 bug fix target paris
// Trigger restart for ABI schema bug
// Trigger restart for manual Ganache reboot
// Trigger restart for Out Of Gas payload override
// Trigger restart for GitHub scraper 404 exceptions
// Trigger restart for API interceptor console dump
// Trigger restart for auth.middleware bypass

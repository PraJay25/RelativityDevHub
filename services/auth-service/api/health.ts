import { Request, Response } from 'express';

export default function handler(req: Request, res: Response) {
  // Simple health check that doesn't require database connection
  return res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'auth-service',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
  });
}

import { Request, Response } from 'express';
import serverless from 'serverless-http';

// Import the bootstrap function
let bootstrap: any;
try {
  bootstrap = require('../src/main.vercel').default;
} catch (error) {
  console.error('Failed to import bootstrap:', error);
}

let server: any;

async function getServer() {
  if (!server) {
    try {
      if (!bootstrap) {
        throw new Error('Bootstrap function not available');
      }

      const app = await bootstrap();
      if (!app || !app.getHttpAdapter) {
        throw new Error('Invalid app instance');
      }

      const expressInstance = app.getHttpAdapter().getInstance();
      server = serverless(expressInstance);
    } catch (error) {
      console.error('Failed to bootstrap application:', error);
      throw error;
    }
  }
  return server;
}

export default async function handler(req: Request, res: Response) {
  try {
    const srv = await getServer();
    return srv(req, res);
  } catch (error) {
    console.error('Handler error:', error);

    // Return a proper error response
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to process request',
      timestamp: new Date().toISOString(),
      path: req.url,
    });
  }
}

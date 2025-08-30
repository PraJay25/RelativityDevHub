import { Request, Response } from 'express';
import serverless from 'serverless-http';
import bootstrap from '../src/main.vercel';

let server: any;

async function getServer() {
  if (!server) {
    try {
      const app = await bootstrap();
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
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to process request',
    });
  }
}

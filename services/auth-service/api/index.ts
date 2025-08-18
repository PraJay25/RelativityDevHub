import { Request, Response } from 'express';
import serverless from 'serverless-http';
import bootstrap from '../src/main.vercel';

let server: any;

async function getServer() {
  if (!server) {
    const app = await bootstrap();
    const expressInstance = app.getHttpAdapter().getInstance();
    server = serverless(expressInstance);
  }
  return server;
}

export default async function handler(req: Request, res: Response) {
  const srv = await getServer();
  return srv(req, res);
}

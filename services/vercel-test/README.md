# vercel-test

A minimal Vercel Serverless Function to verify deployment works.

## Endpoint

- GET `/api/hello` → returns a JSON hello message

## Deploy

1. In Vercel Dashboard, create a new project
   - Root Directory: `services/vercel-test`
2. Or using CLI (after `vercel login`):

```bash
vercel --prod
```

Then open `https://<your-project>.vercel.app/api/hello`.

# ShopMind AI API

Node.js + Express backend for the ShopMind shopping assistant.

## Requirements

- Node.js 20+
- An Anthropic API key with API billing enabled

## Run locally

1. Open a terminal in the `server` folder.
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env` and set `ANTHROPIC_API_KEY`.
4. Start the API: `npm run dev`
5. Check `http://localhost:4000/api/health`.

Configure the React app's environment variable in its root `.env.local`:

```env
VITE_SHOPMIND_API_URL=http://localhost:4000/api/chat
```

Restart Vite after changing environment variables.

## Endpoints

- `GET /api/health`: health and configuration status.
- `POST /api/chat`: accepts `{ "message": "...", "history": [{ "role": "user", "content": "..." }] }` and returns `{ "reply": "...", "products": [...] }`.

The API fetches current demo catalog data from DummyJSON, then asks Claude to recommend only products in that response. The current storefront's sample catalog is not a merchant database; replace the catalog adapter with your real product database before using ShopMind with live merchants.

## Deployment

Deploy this folder as a Node web service. Configure `ANTHROPIC_API_KEY`, `ANTHROPIC_MODEL`, `CLIENT_ORIGIN`, and `PORT` in the host's environment settings. Set `CLIENT_ORIGIN` to the exact deployed frontend origin (for example, your Netlify site URL). Set the frontend's `VITE_SHOPMIND_API_URL` to the full deployed `/api/chat` URL and redeploy the frontend.

Never put the Anthropic key in a `VITE_*` variable or frontend code. API usage can incur charges; configure provider spend limits and monitor usage.

# Fake News Checker UI

React + Vite + Tailwind CSS v4. Runs on dummy data by default.

    npm install
    npm run dev

Open http://localhost:5173

To use a real backend later: copy `.env.example` to `.env.local`, set `VITE_USE_MOCK=false`
and `VITE_API_URL` to your API. The UI calls `POST {VITE_API_URL}/check` with `{ "claim": "..." }`.

In mock mode, a claim containing the word "error" shows the error state.

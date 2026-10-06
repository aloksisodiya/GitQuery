# GitQuery client

The frontend is a React 19 single-page application built with Vite, JavaScript, React Router, and Tailwind CSS 4.

## Development

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

The app is served at `http://localhost:5173` and talks to the backend at `http://localhost:8080` by default. Set `VITE_API_BASE_URL` in an `.env` file to use another backend URL.

## Checks

```bash
npm run lint
npm run build
```

Routes are defined in `src/App.js`. Reusable UI, feature components, hooks, and API modules remain separated under `components/`, `hooks/`, and `lib/`.

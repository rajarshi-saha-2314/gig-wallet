# gig-wallet

An AI-driven personal finance coach for people with irregular/gig income (freelancers, students with side income, gig workers). Unlike typical budgeting apps that assume a fixed monthly salary, gig-wallet analyzes income *volatility* and gives income-variability-aware spending guidance, plus a conversational assistant for "can I afford this?" style questions.

## Features

- **JWT auth** — signup/login with bcrypt-hashed passwords.
- **CSV statement upload** — parses a simple `date,description,amount,type` bank/UPI export into stored transactions.
- **AI transaction categorization** — batches uncategorized transactions to Groq (`openai/gpt-oss-20b`) to classify them into spending categories.
- **Statistical "safe to spend" forecast** — plain JS statistics (rolling mean/stdDev of monthly income, no LLM) computes a conservative safe-spend number and confidence interval; recomputed on demand and refreshed monthly by a `node-cron` job.
- **Conversational assistant** — a "can I afford this?" chat grounded in the user's real transaction summary and forecast, powered by Groq (`openai/gpt-oss-120b`).

## Tech Stack

- **Frontend:** React (Vite), react-router-dom, Context API, axios
- **Backend:** Node.js + Express
- **Database:** MongoDB (Mongoose), MongoDB Atlas
- **AI/LLM:** Groq API (`groq-sdk`)
- **Auth:** JWT + bcrypt
- **Scheduled jobs:** node-cron
- **CSV parsing:** csv-parser

## Project Structure

```
gig-wallet/
├── client/   # React frontend (Vite)
└── server/   # Node/Express backend
```

## Local Setup

### Prerequisites

- Node.js 18+
- A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster (free tier is fine) — get a connection string from "Connect → Drivers"
- A [Groq API key](https://console.groq.com) (Settings → API Keys)

### Server

```bash
cd server
npm install
cp .env.example .env
```

Fill in `server/.env`:

| Variable | Required | Notes |
|---|---|---|
| `MONGO_URI` | yes | Atlas connection string |
| `JWT_SECRET` | yes | any long random string, e.g. `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `GROQ_API_KEY` | yes | needed for categorization + assistant |
| `PORT` | no | defaults to 5000 |
| `CLIENT_ORIGIN` | no | restricts CORS to this origin; leave unset in local dev |

```bash
npm run dev   # starts on http://localhost:5000, auto-restarts on file changes
```

### Client

```bash
cd client
npm install
cp .env.example .env
```

`client/.env` just needs:

```
VITE_API_BASE_URL=http://localhost:5000/api
```

```bash
npm run dev   # starts on http://localhost:5173
```

## API Overview

All routes below except `/auth/*` and `/health` require `Authorization: Bearer <token>`.

| Method | Path | Description |
|---|---|---|
| GET | `/api/health` | Liveness check |
| POST | `/api/auth/signup` | Create an account, returns `{ token, user }` |
| POST | `/api/auth/login` | `{ token, user }` |
| POST | `/api/upload` | Multipart upload: `file` (CSV) + `source` (`upi`\|`bank`) |
| GET | `/api/transactions` | List the current user's transactions |
| GET | `/api/transactions/:id` | Get one transaction |
| POST | `/api/transactions/categorize` | Categorize all of the user's uncategorized transactions via Groq |
| GET | `/api/forecast` | Compute/refresh this month's safe-to-spend forecast |
| POST | `/api/assistant` | `{ question }` → `{ answer }`, grounded in the user's data |

### CSV format

Uploads are expected as:

```
date,description,amount,type
2024-01-05,Salary Credit,50000,credit
2024-01-06,Swiggy Order,450,debit
```

`date` is `YYYY-MM-DD`, `amount` is always positive, `type` is `credit` or `debit`.

## Deployment

- **Frontend → Vercel:** import the `client/` directory as the project root (Vite is auto-detected). Set `VITE_API_BASE_URL` in the Vercel project's environment variables to your deployed backend URL. `client/vercel.json` adds the SPA rewrite needed for react-router's client-side routes.
- **Backend → Render:** `render.yaml` at the repo root defines the service (root dir `server/`, health check at `/api/health`). Deploying it as a Blueprint will prompt you for `MONGO_URI`, `JWT_SECRET`, `GROQ_API_KEY`, and `CLIENT_ORIGIN` (set this to your Vercel URL once you have it, to lock down CORS).
- Neither platform's credentials/tokens are stored in this repo — both `.env` files are git-ignored.

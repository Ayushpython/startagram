# Quick Start — Full Stack Setup

Get the entire Idea Marketplace platform running locally in minutes.

## Prerequisites

- Node.js 14+ installed
- MongoDB running locally or MongoDB Atlas account

## One-Command Setup

```bash
# From project root
npm run install:all   # install deps in both server/ and client/
npm start             # starts both server & client concurrently
```

✅ Server running on `http://localhost:5000`
✅ Client running on `http://localhost:3000`

---

## Manual Setup (Step by Step)

### Step 1: Server Setup

```bash
cd server
npm install
cp .env.example .env
```

Edit `server/.env`:
```
MONGODB_URI=mongodb://localhost:27017/idea-marketplace
JWT_SECRET=your_super_secret_key_here
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

Start the server:
```bash
npm run dev
```

### Step 2: Client Setup

```bash
cd client
npm install
cp .env.example .env
```

Edit `client/.env`:
```
REACT_APP_API_URL=http://localhost:5000/api
```

Start the client:
```bash
npm start
```

---

## Project Structure

```
startupshhare/
├── client/                   # React app (CRA + Tailwind)
│   ├── src/
│   │   ├── pages/           # Home, Feed, Marketplace, Detail, Dashboard, Messages, Profile
│   │   ├── components/      # AuthForm, Button, Header, Feed, Layout
│   │   ├── api/             # API client (uses REACT_APP_API_URL)
│   │   ├── context/         # AuthContext
│   │   ├── hooks/           # Custom hooks
│   │   ├── data/            # Mock data
│   │   └── App.js           # Router
│   ├── .env                 # REACT_APP_API_URL
│   ├── .env.example
│   ├── package.json
│   └── tailwind.config.js
│
├── server/                   # Express API
│   ├── models/              # 8 MongoDB models
│   ├── routes/              # 10 route modules (41+ endpoints)
│   ├── middleware/          # Auth, validation, RBAC, error handler
│   ├── server.js            # Express entry point
│   ├── .env                 # PORT, MONGODB_URI, JWT_SECRET, CORS_ORIGIN
│   ├── .env.example
│   └── package.json
│
├── package.json              # Root — concurrently runs both
└── .gitignore
```

## Available Routes

### Client Pages
- `/login` — Login
- `/register` — Register
- `/home` — Social feed
- `/explore` — Discover posts & topics
- `/marketplace` — Browse blueprints
- `/blueprint/:id` — Blueprint detail
- `/my-blueprints` — User dashboard
- `/messages` — Direct chat
- `/profile` — User profile

### Server Endpoints (41+ total)
See `/server/README.md` for complete API reference.

Key endpoints:
- `POST /api/auth/register` — Create account
- `POST /api/auth/login` — Login
- `GET /api/blueprints` — List blueprints
- `POST /api/blueprints` — Create blueprint
- `POST /api/marketplace/search` — Search
- `POST /api/transactions` — Purchase blueprint
- `GET /api/wallet/:userId` — View wallet
- `GET /api/health` — Health check

## Environment Variables

### Server (.env)
| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment | `development` / `production` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/idea-marketplace` |
| `MONGODB_PROD` | Production MongoDB URI | (set for production) |
| `JWT_SECRET` | JWT signing key | (change in production!) |
| `JWT_EXPIRE` | Token expiry | `7d` |
| `CORS_ORIGIN` | Comma-separated allowed origins | `http://localhost:3000` |
| `STRIPE_SECRET_KEY` | Stripe payments | (optional) |
| `OPENAI_API_KEY` | AI validation | (optional) |

### Client (.env)
| Variable | Description | Example |
|----------|-------------|---------|
| `REACT_APP_API_URL` | Backend API base URL | `http://localhost:5000/api` |

## Deployment

### Production Build
```bash
# Build the client
cd client && npm run build

# Start production server (serves client build + API)
cd ../server
NODE_ENV=production node server.js
```

In production, the server serves the React build from `client/build/` and handles all API routes. Set `REACT_APP_API_URL=/api` (relative) for same-origin deployments.

### Railway / Render / Heroku
1. Set root directory to `server/`
2. Build command: `cd ../client && npm install && npm run build`
3. Start command: `node server.js`
4. Set all env vars in the platform dashboard

## Troubleshooting

### Client can't reach server
- Ensure server is running: `cd server && npm run dev`
- Check `client/.env` has correct `REACT_APP_API_URL`
- Restart client after changing `.env`

### Server won't start
- Check `server/.env` has valid `MONGODB_URI`
- Ensure MongoDB is running

### Port already in use
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

---

**You're all set!** Run `npm start` from the project root to launch both. 🚀

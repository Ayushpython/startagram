# Idea Marketplace Frontend

Simple React frontend for the Idea Marketplace platform.

## Features

- User authentication (login/register)
- Marketplace browsing with search and filters
- Blueprint detail pages with comments
- User dashboard with wallet and metrics
- Real-time API integration
- Responsive design

## Installation

```bash
npm install
```

## Setup

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Update the API URL if your backend is running on a different host:
```
REACT_APP_API_URL=http://localhost:5000/api
```

## Running Locally

```bash
npm start
```

The app will start on `http://localhost:3000`

## Build for Production

```bash
npm run build
```

## Project Structure

```
src/
├── api/
│   └── client.js           # API client with all endpoints
├── components/
│   ├── Header.js           # Navigation header
│   ├── AuthForm.js         # Login/register form
│   └── Button.js           # Reusable button component
├── context/
│   └── AuthContext.js      # Authentication context
├── hooks/
│   └── index.js            # Custom hooks (useAsync, useLocalStorage)
├── pages/
│   ├── Home.js             # Landing page
│   ├── LoginPage.js        # Login page
│   ├── RegisterPage.js     # Register page
│   ├── Marketplace.js      # Marketplace browser
│   ├── BlueprintDetail.js  # Single blueprint view
│   └── Dashboard.js        # User dashboard
├── App.js                  # Main app component with routing
└── index.js                # Entry point
```

## Pages

### Home (`/`)
- Landing page with CTA buttons
- Statistics display
- Links to signup/login

### Login (`/login`)
- Email and password login
- Redirects to marketplace on success

### Register (`/register`)
- User registration with role selection
- Redirects to marketplace on success

### Marketplace (`/marketplace`)
- Browse all published blueprints
- Search by keyword
- Sort by newest, price, rating
- Pagination ready

### Blueprint Detail (`/blueprint/:id`)
- Full blueprint information
- Problem statement, market research, features
- Comments section
- Purchase button (wallet-ready)
- AI validation score (when available)

### Dashboard (`/my-blueprints`, `/dashboard`)
- User wallet balance and earnings
- User metrics (blueprints created/purchased, rating)
- List of user's blueprints
- Protected route (login required)

## API Integration

All API calls go through `src/api/client.js` which handles:
- Base URL configuration
- JWT token injection to all requests
- Error handling

### API Categories

- **Auth**: login, register, logout
- **Users**: profile, ratings, save blueprints
- **Blueprints**: CRUD, publish, filter
- **Marketplace**: search, trending, recommendations
- **Comments**: create, read, update, delete
- **Collaboration**: requests, accept/reject
- **Wallet**: balance, transactions
- **Transactions**: purchases, refunds
- **Validation**: AI scores

## Authentication

JWT tokens are stored in localStorage and automatically attached to all API requests via the axios interceptor.

## Styling

- CSS Modules are used for component-scoped styling
- Global styles in `App.css`
- Responsive design with media queries
- Color scheme matches landing page

## Next Steps

1. **Create Blueprint Page** - Form to create new blueprints
2. **Collaboration Requests** - UI for sending/receiving collaboration requests
3. **Wallet UI** - Add funds, withdraw, view transaction history
4. **User Profile** - Edit profile, settings, verification
5. **Advanced Search** - Filters, categories, validation scores
6. **Real-time Notifications** - WebSocket integration
7. **Image Upload** - Blueprint thumbnails and attachments

## Running Backend Alongside

Start both services:

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm start
```

Frontend: `http://localhost:3000`
Backend: `http://localhost:5000`

## Troubleshooting

### "Cannot reach backend"
- Ensure backend is running on `http://localhost:5000`
- Check `.env` file has correct `REACT_APP_API_URL`

### "Login fails"
- Check backend is responding: `curl http://localhost:5000/api/health`
- Verify credentials are correct

### "Pages are blank"
- Check browser console for errors
- Clear cache and reload

## Support

See `/backend/README.md` and `/backend/QUICKSTART.md` for backend API documentation.

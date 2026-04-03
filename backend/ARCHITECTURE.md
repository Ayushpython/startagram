# Idea Marketplace Backend - Architecture

## Project Structure

```
backend/
├── models/                 # MongoDB schemas
│   ├── User.js            # User/creator/builder profiles
│   ├── Blueprint.js       # Validated startup blueprints
│   ├── Transaction.js     # Marketplace transactions
│   ├── Comment.js         # Blueprint discussions
│   ├── Collaboration.js   # Co-founder matching
│   └── Validation.js      # AI validation scores
│
├── routes/                 # API endpoints
│   ├── auth.js            # Auth (register/login)
│   ├── users.js           # User profiles & settings
│   ├── blueprints.js      # Blueprint CRUD
│   ├── marketplace.js     # Search, filter, trending
│   ├── comments.js        # Discussions
│   ├── collaboration.js   # Co-founder matching
│   ├── wallet.js          # Wallet management
│   ├── transactions.js    # Purchases & payouts
│   └── validation.js      # AI validation
│
├── middleware/            # Express middleware
│   ├── auth.js            # JWT authentication
│   ├── validation.js      # Input validation
│   ├── errorHandler.js    # Error handling
│   └── rbac.js            # Role-based access control
│
├── server.js              # Express server entry point
├── package.json           # Dependencies
├── .env.example           # Environment template
├── .gitignore             # Git ignore rules
└── README.md              # Documentation
```

## Key Features Implemented

### 1. User Management
- ProfileAccess control (creator, builder, both)
- Wallet & metrics tracking
- Saved blueprints collection
- Verified/premium status

### 2. Blueprint Management
- Full CRUD operations
- Multi-tier content (problem, market, features, monetization)
- AI validation scoring
- Protection/IP safeguards
- Sales & engagement tracking

### 3. Marketplace
- Advanced search and filtering
- Category browsing
- Trending & recommendations
- Rating & reviews system

### 4. Transaction System
- Secure payment processing
- Platform fee structure (10%)
- Seller payouts
- Wallet integration
- Refund handling

### 5. Community
- Public comments & discussions
- Threading & replies
- Like functionality
- Author-only visibility options

### 6. Collaboration
- Co-founder matching
- Request workflow (pending/accepted/rejected)
- Role/equity terms
- Workspace linking

### 7. Validation Engine
- AI-powered scoring (0-10)
- Multi-factor analysis
- Market comparables
- Risk flagging
- Recommendations

## API Response Format

All endpoints return consistent JSON:

```json
{
  "message": "Operation successful",
  "data": {},
  "error": null,
  "status": 200
}
```

## Authentication

JWT tokens are used for all protected routes. Include in header:
```
Authorization: Bearer <token>
```

## Database Schema

All models include:
- `_id`: MongoDB ObjectId
- `createdAt`: ISO timestamp
- `updatedAt`: ISO timestamp
- Appropriate validation rules

## Roadmap

- [ ] Stripe integration for payments
- [ ] OpenAI integration for validation
- [ ] Email notifications
- [ ] Real-time notifications (Socket.io)
- [ ] Advanced analytics dashboard
- [ ] Bulk operations API
- [ ] Webhook support
- [ ] Rate limiting
- [ ] Image upload to S3

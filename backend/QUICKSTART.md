# Quick Start Guide - Idea Marketplace Backend

## Prerequisites
- Node.js 14+ installed
- MongoDB 4.4+ installed or MongoDB Atlas account
- Postman (for testing APIs)

## Setup Steps

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
```

Edit `.env` and set:
```
MONGODB_URI=mongodb://localhost:27017/idea-marketplace
JWT_SECRET=your_secret_key_change_in_production
PORT=5000
```

### 3. Start MongoDB
```bash
# If using local MongoDB
mongod

# Or use MongoDB Atlas cloud connection string
```

### 4. Start the Server
```bash
# Development mode (auto-reload)
npm run dev

# Production mode
npm start
```

Server should be running at `http://localhost:5000`

## Test the API

### 1. Register a User
```bash
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "both"
}
```

Response includes `token` - save this for authenticated requests.

### 2. Login
```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### 3. Create a Blueprint (Authenticated)
```bash
POST http://localhost:5000/api/blueprints
Content-Type: application/json
Authorization: Bearer <token>

{
  "title": "AI Career Coach SaaS",
  "description": "An AI-powered career coaching platform",
  "category": "SaaS",
  "pricing": 499,
  "content": {
    "problemStatement": "Students lack personalized career guidance",
    "targetAudience": [
      {
        "segment": "College Students",
        "description": "Ages 18-25 in college",
        "size": "20M in US"
      }
    ],
    "marketResearch": {
      "marketSize": "$50B",
      "competitors": ["LinkedIn Learning", "Coursera"],
      "trends": ["Personalization", "AI adoption"]
    },
    "features": [
      {
        "name": "Career Matching",
        "description": "AI-powered job recommendations",
        "priority": "mvp"
      }
    ],
    "monetizationStrategy": {
      "model": "Freemium + Premium",
      "projectedRevenue": "$5M Year 1",
      "pricingTier": "$9.99/month"
    }
  }
}
```

### 4. Get All Blueprints (Public)
```bash
GET http://localhost:5000/api/blueprints?category=SaaS&sortBy=newest
```

### 5. Search Marketplace
```bash
GET http://localhost:5000/api/marketplace/search?q=AI&minPrice=100&maxPrice=1000&sortBy=rating
```

### 6. Create a Comment
```bash
POST http://localhost:5000/api/comments
Content-Type: application/json
Authorization: Bearer <token>

{
  "blueprintId": "<blueprintId>",
  "content": "Great idea! I'd be interested in co-founding this.",
  "visibility": "public"
}
```

### 7. Request Collaboration
```bash
POST http://localhost:5000/api/collaboration
Content-Type: application/json
Authorization: Bearer <token>

{
  "blueprintId": "<blueprintId>",
  "recipientId": "<userId>",
  "collaborationType": "co-founder",
  "message": "I'm interested in building this together. I have 5 years of AI experience."
}
```

### 8. Purchase a Blueprint
```bash
POST http://localhost:5000/api/transactions
Content-Type: application/json
Authorization: Bearer <token>

{
  "blueprintId": "<blueprintId>",
  "paymentMethod": "wallet"
}
```

### 9. Generate AI Validation
```bash
POST http://localhost:5000/api/validation/<blueprintId>/generate
Authorization: Bearer <token>
```

### 10. Get User Profile
```bash
GET http://localhost:5000/api/users/<userId>
```

## Postman Collection

Create a Postman collection or import following the structure in `API Endpoints` section in README.md

## Database Structure

Collections created automatically:
- `users` - User profiles
- `blueprints` - Startup blueprints
- `transactions` - Marketplace purchases
- `comments` - Discussions
- `collaborations` - Co-founder matching
- `validations` - AI scoring

## Troubleshooting

### "Cannot connect to MongoDB"
- Ensure MongoDB is running: `mongod`
- Update `MONGODB_URI` in `.env`
- Check MongoDB credentials if using Atlas

### "Invalid token"
- Token expired? Register/login again
- Include full token with "Bearer " prefix

### "Unauthorized"
- For protected routes, include valid JWT token
- Check user ownership for PUT/DELETE operations

## Next Steps

1. **Frontend Integration**: Connect React/Vue frontend to these APIs
2. **Stripe Integration**: Implement actual payment processing
3. **OpenAI Integration**: Add real AI validation (currently mock)
4. **Email Notifications**: Add notification system
5. **Real-time Features**: Add WebSocket support for live updates

## Support

Check `/backend/README.md` and `/backend/ARCHITECTURE.md` for detailed documentation.

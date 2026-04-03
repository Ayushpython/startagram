# Idea Marketplace Backend

Node.js/Express backend API for the Idea Marketplace platform - a validated startup blueprint marketplace.

## Features

- **User Management**: Role-based profiles (creators, builders, both)
- **Blueprint CRUD**: Create, publish, and manage startup blueprints
- **Marketplace**: Search, filter, and rate blueprints
- **Transactions**: Buy/sell blueprints with wallet system
- **Comments**: Public discussion on blueprints
- **Collaboration**: Co-founder matching and collaboration requests
- **Validation**: AI-powered startup validation scoring
- **Protection**: Optional anti-copy safeguards for blueprints

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Configure your environment variables (MongoDB URI, JWT secret, Stripe keys, etc.)

5. Start MongoDB locally or connect to a MongoDB cloud instance

## Running the Server

### Development Mode (with auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Users
- `GET /api/users` - Get current user profile
- `GET /api/users/:id` - Get user profile by ID
- `PUT /api/users/:id` - Update user profile
- `GET /api/users/:id/ratings` - Get user ratings
- `POST /api/users/:id/save-blueprint` - Save blueprint
- `DELETE /api/users/:id/unsave-blueprint/:blueprintId` - Unsave blueprint

### Blueprints
- `POST /api/blueprints` - Create new blueprint
- `GET /api/blueprints` - Get all published blueprints
- `GET /api/blueprints/:id` - Get blueprint details
- `PUT /api/blueprints/:id` - Update blueprint
- `DELETE /api/blueprints/:id` - Delete blueprint
- `POST /api/blueprints/:id/publish` - Publish blueprint
- `GET /api/blueprints/author/:authorId` - Get blueprints by author

### Marketplace
- `GET /api/marketplace/search` - Search and filter blueprints
- `GET /api/marketplace/categories` - Get all categories
- `GET /api/marketplace/trending` - Get trending blueprints
- `GET /api/marketplace/recommendations` - Get personalized recommendations
- `POST /api/marketplace/:blueprintId/rate` - Rate a blueprint

### Comments
- `POST /api/comments` - Create comment
- `GET /api/comments/:blueprintId` - Get comments for blueprint
- `PUT /api/comments/:id` - Update comment
- `DELETE /api/comments/:id` - Delete comment
- `POST /api/comments/:id/like` - Like a comment

### Collaboration
- `POST /api/collaboration` - Create collaboration request
- `GET /api/collaboration` - Get collaboration requests
- `GET /api/collaboration/:id` - Get collaboration details
- `PUT /api/collaboration/:id/accept` - Accept request
- `PUT /api/collaboration/:id/reject` - Reject request

### Wallet
- `GET /api/wallet/:userId` - Get wallet details
- `POST /api/wallet/:userId/add-funds` - Add funds
- `POST /api/wallet/:userId/withdraw` - Withdraw funds

### Transactions
- `POST /api/transactions` - Create transaction (purchase blueprint)
- `GET /api/transactions` - Get user transactions
- `GET /api/transactions/:id` - Get transaction details
- `POST /api/transactions/:id/refund` - Refund transaction

### Validation
- `GET /api/validation/:blueprintId` - Get validation for blueprint
- `POST /api/validation/:blueprintId/generate` - Generate AI validation
- `GET /api/validation/market-comparables` - Get market comparables

## Database Models

- **User**: User profiles with wallet and metrics
- **Blueprint**: Startup blueprint with content and metadata
- **Transaction**: Marketplace transactions
- **Comment**: Discussions on blueprints
- **Collaboration**: Co-founder matching requests
- **Validation**: AI validation scoring and analysis

## Environment Variables

See `.env.example` for all required configuration:
- `PORT`: Server port (default: 5000)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: JWT signing secret
- `STRIPE_SECRET_KEY`: Stripe payment key
- `OPENAI_API_KEY`: OpenAI API key for validation

## Testing

To test the API, use Postman or similar tools with the endpoints listed above.

## Contributing

1. Create a feature branch
2. Make your changes
3. Submit a pull request

## License

MIT

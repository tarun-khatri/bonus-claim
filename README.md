# Bonus Claim API

A REST API for managing bonus claims with MongoDB integration.

## Features

- Claim bonuses (DAILY, WELCOME, EVENT)
- MongoDB storage with timestamps
- Input validation
- Error handling
- Health check endpoint
- Test suite

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create `.env` file in root directory:
   ```
   NODE_ENV=development
   PORT=3001
   MONGODB_URI=your_mongodb_connection_string
   LOG_LEVEL=info
   ```
4. Create `.env.test` for testing:
   ```
   NODE_ENV=test
   PORT=3001
   MONGODB_TEST_URI=your_test_mongodb_connection_string
   LOG_LEVEL=error
   ```

## Running the Application

1. Start the server:
   ```bash
   npm start
   ```
   or for development:
   ```bash
   npm run dev
   ```

2. The API will be available at `http://localhost:3000`

## API Endpoints

### Claim Bonus
```
POST /api/claim-bonus
```
Request body:
```json
{
  "userId": "string",
  "bonusType": "DAILY|WELCOME|EVENT"
}
```

### Health Check
```
GET /health
```

## Testing

Run the test suite:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

Generate test coverage:
```bash
npm run test:coverage
```

## Project Structure

```
bonus-claim/
├── config/             # Configuration files
├── controllers/        # Route controllers
├── middleware/         # Express middleware
├── models/            # Mongoose models
├── routes/            # API routes
├── tests/             # Test files
├── utils/             # Utility functions
├── .env               # Environment variables
├── .env.test          # Test environment variables
├── app.js             # Express application
└── package.json       # Project dependencies
```

## Error Handling

The API includes comprehensive error handling for:
- Invalid input
- Duplicate claims
- Database errors
- Server errors

## Logging

- Uses Winston for logging
- Logs are stored in MongoDB
- Different log levels for development and production

## Security

- Input validation
- Environment variable configuration
- Error message sanitization
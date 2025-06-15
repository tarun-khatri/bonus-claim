require('dotenv').config({ path: '.env.test' });
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const Claim = require('../models/Claim');

// Test database
const MONGODB_URI = process.env.MONGODB_TEST_URI;

// Create a test server instance
let server;

beforeAll(async () => {
  // Connect to test database
  await mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  
  // Start server on a random port
  return new Promise((resolve) => {
    server = app.listen(0, () => {
      resolve();
    });
  });
});

beforeEach(async () => {
  // Clear the claims collection before each test
  await Claim.deleteMany({});
});

afterAll(async () => {
  // Clean up and close connections
  await Claim.deleteMany({});
  await mongoose.connection.close();
  
  // Close the server
  return new Promise((resolve) => {
    server.close(() => {
      resolve();
    });
  });
});

describe('Bonus Claim API', () => {
  describe('POST /api/claim-bonus', () => {
    it('should successfully claim a daily bonus', async () => {
      const claimData = {
        userId: 'testuser123',
        bonusType: 'DAILY'
      };

      const response = await request(server)
        .post('/api/claim-bonus')
        .send(claimData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.userId).toBe(claimData.userId);
      expect(response.body.data.bonusType).toBe(claimData.bonusType);
    });

    it('should successfully claim a welcome bonus', async () => {
      const claimData = {
        userId: 'newuser456',
        bonusType: 'WELCOME'
      };

      const response = await request(server)
        .post('/api/claim-bonus')
        .send(claimData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.bonusType).toBe('WELCOME');
    });

    it('should successfully claim an event bonus', async () => {
      const claimData = {
        userId: 'eventuser789',
        bonusType: 'EVENT'
      };

      const response = await request(server)
        .post('/api/claim-bonus')
        .send(claimData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.bonusType).toBe('EVENT');
    });

    it('should prevent duplicate daily bonus claims', async () => {
      const claimData = {
        userId: 'testuser123',
        bonusType: 'DAILY'
      };

      // First claim should succeed
      await request(server)
        .post('/api/claim-bonus')
        .send(claimData)
        .expect(201);

      // Second claim should fail
      const response = await request(server)
        .post('/api/claim-bonus')
        .send(claimData)
        .expect(409);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Daily bonus already claimed today');
    });

    it('should reject invalid bonus types', async () => {
      const claimData = {
        userId: 'testuser123',
        bonusType: 'INVALID_TYPE'
      };

      const response = await request(server)
        .post('/api/claim-bonus')
        .send(claimData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Invalid bonus type');
    });

    it('should reject missing userId', async () => {
      const response = await request(server)
        .post('/api/claim-bonus')
        .send({ bonusType: 'DAILY' })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('User ID must be a non-empty string');
    });

    it('should reject missing bonusType', async () => {
      const response = await request(server)
        .post('/api/claim-bonus')
        .send({ userId: 'testuser123' })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Bonus type must be a non-empty string');
    });

    it('should reject empty userId', async () => {
      const claimData = {
        userId: '',
        bonusType: 'DAILY'
      };

      const response = await request(server)
        .post('/api/claim-bonus')
        .send(claimData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('User ID must be a non-empty string');
    });

    it('should reject empty bonusType', async () => {
      const claimData = {
        userId: 'testuser123',
        bonusType: ''
      };

      const response = await request(server)
        .post('/api/claim-bonus')
        .send(claimData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Bonus type must be a non-empty string');
    });

    it('should handle case-insensitive bonus types', async () => {
      const claimData = {
        userId: 'testuser123',
        bonusType: 'daily' // lowercase
      };

      const response = await request(server)
        .post('/api/claim-bonus')
        .send(claimData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.bonusType).toBe('DAILY'); // should be normalized to uppercase
    });

    it('should store claim in database with correct structure', async () => {
      const claimData = {
        userId: 'testuser123',
        bonusType: 'DAILY'
      };

      await request(server)
        .post('/api/claim-bonus')
        .send(claimData)
        .expect(201);

      const claim = await Claim.findOne({ userId: claimData.userId });

      expect(claim).toBeTruthy();
      expect(claim.userId).toBe(claimData.userId);
      expect(claim.bonusType).toBe(claimData.bonusType);
      expect(claim.claimedAt).toBeInstanceOf(Date);
      expect(claim.metadata).toBeDefined();
      expect(claim.createdAt).toBeInstanceOf(Date);
      expect(claim.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(server)
        .get('/health')
        .expect(200);

      expect(response.body.status).toBe('OK');
      expect(response.body.timestamp).toBeDefined();
      expect(response.body.uptime).toBeDefined();
    });
  });

  describe('404 handler', () => {
    it('should return 404 for unknown routes', async () => {
      const response = await request(server)
        .get('/api/unknown-route')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Route not found');
    });
  });
}); 
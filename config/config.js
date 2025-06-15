require('dotenv').config();

const config = {
  // Server configuration
  server: {
    port: process.env.PORT || 3000,
    environment: process.env.NODE_ENV || 'development'
  },

  // Database configuration
  database: {
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      retryWrites: true,
      w: 'majority'
    }
  },

  // Allowed bonus types
  allowedBonusTypes: [
    'DAILY',
    'WELCOME', 
    'EVENT'
  ],

  // Bonus configuration
  bonusRules: {
    DAILY: {
      cooldownHours: 24,
      maxClaimsPerDay: 1
    },
    WELCOME: {
      maxClaimsPerUser: 1
    },
    EVENT: {
      maxClaimsPerEvent: 5
    }
  },

  // Rate limiting
  rateLimit: {
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false
  },

  // CORS settings
  cors: {
    origin: process.env.ALLOWED_ORIGINS ? 
      process.env.ALLOWED_ORIGINS.split(',') : 
      ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
    optionsSuccessStatus: 200
  },

  // Security settings
  security: {
    bcryptRounds: 12,
    jwtSecret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d'
  },

  // Logging
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    maxFiles: 10,
    maxSize: '5m'
  },

  // External services
  externalServices: {
    vaultLogger: {
      enabled: process.env.VAULT_LOGGER_ENABLED === 'true' || true,
      timeout: 5000,
      retryAttempts: 3
    }
  },

  // Feature flags
  features: {
    enableRateLimit: process.env.ENABLE_RATE_LIMIT !== 'false',
    enableCors: process.env.ENABLE_CORS !== 'false',
    enableHelmet: process.env.ENABLE_HELMET !== 'false'
  }
};

// Validation function to ensure required config is present
const validateConfig = () => {
  const requiredEnvVars = ['MONGODB_URI'];
  
  if (config.server.environment === 'production') {
    requiredEnvVars.push('JWT_SECRET');
  }
  
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }
};

// Validate configuration on load
if (process.env.NODE_ENV !== 'test') {
  validateConfig();
}

module.exports = config;
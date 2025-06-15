/**
 * Custom application error class
 */
class AppError extends Error {
    constructor(message, statusCode) {
      super(message);
      
      this.statusCode = statusCode;
      this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
      this.isOperational = true; // Operational errors are trusted errors
      
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  /**
   * Validation error class
   */
  class ValidationError extends AppError {
    constructor(message, field = null) {
      super(message, 400);
      this.field = field;
      this.name = 'ValidationError';
    }
  }
  
  /**
   * Database error class
   */
  class DatabaseError extends AppError {
    constructor(message, originalError = null) {
      super(message, 500);
      this.originalError = originalError;
      this.name = 'DatabaseError';
    }
  }
  
  /**
   * Authentication error class
   */
  class AuthenticationError extends AppError {
    constructor(message = 'Authentication failed') {
      super(message, 401);
      this.name = 'AuthenticationError';
    }
  }
  
  /**
   * Authorization error class
   */
  class AuthorizationError extends AppError {
    constructor(message = 'Access denied') {
      super(message, 403);
      this.name = 'AuthorizationError';
    }
  }
  
  /**
   * Resource not found error class
   */
  class NotFoundError extends AppError {
    constructor(resource = 'Resource') {
      super(`${resource} not found`, 404);
      this.name = 'NotFoundError';
    }
  }
  
  /**
   * Conflict error class (e.g., for duplicate resources)
   */
  class ConflictError extends AppError {
    constructor(message = 'Resource conflict') {
      super(message, 409);
      this.name = 'ConflictError';
    }
  }
  
  /**
   * Rate limit error class
   */
  class RateLimitError extends AppError {
    constructor(message = 'Too many requests') {
      super(message, 429);
      this.name = 'RateLimitError';
    }
  }
  
  /**
   * Service unavailable error class
   */
  class ServiceUnavailableError extends AppError {
    constructor(message = 'Service temporarily unavailable') {
      super(message, 503);
      this.name = 'ServiceUnavailableError';
    }
  }
  
  module.exports = {
    AppError,
    ValidationError,
    DatabaseError,
    AuthenticationError,
    AuthorizationError,
    NotFoundError,
    ConflictError,
    RateLimitError,
    ServiceUnavailableError
  };
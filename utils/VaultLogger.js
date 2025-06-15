const logger = require('./logger');

/**
 * VaultLogger - Fake logger utility as requested
 * This simulates an external logging service
 */
class VaultLogger {
  /**
   * Log claim events to external vault system
   * @param {string} userId - User ID who claimed the bonus
   * @param {string} bonusType - Type of bonus claimed
   * @param {Date} claimedAt - Timestamp when bonus was claimed
   */
  static logClaim(userId, bonusType, claimedAt) {
    try {
      // Simulate external logging service call
      const logEntry = {
        service: 'VAULT_LOGGER',
        event: 'BONUS_CLAIMED',
        timestamp: new Date().toISOString(),
        data: {
          userId,
          bonusType,
          claimedAt: claimedAt.toISOString(),
          sessionId: this.generateSessionId(),
          environment: process.env.NODE_ENV || 'development'
        }
      };

      // Simulate API call delay
      setTimeout(() => {
        logger.info('VaultLogger: Claim logged to external vault', logEntry);
        
        // Simulate occasional logging to show it's working
        if (Math.random() > 0.7) {
          console.log('🔐 VaultLogger: External vault received claim log');
        }
      }, Math.random() * 100); // Random delay 0-100ms

      // Simulate success response
      return {
        success: true,
        logId: this.generateLogId(),
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      logger.error('VaultLogger: Failed to log claim to external vault', {
        error: error.message,
        userId,
        bonusType
      });
      
      // In a real implementation, you might want to queue failed logs for retry
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Generate a fake session ID
   * @returns {string} Session ID
   */
  static generateSessionId() {
    return 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  /**
   * Generate a fake log ID
   * @returns {string} Log ID
   */
  static generateLogId() {
    return 'log_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  /**
   * Simulate batch logging (bonus method)
   * @param {Array} claims - Array of claim objects
   */
  static logClaimBatch(claims) {
    try {
      const batchLogEntry = {
        service: 'VAULT_LOGGER',
        event: 'BONUS_CLAIMED_BATCH',
        timestamp: new Date().toISOString(),
        count: claims.length,
        data: claims.map(claim => ({
          userId: claim.userId,
          bonusType: claim.bonusType,
          claimedAt: claim.claimedAt.toISOString()
        }))
      };

      logger.info('VaultLogger: Batch claims logged to external vault', batchLogEntry);
      
      return {
        success: true,
        batchId: this.generateLogId(),
        processedCount: claims.length,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      logger.error('VaultLogger: Failed to log batch claims to external vault', {
        error: error.message,
        claimCount: claims.length
      });
      
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = VaultLogger;
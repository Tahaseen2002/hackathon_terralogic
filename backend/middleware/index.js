/**
 * Middleware exports
 */

const { ApiError, notFound, errorHandler, asyncHandler } = require('./errorHandler');
const { validateTask, validateProject, validateFileUpload, validateAIQuery } = require('./validator');
const logger = require('./logger');

module.exports = {
  // Error handling
  ApiError,
  notFound,
  errorHandler,
  asyncHandler,
  
  // Validation
  validateTask,
  validateProject,
  validateFileUpload,
  validateAIQuery,
  
  // Logging
  logger
};

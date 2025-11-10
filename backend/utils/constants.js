/**
 * Application constants
 */

// Task statuses
const TASK_STATUS = {
  OPEN: 'open',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed',
  BLOCKED: 'blocked'
};

// Task priorities
const TASK_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
};

// Project statuses
const PROJECT_STATUS = {
  ACTIVE: 'active',
  COMPLETED: 'completed',
  ON_HOLD: 'on-hold',
  CANCELLED: 'cancelled'
};

// AI providers
const AI_PROVIDER = {
  GEMINI: 'gemini',
  OPENAI: 'openai'
};

// MongoDB connection states
const MONGODB_STATE = {
  DISCONNECTED: 0,
  CONNECTED: 1,
  CONNECTING: 2,
  DISCONNECTING: 3
};

// HTTP status codes
const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503
};

// Cache TTL values (in seconds)
const CACHE_TTL = {
  SHORT: 60,           // 1 minute
  MEDIUM: 300,         // 5 minutes
  LONG: 900,           // 15 minutes
  AI_RESPONSE: 600,    // 10 minutes
  TASK_STATS: 300,     // 5 minutes
  PROJECT_STATS: 300   // 5 minutes
};

// File upload limits
const UPLOAD_LIMITS = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_EXTENSIONS: ['.csv', '.xlsx', '.xls']
};

// API rate limits
const RATE_LIMITS = {
  WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  MAX_REQUESTS: 100
};

// Pagination defaults
const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100
};

// Error messages
const ERROR_MESSAGES = {
  REQUIRED_FIELD: 'This field is required',
  INVALID_FORMAT: 'Invalid format',
  NOT_FOUND: 'Resource not found',
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Access forbidden',
  SERVER_ERROR: 'Internal server error',
  DATABASE_ERROR: 'Database error',
  VALIDATION_ERROR: 'Validation error',
  FILE_TOO_LARGE: 'File size exceeds maximum allowed size',
  INVALID_FILE_TYPE: 'Invalid file type',
  NO_FILE_UPLOADED: 'No file uploaded'
};

// Success messages
const SUCCESS_MESSAGES = {
  CREATED: 'Resource created successfully',
  UPDATED: 'Resource updated successfully',
  DELETED: 'Resource deleted successfully',
  UPLOAD_SUCCESS: 'File uploaded successfully',
  DATA_IMPORTED: 'Data imported successfully'
};

module.exports = {
  TASK_STATUS,
  TASK_PRIORITY,
  PROJECT_STATUS,
  AI_PROVIDER,
  MONGODB_STATE,
  HTTP_STATUS,
  CACHE_TTL,
  UPLOAD_LIMITS,
  RATE_LIMITS,
  PAGINATION,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES
};

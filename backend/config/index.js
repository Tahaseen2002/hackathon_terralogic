/**
 * Application configuration
 */
module.exports = {
  // Server configuration
  server: {
    port: process.env.PORT || 5000,
    env: process.env.NODE_ENV || 'development',
    corsOrigin: process.env.CORS_ORIGIN || '*'
  },

  // AI configuration
  ai: {
    provider: process.env.AI_PROVIDER || 'gemini',
    geminiApiKey: process.env.GEMINI_API_KEY,
    openaiApiKey: process.env.OPENAI_API_KEY,
    model: {
      gemini: 'gemini-pro',
      openai: 'gpt-3.5-turbo'
    },
    temperature: 0.7,
    maxTokens: 1000
  },

  // File upload configuration
  upload: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['.csv', '.xlsx', '.xls'],
    uploadDir: 'backend/uploads'
  },

  // API configuration
  api: {
    prefix: '/api',
    version: 'v1',
    rateLimit: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100 // limit each IP to 100 requests per windowMs
    }
  },

  // Pagination defaults
  pagination: {
    defaultLimit: 20,
    maxLimit: 100
  },

  // Status codes
  statusCodes: {
    success: 200,
    created: 201,
    badRequest: 400,
    unauthorized: 401,
    forbidden: 403,
    notFound: 404,
    serverError: 500,
    serviceUnavailable: 503
  }
};

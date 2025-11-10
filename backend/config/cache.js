/**
 * Cache configuration
 */
const NodeCache = require('node-cache');

const cacheConfig = {
  stdTTL: 300,        // Standard time to live in seconds (5 minutes)
  checkperiod: 60,    // Check for expired keys every 60 seconds
  useClones: false,   // Don't clone variables for better performance
  deleteOnExpire: true
};

/**
 * Create cache instance
 */
const createCache = () => {
  return new NodeCache(cacheConfig);
};

/**
 * Cache key constants
 */
const CACHE_KEYS = {
  ALL_TASKS: 'tasks_{}',
  TASK_STATS: 'task_stats',
  ALL_PROJECTS: 'all_projects',
  AI_SUMMARY: 'ai_summary',
  AI_PREDICTION: 'ai_prediction',
  AI_SENTIMENT: 'ai_sentiment',
  AI_BOTTLENECKS: 'ai_bottlenecks',
  AI_DAILY_SUMMARY: 'ai_daily_summary'
};

/**
 * Cache TTL values (in seconds)
 */
const CACHE_TTL = {
  SHORT: 60,          // 1 minute
  MEDIUM: 300,        // 5 minutes
  LONG: 900,          // 15 minutes
  AI_RESPONSE: 600    // 10 minutes for AI responses
};

module.exports = {
  createCache,
  cacheConfig,
  CACHE_KEYS,
  CACHE_TTL
};

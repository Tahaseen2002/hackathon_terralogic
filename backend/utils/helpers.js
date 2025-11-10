/**
 * Common utility functions
 */

/**
 * Format date to ISO string
 */
const formatDate = (date) => {
  if (!date) return null;
  return new Date(date).toISOString();
};

/**
 * Parse date string
 */
const parseDate = (dateStr) => {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  return isNaN(date.getTime()) ? null : date;
};

/**
 * Calculate days between dates
 */
const daysBetween = (date1, date2) => {
  const ONE_DAY = 1000 * 60 * 60 * 24;
  const diff = Math.abs(new Date(date2) - new Date(date1));
  return Math.floor(diff / ONE_DAY);
};

/**
 * Normalize string (lowercase, trim, remove special chars)
 */
const normalizeString = (str) => {
  if (!str) return '';
  return str.toLowerCase().trim().replace(/[\s-_]+/g, '');
};

/**
 * Parse tags from comma or semicolon separated string
 */
const parseTags = (tagsStr) => {
  if (!tagsStr) return [];
  return tagsStr
    .split(/[,;]/)
    .map(t => t.trim())
    .filter(t => t.length > 0);
};

/**
 * Generate unique ID
 */
const generateId = (prefix = 'ID') => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 9);
  return `${prefix}-${timestamp}-${random}`;
};

/**
 * Check if value is empty
 */
const isEmpty = (value) => {
  return (
    value === undefined ||
    value === null ||
    (typeof value === 'object' && Object.keys(value).length === 0) ||
    (typeof value === 'string' && value.trim().length === 0)
  );
};

/**
 * Sanitize object (remove null/undefined values)
 */
const sanitizeObject = (obj) => {
  const sanitized = {};
  for (const [key, value] of Object.entries(obj)) {
    if (!isEmpty(value)) {
      sanitized[key] = value;
    }
  }
  return sanitized;
};

/**
 * Calculate percentage
 */
const calculatePercentage = (value, total) => {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
};

/**
 * Group array by key
 */
const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    const group = item[key];
    if (!result[group]) {
      result[group] = [];
    }
    result[group].push(item);
    return result;
  }, {});
};

/**
 * Sleep/delay function
 */
const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Retry async function with exponential backoff
 */
const retryAsync = async (fn, maxRetries = 3, delay = 1000) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await sleep(delay * Math.pow(2, i));
    }
  }
};

module.exports = {
  formatDate,
  parseDate,
  daysBetween,
  normalizeString,
  parseTags,
  generateId,
  isEmpty,
  sanitizeObject,
  calculatePercentage,
  groupBy,
  sleep,
  retryAsync
};

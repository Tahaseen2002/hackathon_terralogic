/**
 * Response formatter utilities
 */

/**
 * Success response
 */
const successResponse = (data, message = 'Success', meta = {}) => {
  return {
    success: true,
    message,
    data,
    ...meta
  };
};

/**
 * Error response
 */
const errorResponse = (message, statusCode = 500, errors = null) => {
  const response = {
    success: false,
    error: message,
    statusCode
  };
  
  if (errors) {
    response.errors = errors;
  }
  
  return response;
};

/**
 * Paginated response
 */
const paginatedResponse = (data, page, limit, total) => {
  const totalPages = Math.ceil(total / limit);
  
  return {
    success: true,
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    }
  };
};

/**
 * Cached response indicator
 */
const cachedResponse = (data, cached = true) => {
  return {
    success: true,
    data,
    cached
  };
};

module.exports = {
  successResponse,
  errorResponse,
  paginatedResponse,
  cachedResponse
};

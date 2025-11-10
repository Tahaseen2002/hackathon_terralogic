/**
 * Request validation middleware
 */

/**
 * Validate task creation/update data
 */
const validateTask = (req, res, next) => {
  const { title, assignee, projectId } = req.body;

  const errors = [];

  if (!title || title.trim().length === 0) {
    errors.push('Title is required');
  }

  if (!assignee || assignee.trim().length === 0) {
    errors.push('Assignee is required');
  }

  if (!projectId || projectId.trim().length === 0) {
    errors.push('Project ID is required');
  }

  if (req.body.status && !['open', 'in-progress', 'completed', 'blocked'].includes(req.body.status)) {
    errors.push('Invalid status value');
  }

  if (req.body.priority && !['low', 'medium', 'high', 'critical'].includes(req.body.priority)) {
    errors.push('Invalid priority value');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      errors
    });
  }

  next();
};

/**
 * Validate project creation/update data
 */
const validateProject = (req, res, next) => {
  const { name } = req.body;

  const errors = [];

  if (!name || name.trim().length === 0) {
    errors.push('Project name is required');
  }

  if (req.body.status && !['active', 'completed', 'on-hold', 'cancelled'].includes(req.body.status)) {
    errors.push('Invalid status value');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      errors
    });
  }

  next();
};

/**
 * Validate file upload
 */
const validateFileUpload = (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      error: 'No file uploaded'
    });
  }

  const allowedTypes = ['.csv', '.xlsx', '.xls'];
  const fileExt = require('path').extname(req.file.originalname).toLowerCase();

  if (!allowedTypes.includes(fileExt)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid file type. Only CSV and Excel files are allowed.'
    });
  }

  next();
};

/**
 * Validate AI query
 */
const validateAIQuery = (req, res, next) => {
  const { query } = req.body;

  if (!query || query.trim().length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Query is required'
    });
  }

  if (query.length > 500) {
    return res.status(400).json({
      success: false,
      error: 'Query is too long. Maximum 500 characters allowed.'
    });
  }

  next();
};

module.exports = {
  validateTask,
  validateProject,
  validateFileUpload,
  validateAIQuery
};

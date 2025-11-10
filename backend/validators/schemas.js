/**
 * Task validation schemas
 */

const taskSchema = {
  taskId: {
    type: 'string',
    required: false
  },
  title: {
    type: 'string',
    required: true,
    minLength: 1,
    maxLength: 200
  },
  description: {
    type: 'string',
    required: false,
    maxLength: 2000
  },
  status: {
    type: 'string',
    required: false,
    enum: ['open', 'in-progress', 'completed', 'blocked'],
    default: 'open'
  },
  priority: {
    type: 'string',
    required: false,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  assignee: {
    type: 'string',
    required: true,
    minLength: 1
  },
  projectId: {
    type: 'string',
    required: true,
    minLength: 1
  },
  estimatedHours: {
    type: 'number',
    required: false,
    min: 0
  },
  actualHours: {
    type: 'number',
    required: false,
    min: 0
  },
  dueDate: {
    type: 'date',
    required: false
  },
  tags: {
    type: 'array',
    required: false
  }
};

/**
 * Project validation schema
 */
const projectSchema = {
  projectId: {
    type: 'string',
    required: false
  },
  name: {
    type: 'string',
    required: true,
    minLength: 1,
    maxLength: 100
  },
  description: {
    type: 'string',
    required: false,
    maxLength: 1000
  },
  status: {
    type: 'string',
    required: false,
    enum: ['active', 'completed', 'on-hold', 'cancelled'],
    default: 'active'
  },
  startDate: {
    type: 'date',
    required: false
  },
  endDate: {
    type: 'date',
    required: false
  }
};

module.exports = {
  taskSchema,
  projectSchema
};

const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'PULSEVO - Team Productivity Dashboard API',
      version: '1.0.0',
      description: 'AI-powered Team Productivity Dashboard API with real-time analytics, data ingestion, and intelligent insights',
      contact: {
        name: 'PULSEVO Team',
        email: 'support@pulsevo.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server'
      }
    ],
    tags: [
      {
        name: 'Tasks',
        description: 'Task management endpoints'
      },
      {
        name: 'Projects',
        description: 'Project management endpoints'
      },
      {
        name: 'Upload',
        description: 'File upload and data ingestion'
      },
      {
        name: 'AI Analytics',
        description: 'AI-powered analytics and insights'
      },
      {
        name: 'Health',
        description: 'System health check'
      }
    ],
    components: {
      schemas: {
        Task: {
          type: 'object',
          required: ['taskId', 'title', 'assignee', 'projectId'],
          properties: {
            taskId: {
              type: 'string',
              description: 'Unique task identifier',
              example: 'TASK-001'
            },
            title: {
              type: 'string',
              description: 'Task title',
              example: 'Implement authentication'
            },
            description: {
              type: 'string',
              description: 'Task description',
              example: 'Setup JWT authentication system'
            },
            status: {
              type: 'string',
              enum: ['open', 'in-progress', 'completed', 'blocked'],
              description: 'Task status',
              example: 'in-progress'
            },
            priority: {
              type: 'string',
              enum: ['low', 'medium', 'high', 'critical'],
              description: 'Task priority',
              example: 'high'
            },
            assignee: {
              type: 'string',
              description: 'Person assigned to task',
              example: 'Alice Johnson'
            },
            projectId: {
              type: 'string',
              description: 'Associated project ID',
              example: 'PROJ-001'
            },
            estimatedHours: {
              type: 'number',
              description: 'Estimated hours to complete',
              example: 8
            },
            actualHours: {
              type: 'number',
              description: 'Actual hours spent',
              example: 6
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Creation date'
            },
            completedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Completion date'
            },
            dueDate: {
              type: 'string',
              format: 'date-time',
              description: 'Due date'
            },
            tags: {
              type: 'array',
              items: {
                type: 'string'
              },
              example: ['backend', 'security']
            }
          }
        },
        Project: {
          type: 'object',
          required: ['projectId', 'name'],
          properties: {
            projectId: {
              type: 'string',
              example: 'PROJ-001'
            },
            name: {
              type: 'string',
              example: 'PULSEVO Dashboard'
            },
            description: {
              type: 'string',
              example: 'Team productivity tracking system'
            },
            status: {
              type: 'string',
              enum: ['active', 'completed', 'on-hold', 'cancelled'],
              example: 'active'
            },
            completionRate: {
              type: 'number',
              minimum: 0,
              maximum: 100,
              example: 75
            },
            totalTasks: {
              type: 'number',
              example: 25
            },
            completedTasks: {
              type: 'number',
              example: 18
            }
          }
        },
        TaskStats: {
          type: 'object',
          properties: {
            total: {
              type: 'number',
              example: 25
            },
            byStatus: {
              type: 'object',
              properties: {
                open: { type: 'number', example: 5 },
                'in-progress': { type: 'number', example: 8 },
                completed: { type: 'number', example: 10 },
                blocked: { type: 'number', example: 2 }
              }
            },
            byPriority: {
              type: 'object',
              properties: {
                low: { type: 'number', example: 5 },
                medium: { type: 'number', example: 10 },
                high: { type: 'number', example: 8 },
                critical: { type: 'number', example: 2 }
              }
            },
            completionRate: {
              type: 'number',
              example: 40
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              example: 'Error message'
            }
          }
        }
      }
    }
  },
  apis: ['./backend/routes/*.js', './backend/server.js']
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;

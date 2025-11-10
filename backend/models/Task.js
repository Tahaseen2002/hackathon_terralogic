const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  taskId: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['open', 'in-progress', 'completed', 'blocked'],
    default: 'open'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  assignee: {
    type: String,
    required: true
  },
  projectId: {
    type: String,
    required: true
  },
  estimatedHours: {
    type: Number,
    default: 0
  },
  actualHours: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date,
    default: null
  },
  dueDate: {
    type: Date,
    default: null
  },
  tags: [{
    type: String
  }],
  comments: [{
    author: String,
    text: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Indexes for faster queries
taskSchema.index({ assignee: 1, status: 1 });
taskSchema.index({ projectId: 1 });
taskSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Task', taskSchema);

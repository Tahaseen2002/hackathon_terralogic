const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  projectId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'on-hold', 'cancelled'],
    default: 'active'
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date,
    default: null
  },
  teamMembers: [{
    name: String,
    role: String,
    email: String
  }],
  completionRate: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  totalTasks: {
    type: Number,
    default: 0
  },
  completedTasks: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for faster queries
projectSchema.index({ status: 1 });

module.exports = mongoose.model('Project', projectSchema);

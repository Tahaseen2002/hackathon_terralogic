const Project = require('../models/Project');
const mongoose = require('mongoose');

// Helper to check if MongoDB is connected
const isMongoConnected = () => mongoose.connection.readyState === 1;

/**
 * Get all projects
 */
exports.getAllProjects = async (req, res) => {
  try {
    const cache = req.app.get('cache');
    const cacheKey = 'all_projects';
    
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      return res.json({ success: true, data: cachedData, cached: true });
    }

    // Check if MongoDB is connected
    if (!isMongoConnected()) {
      return res.json({ success: true, data: [], cached: false });
    }

    const projects = await Project.find().sort({ createdAt: -1 });
    cache.set(cacheKey, projects);

    res.json({ success: true, data: projects, cached: false });

  } catch (error) {
    res.json({ success: true, data: [] });
  }
};

/**
 * Get single project by ID
 */
exports.getProjectById = async (req, res) => {
  try {
    if (!isMongoConnected()) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const project = await Project.findOne({ projectId: req.params.id });
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json({ success: true, data: project });
  } catch (error) {
    res.status(404).json({ error: 'Project not found' });
  }
};

/**
 * Create new project
 */
exports.createProject = async (req, res) => {
  try {
    if (!isMongoConnected()) {
      return res.status(503).json({ error: 'Database unavailable. Please upload data first.' });
    }

    const project = await Project.create(req.body);
    
    const cache = req.app.get('cache');
    cache.flushAll();
    
    res.status(201).json({ success: true, data: project });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Update project
 */
exports.updateProject = async (req, res) => {
  try {
    if (!isMongoConnected()) {
      return res.status(503).json({ error: 'Database unavailable' });
    }

    const project = await Project.findOneAndUpdate(
      { projectId: req.params.id },
      req.body,
      { new: true }
    );
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    const cache = req.app.get('cache');
    cache.flushAll();
    
    res.json({ success: true, data: project });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

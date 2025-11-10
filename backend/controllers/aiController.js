const aiService = require('../services/aiService');
const Task = require('../models/Task');
const Project = require('../models/Project');
const mongoose = require('mongoose');

// Helper to check if MongoDB is connected
const isMongoConnected = () => mongoose.connection.readyState === 1;

/**
 * Generate productivity summary using AI
 */
exports.summarizeProductivity = async (req, res) => {
  try {
    const cache = req.app.get('cache');
    const cacheKey = 'ai_summary';
    
    const cached = cache.get(cacheKey);
    if (cached && !req.body.forceRefresh) {
      return res.json({ success: true, data: cached, cached: true });
    }

    if (!isMongoConnected()) {
      return res.json({ 
        success: true, 
        data: { 
          summary: 'No data available. Please upload your task data to get AI-powered insights.',
          data: { totalTasks: 0 },
          timestamp: new Date() 
        } 
      });
    }

    const tasks = await Task.find();
    const projects = await Project.find();
    
    const productivityData = {
      totalTasks: tasks.length,
      completedTasks: tasks.filter(t => t.status === 'completed').length,
      inProgressTasks: tasks.filter(t => t.status === 'in-progress').length,
      openTasks: tasks.filter(t => t.status === 'open').length,
      blockedTasks: tasks.filter(t => t.status === 'blocked').length,
      totalProjects: projects.length,
      activeProjects: projects.filter(p => p.status === 'active').length,
      teamMembers: [...new Set(tasks.map(t => t.assignee))],
      tasksByAssignee: {}
    };

    tasks.forEach(task => {
      if (!productivityData.tasksByAssignee[task.assignee]) {
        productivityData.tasksByAssignee[task.assignee] = {
          total: 0,
          completed: 0,
          open: 0,
          'in-progress': 0,
          blocked: 0
        };
      }
      productivityData.tasksByAssignee[task.assignee].total++;
      productivityData.tasksByAssignee[task.assignee][task.status]++;
    });

    const summary = await aiService.summarizeProductivity(productivityData);
    
    const result = { summary, data: productivityData, timestamp: new Date() };
    cache.set(cacheKey, result, 600);

    res.json({ success: true, data: result, cached: false });

  } catch (error) {
    console.error('AI Summarize error:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Answer natural language queries
 */
exports.answerQuery = async (req, res) => {
  try {
    const { query } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    if (!isMongoConnected()) {
      return res.json({ 
        success: true, 
        data: { 
          query, 
          answer: 'No data available yet. Please upload your task data first to ask questions about team performance.',
          timestamp: new Date() 
        } 
      });
    }

    const tasks = await Task.find();
    const projects = await Project.find();
    
    const teamData = {
      tasks: tasks.map(t => ({
        id: t.taskId,
        title: t.title,
        status: t.status,
        assignee: t.assignee,
        priority: t.priority,
        createdAt: t.createdAt,
        completedAt: t.completedAt
      })),
      projects: projects.map(p => ({
        id: p.projectId,
        name: p.name,
        status: p.status,
        completionRate: p.completionRate
      })),
      stats: {
        totalTasks: tasks.length,
        completedTasks: tasks.filter(t => t.status === 'completed').length
      }
    };

    const answer = await aiService.answerQuery(query, teamData);

    res.json({ success: true, data: { query, answer, timestamp: new Date() } });

  } catch (error) {
    console.error('AI Query error:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Predict sprint progress
 */
exports.predictSprintProgress = async (req, res) => {
  try {
    const cache = req.app.get('cache');
    const cacheKey = 'ai_prediction';
    
    const cached = cache.get(cacheKey);
    if (cached && !req.body.forceRefresh) {
      return res.json({ success: true, data: cached, cached: true });
    }

    if (!isMongoConnected()) {
      return res.json({ 
        success: true, 
        data: { 
          prediction: 'No historical data available. Upload task data to get sprint predictions.',
          historicalData: {},
          timestamp: new Date() 
        } 
      });
    }

    const tasks = await Task.find().sort({ createdAt: -1 });
    
    const historicalData = {
      week1: { completed: 0, created: 0, velocity: 0 },
      week2: { completed: 0, created: 0, velocity: 0 },
      week3: { completed: 0, created: 0, velocity: 0 },
      week4: { completed: 0, created: 0, velocity: 0 }
    };

    const now = new Date();
    tasks.forEach(task => {
      const weeksDiff = Math.floor((now - task.createdAt) / (7 * 24 * 60 * 60 * 1000));
      if (weeksDiff < 4) {
        const weekKey = `week${4 - weeksDiff}`;
        if (historicalData[weekKey]) {
          historicalData[weekKey].created++;
          if (task.status === 'completed') {
            historicalData[weekKey].completed++;
          }
        }
      }
    });

    Object.keys(historicalData).forEach(week => {
      const data = historicalData[week];
      data.velocity = data.created > 0 ? Math.round((data.completed / data.created) * 100) : 0;
    });

    const prediction = await aiService.predictSprintProgress(historicalData);
    
    const result = { prediction, historicalData, timestamp: new Date() };
    cache.set(cacheKey, result, 900);

    res.json({ success: true, data: result, cached: false });

  } catch (error) {
    console.error('AI Predict error:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Analyze sentiment
 */
exports.analyzeSentiment = async (req, res) => {
  try {
    if (!isMongoConnected()) {
      return res.json({ 
        success: true, 
        data: { 
          message: 'No data available for sentiment analysis. Upload task data first.',
          sentiment: 'N/A'
        } 
      });
    }

    const tasks = await Task.find();
    
    let allComments = [];
    tasks.forEach(task => {
      if (task.comments && task.comments.length > 0) {
        allComments = allComments.concat(task.comments.map(c => c.text));
      }
    });

    if (allComments.length === 0) {
      return res.json({ 
        success: true, 
        data: { 
          message: 'No comments available for sentiment analysis',
          sentiment: 'N/A'
        } 
      });
    }

    const commentsText = allComments.join('\n');
    const sentiment = await aiService.analyzeSentiment(commentsText);

    res.json({ 
      success: true, 
      data: { 
        sentiment, 
        totalComments: allComments.length,
        timestamp: new Date() 
      } 
    });

  } catch (error) {
    console.error('AI Sentiment error:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Identify bottlenecks
 */
exports.identifyBottlenecks = async (req, res) => {
  try {
    if (!isMongoConnected()) {
      return res.json({ 
        success: true, 
        data: { 
          analysis: 'No task data available. Upload your data to identify bottlenecks.',
          rawData: { byAssignee: {}, blockedTasks: [], overdueTasks: [] },
          timestamp: new Date() 
        } 
      });
    }

    const tasks = await Task.find();
    
    const taskData = {
      byAssignee: {},
      blockedTasks: tasks.filter(t => t.status === 'blocked'),
      overdueTasks: tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'completed')
    };

    tasks.forEach(task => {
      if (!taskData.byAssignee[task.assignee]) {
        taskData.byAssignee[task.assignee] = {
          name: task.assignee,
          total: 0,
          open: 0,
          'in-progress': 0,
          blocked: 0,
          completed: 0
        };
      }
      const assignee = taskData.byAssignee[task.assignee];
      assignee.total++;
      assignee[task.status]++;
    });

    const analysis = await aiService.identifyBottlenecks(taskData);

    res.json({ 
      success: true, 
      data: { 
        analysis, 
        rawData: taskData,
        timestamp: new Date() 
      } 
    });

  } catch (error) {
    console.error('AI Bottlenecks error:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Generate daily summary
 */
exports.generateDailySummary = async (req, res) => {
  try {
    if (!isMongoConnected()) {
      return res.json({ 
        success: true, 
        data: { 
          summary: 'No task data available. Upload your data to get daily summaries.',
          metrics: { 
            date: new Date().toDateString(),
            tasksCreated: 0,
            tasksCompleted: 0,
            topPerformers: {},
            blockers: 0
          },
          timestamp: new Date() 
        } 
      });
    }

    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    
    const recentTasks = await Task.find({ 
      createdAt: { $gte: yesterday } 
    });
    
    const completedToday = await Task.find({ 
      completedAt: { $gte: yesterday } 
    });

    const dailyMetrics = {
      date: now.toDateString(),
      tasksCreated: recentTasks.length,
      tasksCompleted: completedToday.length,
      topPerformers: {},
      blockers: await Task.countDocuments({ status: 'blocked' })
    };

    completedToday.forEach(task => {
      if (!dailyMetrics.topPerformers[task.assignee]) {
        dailyMetrics.topPerformers[task.assignee] = 0;
      }
      dailyMetrics.topPerformers[task.assignee]++;
    });

    const summary = await aiService.generateDailySummary(dailyMetrics);

    res.json({ 
      success: true, 
      data: { 
        summary, 
        metrics: dailyMetrics,
        timestamp: new Date() 
      } 
    });

  } catch (error) {
    console.error('AI Daily Summary error:', error);
    res.status(500).json({ error: error.message });
  }
};

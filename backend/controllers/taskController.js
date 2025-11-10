const Task = require('../models/Task');
const mongoose = require('mongoose');

// Helper to check if MongoDB is connected
const isMongoConnected = () => mongoose.connection.readyState === 1;

/**
 * Get all tasks with optional filtering
 */
exports.getAllTasks = async (req, res) => {
  try {
    const cache = req.app.get('cache');
    const cacheKey = `tasks_${JSON.stringify(req.query)}`;
    
    // Check cache first
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      return res.json({ 
        success: true, 
        data: cachedData,
        cached: true 
      });
    }

    // Check if MongoDB is connected
    if (!isMongoConnected()) {
      return res.json({ 
        success: true, 
        data: [],
        cached: false,
        message: 'MongoDB not connected. Upload data to populate.' 
      });
    }

    // Build query
    const query = {};
    if (req.query.status) query.status = req.query.status;
    if (req.query.assignee) query.assignee = req.query.assignee;
    if (req.query.projectId) query.projectId = req.query.projectId;
    if (req.query.priority) query.priority = req.query.priority;

    // Date range filter
    if (req.query.startDate || req.query.endDate) {
      query.createdAt = {};
      if (req.query.startDate) query.createdAt.$gte = new Date(req.query.startDate);
      if (req.query.endDate) query.createdAt.$lte = new Date(req.query.endDate);
    }

    const tasks = await Task.find(query).sort({ createdAt: -1 }).lean();

    // Convert Mongoose documents to plain objects and ensure all fields are present
    const formattedTasks = tasks.map(task => {
      // Helper to safely convert dates
      const formatDate = (date) => {
        if (!date) return null;
        // If it's already a string in ISO format, return it
        if (typeof date === 'string') return date;
        // If it's a Date object, convert to ISO string
        if (date instanceof Date) return date.toISOString();
        return null;
      };

      return {
        _id: task._id ? task._id.toString() : null,
        taskId: task.taskId || '',
        title: task.title || 'Untitled Task',
        description: task.description || '',
        status: task.status || 'open',
        priority: task.priority || 'medium',
        assignee: task.assignee || 'Unassigned',
        projectId: task.projectId || 'No Project',
        estimatedHours: task.estimatedHours || 0,
        actualHours: task.actualHours || 0,
        createdAt: formatDate(task.createdAt),
        updatedAt: formatDate(task.updatedAt),
        completedAt: formatDate(task.completedAt),
        dueDate: formatDate(task.dueDate),
        tags: Array.isArray(task.tags) ? task.tags : [],
        comments: Array.isArray(task.comments) ? task.comments : []
      };
    });

    // Debug logging
    if (formattedTasks.length > 0) {
      console.log('Formatted tasks sample:', JSON.stringify(formattedTasks[0], null, 2));
    }

    // Cache the result
    cache.set(cacheKey, formattedTasks);

    res.json({ 
      success: true, 
      data: formattedTasks,
      cached: false 
    });

  } catch (error) {
    console.error('Get tasks error:', error);
    res.json({ success: true, data: [], message: 'Database unavailable' });
  }
};

/**
 * Get task statistics
 */
exports.getTaskStats = async (req, res) => {
  try {
    const cache = req.app.get('cache');
    const cacheKey = 'task_stats';
    
    const cachedStats = cache.get(cacheKey);
    if (cachedStats) {
      return res.json({ success: true, data: cachedStats, cached: true });
    }

    // Check if MongoDB is connected
    if (!isMongoConnected()) {
      const emptyStats = {
        total: 0,
        byStatus: { open: 0, 'in-progress': 0, completed: 0, blocked: 0 },
        byPriority: { low: 0, medium: 0, high: 0, critical: 0 },
        completionRate: 0,
        byAssignee: {}
      };
      return res.json({ success: true, data: emptyStats, cached: false });
    }

    const allTasks = await Task.find();
    
    const stats = {
      total: allTasks.length,
      byStatus: {
        open: allTasks.filter(t => t.status === 'open').length,
        'in-progress': allTasks.filter(t => t.status === 'in-progress').length,
        completed: allTasks.filter(t => t.status === 'completed').length,
        blocked: allTasks.filter(t => t.status === 'blocked').length
      },
      byPriority: {
        low: allTasks.filter(t => t.priority === 'low').length,
        medium: allTasks.filter(t => t.priority === 'medium').length,
        high: allTasks.filter(t => t.priority === 'high').length,
        critical: allTasks.filter(t => t.priority === 'critical').length
      },
      completionRate: allTasks.length > 0 
        ? Math.round((allTasks.filter(t => t.status === 'completed').length / allTasks.length) * 100)
        : 0,
      byAssignee: {}
    };

    // Group by assignee
    allTasks.forEach(task => {
      if (!stats.byAssignee[task.assignee]) {
        stats.byAssignee[task.assignee] = {
          total: 0,
          completed: 0,
          open: 0,
          'in-progress': 0,
          blocked: 0
        };
      }
      stats.byAssignee[task.assignee].total++;
      stats.byAssignee[task.assignee][task.status]++;
    });

    cache.set(cacheKey, stats);

    res.json({ success: true, data: stats, cached: false });

  } catch (error) {
    console.error('Get stats error:', error);
    const emptyStats = {
      total: 0,
      byStatus: { open: 0, 'in-progress': 0, completed: 0, blocked: 0 },
      byPriority: { low: 0, medium: 0, high: 0, critical: 0 },
      completionRate: 0,
      byAssignee: {}
    };
    res.json({ success: true, data: emptyStats });
  }
};

/**
 * Get single task by ID
 */
exports.getTaskById = async (req, res) => {
  try {
    if (!isMongoConnected()) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const task = await Task.findOne({ taskId: req.params.id });
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json({ success: true, data: task });
  } catch (error) {
    res.status(404).json({ error: 'Task not found' });
  }
};

/**
 * Create new task
 */
exports.createTask = async (req, res) => {
  try {
    if (!isMongoConnected()) {
      return res.status(503).json({ error: 'Database unavailable' });
    }

    const task = await Task.create(req.body);
    
    // Invalidate cache
    const cache = req.app.get('cache');
    cache.flushAll();
    
    res.status(201).json({ success: true, data: task });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Update task
 */
exports.updateTask = async (req, res) => {
  try {
    if (!isMongoConnected()) {
      return res.status(503).json({ error: 'Database unavailable' });
    }

    const task = await Task.findOneAndUpdate(
      { taskId: req.params.id },
      req.body,
      { new: true }
    );
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    // Invalidate cache
    const cache = req.app.get('cache');
    cache.flushAll();
    
    res.json({ success: true, data: task });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Delete task
 */
exports.deleteTask = async (req, res) => {
  try {
    if (!isMongoConnected()) {
      return res.status(503).json({ error: 'Database unavailable' });
    }

    const task = await Task.findOneAndDelete({ taskId: req.params.id });
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    // Invalidate cache
    const cache = req.app.get('cache');
    cache.flushAll();
    
    res.json({ success: true, message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get overview data for dashboard (trends, team performance, daily stats)
 */
exports.getOverviewData = async (req, res) => {
  try {
    const cache = req.app.get('cache');
    const cacheKey = 'overview_data';
    
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      return res.json({ success: true, data: cachedData, cached: true });
    }

    if (!isMongoConnected()) {
      return res.json({ 
        success: true, 
        data: getEmptyOverviewData(),
        cached: false 
      });
    }

    const allTasks = await Task.find().lean();
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);
    const lastWeekStart = new Date(lastWeek);
    lastWeekStart.setDate(lastWeekStart.getDate() - 7);

    // Current hour
    const currentHour = now.getHours();
    const currentHourStart = new Date(now);
    currentHourStart.setHours(currentHour, 0, 0, 0);
    const currentHourEnd = new Date(currentHourStart);
    currentHourEnd.setHours(currentHour + 1, 0, 0, 0);

    // Calculate KPI metrics
    const openTasks = allTasks.filter(t => t.status === 'open').length;
    const inProgressTasks = allTasks.filter(t => t.status === 'in-progress').length;
    
    // Tasks closed today
    const closedToday = allTasks.filter(t => {
      if (t.status !== 'completed' || !t.completedAt) return false;
      const completedDate = new Date(t.completedAt);
      return completedDate >= today;
    }).length;

    // Tasks closed this hour
    const closedThisHour = allTasks.filter(t => {
      if (t.status !== 'completed' || !t.completedAt) return false;
      const completedDate = new Date(t.completedAt);
      return completedDate >= currentHourStart && completedDate < currentHourEnd;
    }).length;

    // Completion rate
    const completionRate = allTasks.length > 0 
      ? Math.round((allTasks.filter(t => t.status === 'completed').length / allTasks.length) * 100)
      : 0;

    // Calculate trends (vs last week)
    const tasksLastWeek = allTasks.filter(t => {
      const taskDate = new Date(t.createdAt || t.updatedAt);
      return taskDate >= lastWeekStart && taskDate < lastWeek;
    });

    const openLastWeek = tasksLastWeek.filter(t => t.status === 'open').length;
    const inProgressLastWeek = tasksLastWeek.filter(t => t.status === 'in-progress').length;
    const closedLastWeekToday = tasksLastWeek.filter(t => {
      if (t.status !== 'completed' || !t.completedAt) return false;
      const completedDate = new Date(t.completedAt);
      const lastWeekToday = new Date(lastWeek);
      return completedDate >= lastWeekToday && completedDate < new Date(lastWeekToday.getTime() + 24 * 60 * 60 * 1000);
    }).length;

    const calculateTrend = (current, previous) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return Math.round(((current - previous) / previous) * 100);
    };

    // Generate 7-day trend data
    const trendData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      
      const dayStart = new Date(date);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(date);
      dayEnd.setHours(23, 59, 59, 999);

      const tasksCreated = allTasks.filter(t => {
        const created = new Date(t.createdAt);
        return created >= dayStart && created <= dayEnd;
      }).length;

      const tasksCompleted = allTasks.filter(t => {
        if (t.status !== 'completed' || !t.completedAt) return false;
        const completed = new Date(t.completedAt);
        return completed >= dayStart && completed <= dayEnd;
      }).length;

      const tasksInProgress = allTasks.filter(t => {
        if (t.status !== 'in-progress') return false;
        const updated = new Date(t.updatedAt || t.createdAt);
        return updated >= dayStart && updated <= dayEnd;
      }).length;

      trendData.push({
        date: dateStr,
        created: tasksCreated,
        completed: tasksCompleted,
        inProgress: tasksInProgress
      });
    }

    // Calculate averages
    const avgDailyCompletion = trendData.reduce((sum, d) => sum + d.completed, 0) / 7;
    const avgDailyCreation = trendData.reduce((sum, d) => sum + d.created, 0) / 7;
    const avgInProgress = trendData.reduce((sum, d) => sum + d.inProgress, 0) / 7;

    // Team performance data
    const teamPerformance = {};
    allTasks.forEach(task => {
      if (!teamPerformance[task.assignee]) {
        teamPerformance[task.assignee] = {
          name: task.assignee,
          completed: 0,
          inProgress: 0,
          open: 0
        };
      }
      if (task.status === 'completed') teamPerformance[task.assignee].completed++;
      else if (task.status === 'in-progress') teamPerformance[task.assignee].inProgress++;
      else if (task.status === 'open') teamPerformance[task.assignee].open++;
    });

    const teamPerformanceArray = Object.values(teamPerformance);

    // Task distribution
    const taskDistribution = {
      open: allTasks.filter(t => t.status === 'open').length,
      inProgress: allTasks.filter(t => t.status === 'in-progress').length,
      completed: allTasks.filter(t => t.status === 'completed').length,
      blocked: allTasks.filter(t => t.status === 'blocked').length
    };

    const overviewData = {
      kpis: {
        openTasks: {
          value: openTasks,
          trend: calculateTrend(openTasks, openLastWeek),
          trendLabel: 'vs last week'
        },
        inProgress: {
          value: inProgressTasks,
          trend: calculateTrend(inProgressTasks, inProgressLastWeek),
          trendLabel: 'vs last week'
        },
        closedToday: {
          value: closedToday,
          trend: calculateTrend(closedToday, closedLastWeekToday),
          trendLabel: 'vs last week'
        },
        closedThisHour: {
          value: closedThisHour,
          trend: -3, // Placeholder
          trendLabel: 'vs last week',
          timeRange: (() => {
            const formatHour = (hour) => {
              const displayHour = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour);
              const ampm = hour >= 12 ? 'PM' : 'AM';
              return `${displayHour}:00 ${ampm}`;
            };
            const nextHour = currentHour === 23 ? 0 : currentHour + 1;
            return `${formatHour(currentHour)} - ${formatHour(nextHour)}`;
          })()
        },
        completionRate: {
          value: completionRate,
          trend: -3, // Placeholder
          trendLabel: 'vs last week'
        }
      },
      taskDistribution,
      trendData,
      trendAverages: {
        avgDailyCompletion: avgDailyCompletion.toFixed(1),
        avgDailyCreation: avgDailyCreation.toFixed(1),
        avgInProgress: avgInProgress.toFixed(1)
      },
      teamPerformance: teamPerformanceArray
    };

    cache.set(cacheKey, overviewData, 300); // Cache for 5 minutes

    res.json({ success: true, data: overviewData, cached: false });

  } catch (error) {
    console.error('Get overview error:', error);
    res.json({ success: true, data: getEmptyOverviewData() });
  }
};

function getEmptyOverviewData() {
  return {
    kpis: {
      openTasks: { value: 0, trend: 0, trendLabel: 'vs last week' },
      inProgress: { value: 0, trend: 0, trendLabel: 'vs last week' },
      closedToday: { value: 0, trend: 0, trendLabel: 'vs last week' },
      closedThisHour: { value: 0, trend: 0, trendLabel: 'vs last week', timeRange: '' },
      completionRate: { value: 0, trend: 0, trendLabel: 'vs last week' }
    },
    taskDistribution: { open: 0, inProgress: 0, completed: 0, blocked: 0 },
    trendData: [],
    trendAverages: { avgDailyCompletion: '0', avgDailyCreation: '0', avgInProgress: '0' },
    teamPerformance: []
  };
}

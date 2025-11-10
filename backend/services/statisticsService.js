/**
 * Statistics and analytics service
 */
const Task = require('../models/Task');
const Project = require('../models/Project');

class StatisticsService {
  /**
   * Calculate task statistics
   */
  async calculateTaskStats(tasks) {
    const stats = {
      total: tasks.length,
      byStatus: {
        open: 0,
        'in-progress': 0,
        completed: 0,
        blocked: 0
      },
      byPriority: {
        low: 0,
        medium: 0,
        high: 0,
        critical: 0
      },
      byAssignee: {},
      completionRate: 0,
      averageCompletionTime: 0
    };

    // Count by status and priority
    tasks.forEach(task => {
      stats.byStatus[task.status]++;
      stats.byPriority[task.priority]++;

      // Group by assignee
      if (!stats.byAssignee[task.assignee]) {
        stats.byAssignee[task.assignee] = {
          total: 0,
          open: 0,
          'in-progress': 0,
          completed: 0,
          blocked: 0
        };
      }
      stats.byAssignee[task.assignee].total++;
      stats.byAssignee[task.assignee][task.status]++;
    });

    // Calculate completion rate
    if (stats.total > 0) {
      stats.completionRate = Math.round((stats.byStatus.completed / stats.total) * 100);
    }

    // Calculate average completion time
    const completedTasks = tasks.filter(t => t.completedAt && t.createdAt);
    if (completedTasks.length > 0) {
      const totalTime = completedTasks.reduce((sum, task) => {
        const time = new Date(task.completedAt) - new Date(task.createdAt);
        return sum + time;
      }, 0);
      const avgMs = totalTime / completedTasks.length;
      stats.averageCompletionTime = Math.round(avgMs / (1000 * 60 * 60 * 24)); // Convert to days
    }

    return stats;
  }

  /**
   * Calculate project statistics
   */
  async calculateProjectStats(project, tasks) {
    const projectTasks = tasks.filter(t => t.projectId === project.projectId);
    const completedTasks = projectTasks.filter(t => t.status === 'completed');

    return {
      projectId: project.projectId,
      name: project.name,
      totalTasks: projectTasks.length,
      completedTasks: completedTasks.length,
      completionRate: projectTasks.length > 0 
        ? Math.round((completedTasks.length / projectTasks.length) * 100)
        : 0,
      tasksByStatus: {
        open: projectTasks.filter(t => t.status === 'open').length,
        'in-progress': projectTasks.filter(t => t.status === 'in-progress').length,
        completed: completedTasks.length,
        blocked: projectTasks.filter(t => t.status === 'blocked').length
      }
    };
  }

  /**
   * Get team performance metrics
   */
  async getTeamPerformance(timeRange = 7) {
    const now = new Date();
    const startDate = new Date(now.getTime() - timeRange * 24 * 60 * 60 * 1000);

    const tasks = await Task.find({
      $or: [
        { createdAt: { $gte: startDate } },
        { updatedAt: { $gte: startDate } },
        { completedAt: { $gte: startDate } }
      ]
    });

    const metrics = {
      timeRange,
      tasksCreated: tasks.filter(t => t.createdAt >= startDate).length,
      tasksCompleted: tasks.filter(t => t.completedAt && t.completedAt >= startDate).length,
      tasksInProgress: tasks.filter(t => t.status === 'in-progress').length,
      tasksBlocked: tasks.filter(t => t.status === 'blocked').length,
      teamMembers: [...new Set(tasks.map(t => t.assignee))].length,
      velocity: 0
    };

    // Calculate velocity (tasks completed per day)
    if (timeRange > 0) {
      metrics.velocity = (metrics.tasksCompleted / timeRange).toFixed(2);
    }

    return metrics;
  }

  /**
   * Identify at-risk tasks
   */
  async getAtRiskTasks() {
    const now = new Date();
    const tasks = await Task.find({ status: { $ne: 'completed' } });

    return {
      overdue: tasks.filter(t => t.dueDate && new Date(t.dueDate) < now),
      blocked: tasks.filter(t => t.status === 'blocked'),
      longRunning: tasks.filter(t => {
        const daysOpen = (now - new Date(t.createdAt)) / (1000 * 60 * 60 * 24);
        return daysOpen > 14; // Tasks open for more than 2 weeks
      }),
      highPriorityOpen: tasks.filter(t => 
        (t.priority === 'high' || t.priority === 'critical') && 
        t.status === 'open'
      )
    };
  }

  /**
   * Get assignee workload
   */
  async getAssigneeWorkload() {
    const tasks = await Task.find({ status: { $ne: 'completed' } });
    const workload = {};

    tasks.forEach(task => {
      if (!workload[task.assignee]) {
        workload[task.assignee] = {
          total: 0,
          open: 0,
          'in-progress': 0,
          blocked: 0,
          highPriority: 0,
          estimatedHours: 0
        };
      }

      workload[task.assignee].total++;
      workload[task.assignee][task.status]++;
      
      if (task.priority === 'high' || task.priority === 'critical') {
        workload[task.assignee].highPriority++;
      }
      
      if (task.estimatedHours) {
        workload[task.assignee].estimatedHours += task.estimatedHours;
      }
    });

    return workload;
  }
}

module.exports = new StatisticsService();

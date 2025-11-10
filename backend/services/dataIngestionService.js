const csv = require('csv-parser');
const xlsx = require('xlsx');
const fs = require('fs');
const Task = require('../models/Task');
const Project = require('../models/Project');
const mongoose = require('mongoose');

class DataIngestionService {
  constructor() {
    this.cache = null;
  }

  setCache(cache) {
    this.cache = cache;
  }

  isMongoConnected() {
    return mongoose.connection.readyState === 1;
  }
  /**
   * Process uploaded CSV file
   */
  async processCSV(filePath) {
    const results = [];
    
    return new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', async () => {
          try {
            const processed = await this.ingestData(results);
            resolve(processed);
          } catch (error) {
            reject(error);
          }
        })
        .on('error', (error) => reject(error));
    });
  }

  /**
   * Process uploaded Excel file
   */
  async processExcel(filePath) {
    try {
      const workbook = xlsx.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data = xlsx.utils.sheet_to_json(worksheet);
      
      return await this.ingestData(data);
    } catch (error) {
      throw new Error(`Excel processing failed: ${error.message}`);
    }
  }

  /**
   * Ingest parsed data into database
   */
  async ingestData(data) {
    const tasks = [];
    const projects = new Map();
    
    // Log CSV column names for debugging
    if (data.length > 0) {
      console.log('\n=== CSV Column Names Detected ===');
      console.log('Columns:', Object.keys(data[0]));
      console.log('First row sample:', data[0]);
      console.log('=================================\n');
    }
    
    for (const row of data) {
      // Normalize column names (handle different formats)
      const normalizedRow = this.normalizeRow(row);
      
      // Helper function to get value with multiple possible keys (handles normalized keys)
      const getValue = (...keys) => {
        for (const key of keys) {
          // Try original key first
          if (row[key] !== undefined && row[key] !== null && row[key] !== '') {
            return row[key];
          }
          // Try normalized key
          const normalizedKey = key.toLowerCase().replace(/[\s-_]+/g, '');
          if (normalizedRow[normalizedKey] !== undefined && normalizedRow[normalizedKey] !== null && normalizedRow[normalizedKey] !== '') {
            return normalizedRow[normalizedKey];
          }
        }
        return null;
      };
      
      // Extract project info with fallbacks
      const projectId = getValue('projectId', 'project', 'projectid') || 'default-project';
      const projectName = getValue('projectName', 'projectname', 'project_name') || projectId;
      
      if (!projects.has(projectId)) {
        projects.set(projectId, {
          projectId,
          name: projectName,
          description: getValue('projectDescription', 'projectdescription', 'project_description') || '',
          status: 'active',
          teamMembers: []
        });
      }
      
      // Create task object with proper field extraction
      const task = {
        taskId: getValue('taskId', 'taskid', 'task_id', 'TaskId', 'TaskID', 'ID', 'id') || `TASK-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: getValue('title', 'Title', 'tasks name', 'tasksname', 'tasks_name', 'Tasks Name', 'TasksName', 'taskname', 'task_name', 'taskName', 'TaskName', 'Name', 'name', 'Task', 'task') || 'Untitled Task',
        description: getValue('description', 'Description', 'desc', 'Desc', 'Details', 'details') || '',
        status: this.normalizeStatus(getValue('status', 'Status')),
        priority: this.normalizePriority(getValue('priority', 'Priority')),
        assignee: getValue('assignee', 'Assignee', 'assignedto', 'assigned_to', 'assignedTo', 'AssignedTo', 'Owner', 'owner', 'User', 'user') || 'Unassigned',
        projectId,
        estimatedHours: parseFloat(getValue('estimatedHours', 'estimatedhours', 'estimated_hours', 'EstimatedHours', 'Estimate', 'estimate') || 0),
        actualHours: parseFloat(getValue('actualHours', 'actualhours', 'actual_hours', 'ActualHours', 'Actual', 'actual') || 0),
        createdAt: this.parseDate(getValue('createdAt', 'createdat', 'created_at', 'CreatedAt', 'Created', 'created')) || new Date(),
        updatedAt: this.parseDate(getValue('updatedAt', 'updatedat', 'updated_at', 'UpdatedAt', 'Updated', 'updated')) || new Date(),
        completedAt: this.parseDate(getValue('completedAt', 'completedat', 'completed_at', 'CompletedAt', 'Completed', 'completed')),
        dueDate: this.parseDate(getValue('dueDate', 'duedate', 'due_date', 'DueDate', 'Due', 'due')),
        tags: this.parseTags(getValue('tags', 'Tags', 'tag', 'Tag')),
        comments: this.parseComments(getValue('comments', 'Comments', 'comment', 'Comment'))
      };
      
      tasks.push(task);
      
      // Add team member to project
      const project = projects.get(projectId);
      if (task.assignee && task.assignee !== 'Unassigned') {
        const exists = project.teamMembers.find(m => m.name === task.assignee);
        if (!exists) {
          project.teamMembers.push({
            name: task.assignee,
            role: getValue('role') || 'Developer',
            email: getValue('email') || `${task.assignee.toLowerCase().replace(/\s+/g, '.')}@example.com`
          });
        }
      }
    }
    
    // Save to database
    const savedProjects = await this.saveProjects(Array.from(projects.values()));
    const savedTasks = await this.saveTasks(tasks);
    
    // Update project statistics
    await this.updateProjectStats(savedProjects);
    
    return {
      projectsCount: savedProjects.length,
      tasksCount: savedTasks.length,
      projects: savedProjects,
      tasks: savedTasks
    };
  }

  /**
   * Normalize row data (handle different column name formats)
   */
  normalizeRow(row) {
    const normalized = {};
    for (const [key, value] of Object.entries(row)) {
      const normalizedKey = key.toLowerCase().replace(/[\s-_]+/g, '');
      normalized[normalizedKey] = value;
    }
    return normalized;
  }

  /**
   * Normalize status values
   */
  normalizeStatus(status) {
    if (!status) return 'open';
    const s = status.toLowerCase();
    if (s.includes('progress') || s.includes('working')) return 'in-progress';
    if (s.includes('complete') || s.includes('done') || s.includes('closed')) return 'completed';
    if (s.includes('block')) return 'blocked';
    return 'open';
  }

  /**
   * Normalize priority values
   */
  normalizePriority(priority) {
    if (!priority) return 'medium';
    const p = priority.toLowerCase();
    if (p.includes('critical') || p.includes('urgent')) return 'critical';
    if (p.includes('high')) return 'high';
    if (p.includes('low')) return 'low';
    return 'medium';
  }

  /**
   * Parse date string
   */
  parseDate(dateStr) {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? null : date;
  }

  /**
   * Parse tags (comma or semicolon-separated string to array)
   */
  parseTags(tagsStr) {
    if (!tagsStr) return [];
    // Handle both comma and semicolon separators
    const separator = tagsStr.includes(';') ? ';' : ',';
    return tagsStr.split(separator).map(t => t.trim()).filter(t => t);
  }

  /**
   * Parse comments (JSON string or simple text)
   */
  parseComments(commentsStr) {
    if (!commentsStr) return [];
    try {
      return JSON.parse(commentsStr);
    } catch {
      return [{ author: 'System', text: commentsStr, timestamp: new Date() }];
    }
  }

  /**
   * Save projects to database or cache
   */
  async saveProjects(projects) {
    // If MongoDB is not connected, store in cache
    if (!this.isMongoConnected()) {
      if (this.cache) {
        this.cache.set('all_projects', projects);
      }
      return projects;
    }

    // MongoDB is connected, save to database
    const saved = [];
    for (const project of projects) {
      const existing = await Project.findOne({ projectId: project.projectId });
      if (existing) {
        Object.assign(existing, project);
        saved.push(await existing.save());
      } else {
        saved.push(await Project.create(project));
      }
    }
    return saved;
  }

  /**
   * Save tasks to database or cache
   */
  async saveTasks(tasks) {
    // If MongoDB is not connected, store in cache
    if (!this.isMongoConnected()) {
      if (this.cache) {
        this.cache.set('tasks_{}', tasks);
      }
      return tasks;
    }

    // MongoDB is connected, save to database
    const saved = [];
    for (const task of tasks) {
      const existing = await Task.findOne({ taskId: task.taskId });
      if (existing) {
        Object.assign(existing, task);
        saved.push(await existing.save());
      } else {
        saved.push(await Task.create(task));
      }
    }
    return saved;
  }

  /**
   * Update project statistics
   */
  async updateProjectStats(projects) {
    // If MongoDB is not connected, calculate stats in memory
    if (!this.isMongoConnected()) {
      const tasks = this.cache ? this.cache.get('tasks_{}') || [] : [];
      
      for (const project of projects) {
        const projectTasks = tasks.filter(t => t.projectId === project.projectId);
        const completedTasks = projectTasks.filter(t => t.status === 'completed');
        
        project.totalTasks = projectTasks.length;
        project.completedTasks = completedTasks.length;
        project.completionRate = projectTasks.length > 0 
          ? Math.round((completedTasks.length / projectTasks.length) * 100) 
          : 0;
      }
      
      if (this.cache) {
        this.cache.set('all_projects', projects);
      }
      return;
    }

    // MongoDB is connected, update in database
    for (const project of projects) {
      const tasks = await Task.find({ projectId: project.projectId });
      const completedTasks = tasks.filter(t => t.status === 'completed');
      
      project.totalTasks = tasks.length;
      project.completedTasks = completedTasks.length;
      project.completionRate = tasks.length > 0 
        ? Math.round((completedTasks.length / tasks.length) * 100) 
        : 0;
      
      await project.save();
    }
  }
}

module.exports = new DataIngestionService();

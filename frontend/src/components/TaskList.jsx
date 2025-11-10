import React, { useState, useEffect } from 'react';

function TaskList({ tasks }) {
  const [filter, setFilter] = useState('all');

  // Debug: Log tasks to see what we're receiving (can be removed in production)
  useEffect(() => {
    if (tasks && tasks.length > 0) {
      console.log('=== TaskList Debug Info ===');
      console.log('Total tasks received:', tasks.length);
      console.log('First task full data:', tasks[0]);
      console.log('Field values:');
      console.log('  - taskId:', tasks[0]?.taskId);
      console.log('  - title:', tasks[0]?.title);
      console.log('  - assignee:', tasks[0]?.assignee);
      console.log('  - status:', tasks[0]?.status);
      console.log('  - priority:', tasks[0]?.priority);
      console.log('  - projectId:', tasks[0]?.projectId);
      console.log('========================');
    } else {
      console.log('TaskList: No tasks available');
    }
  }, [tasks]);

  // Normalize task data to handle different formats
  const normalizeTask = (task) => {
    if (!task) return null;
    
    // Handle Mongoose documents or plain objects
    const normalized = {
      _id: task._id || task.id,
      taskId: task.taskId || task.task_id || task.TaskId || task.TaskID || '',
      title: task.title || task.Title || task['tasks name'] || task.tasksname || task.tasks_name || task['Tasks Name'] || task.TasksName || task.taskName || task.TaskName || task.task_name || task.name || task.Name || 'Untitled Task',
      description: task.description || task.Description || task.desc || task.Desc || '',
      status: task.status || task.Status || 'open',
      priority: task.priority || task.Priority || 'medium',
      assignee: task.assignee || task.Assignee || task.assignedTo || task.AssignedTo || task.assigned_to || task.owner || task.Owner || 'Unassigned',
      projectId: task.projectId || task.ProjectId || task.project_id || task.project || task.Project || 'No Project',
      estimatedHours: task.estimatedHours || task.estimated_hours || 0,
      actualHours: task.actualHours || task.actual_hours || 0,
      dueDate: task.dueDate || task.due_date || task.DueDate || null,
      createdAt: task.createdAt || task.created_at || task.CreatedAt || null,
      updatedAt: task.updatedAt || task.updated_at || task.UpdatedAt || null,
      completedAt: task.completedAt || task.completed_at || task.CompletedAt || null,
      tags: task.tags || task.Tags || [],
      comments: task.comments || task.Comments || []
    };
    
    return normalized;
  };

  // Filter and normalize tasks
  const filteredTasks = tasks
    .map(normalizeTask)
    .filter(task => {
      if (!task) return false;
      if (filter === 'all') return true;
      return task.status === filter;
    });

  const getStatusBadge = (status) => {
    const statusMap = {
      'open': 'status-open',
      'in-progress': 'status-in-progress',
      'completed': 'status-completed',
      'blocked': 'status-blocked'
    };
    return statusMap[status] || 'status-open';
  };

  const getFilterButtonStyle = (filterType) => {
    const isActive = filter === filterType;
    return {
      background: isActive 
        ? 'linear-gradient(135deg, #2563eb 0%, #0ea5e9 50%, #06b6d4 100%)' 
        : '#f8fafc',
      color: isActive ? 'white' : '#475569',
      border: isActive ? 'none' : '1px solid #e2e8f0',
      padding: '8px 16px',
      borderRadius: '8px',
      fontSize: '13px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s',
      boxShadow: isActive ? '0 2px 8px rgba(37, 99, 235, 0.3)' : 'none'
    };
  };

  return (
    <div className="card" style={{ marginTop: '0' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '24px',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <h3 style={{ marginBottom: '4px' }}>📋 Task List</h3>
          <p style={{ color: '#999', fontSize: '13px' }}>
            {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'} {filter !== 'all' && `(${filter})`}
          </p>
        </div>
        <div style={{ 
          display: 'flex', 
          gap: '8px',
          flexWrap: 'wrap'
        }}>
          <button 
            onClick={() => setFilter('all')}
            style={getFilterButtonStyle('all')}
          >
            All
          </button>
          <button 
            onClick={() => setFilter('open')}
            style={getFilterButtonStyle('open')}
          >
            Open
          </button>
          <button 
            onClick={() => setFilter('in-progress')}
            style={getFilterButtonStyle('in-progress')}
          >
            In Progress
          </button>
          <button 
            onClick={() => setFilter('completed')}
            style={getFilterButtonStyle('completed')}
          >
            Completed
          </button>
          <button 
            onClick={() => setFilter('blocked')}
            style={getFilterButtonStyle('blocked')}
          >
            Blocked
          </button>
        </div>
      </div>

      <div className="task-list">
        {filteredTasks.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '60px 20px', 
            color: '#666',
            background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.05) 0%, rgba(14, 165, 233, 0.05) 100%)',
            borderRadius: '12px',
            border: '2px dashed rgba(37, 99, 235, 0.3)'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
            <p style={{ fontSize: '16px', fontWeight: '500', marginBottom: '8px' }}>
              No tasks found
            </p>
            <p style={{ fontSize: '14px', color: '#999' }}>
              {filter !== 'all' ? 'Try a different filter or' : ''} Upload data to get started!
            </p>
          </div>
        ) : (
          <>
            {filteredTasks.slice(0, 20).map((task, index) => {
              if (!task) return null;
              
              // Format priority with proper capitalization
              const formatPriority = (priority) => {
                if (!priority) return 'Medium';
                return priority.charAt(0).toUpperCase() + priority.slice(1);
              };

              // Format date safely
              const formatDate = (date) => {
                if (!date) return null;
                try {
                  const dateObj = date instanceof Date ? date : new Date(date);
                  if (isNaN(dateObj.getTime())) return null;
                  return dateObj.toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric' 
                  });
                } catch (e) {
                  return null;
                }
              };

              const displayTitle = (() => {
                const title = (task.title || '').toString().trim();
                if (title && title.toLowerCase() !== 'untitled task') return title;
                const fromDesc = (task.description || '').toString().trim().split(/\n+/)[0];
                if (fromDesc) return fromDesc.substring(0, 80);
                if (task.taskId) return `Task ${task.taskId}`;
                return `Task ${index + 1}`;
              })();

              return (
                <div 
                  key={task.taskId || task._id || index} 
                  className={`task-item ${task.status}`}
                  style={{
                    animation: `fadeIn 0.3s ease-out ${index * 0.05}s both`
                  }}
                >
                  <div className="task-title">
                    <span style={{ flex: 1, fontWeight: '600' }}>
                      {displayTitle}
                    </span>
                    <span className={`badge ${getStatusBadge(task.status)}`}>
                      {task.status ? task.status.replace('-', ' ').toUpperCase() : 'OPEN'}
                    </span>
                  </div>
                  <div className="task-meta">
                    <span title="Assignee">
                      👤 {task.assignee || 'Unassigned'}
                    </span>
                    <span title="Priority">
                      🎯 {formatPriority(task.priority)}
                    </span>
                    <span title="Project">
                      📁 {task.projectId || 'No Project'}
                    </span>
                    {task.dueDate && formatDate(task.dueDate) && (
                      <span title="Due Date">
                        📅 {formatDate(task.dueDate)}
                      </span>
                    )}
                  </div>
                  {task.description && task.description.trim() && (
                    <div style={{ 
                      marginTop: '12px', 
                      fontSize: '14px', 
                      color: '#666',
                      lineHeight: '1.6',
                    padding: '12px',
                    background: 'rgba(37, 99, 235, 0.05)',
                    borderRadius: '8px'
                    }}>
                      {task.description.substring(0, 200)}
                      {task.description.length > 200 ? '...' : ''}
                    </div>
                  )}
                  {task.tags && task.tags.length > 0 && (
                    <div style={{ 
                      marginTop: '8px',
                      display: 'flex',
                      gap: '6px',
                      flexWrap: 'wrap'
                    }}>
                      {task.tags.map((tag, tagIdx) => (
                        <span 
                          key={tagIdx}
                          style={{
                            padding: '4px 8px',
                            background: 'rgba(37, 99, 235, 0.1)',
                            borderRadius: '4px',
                            fontSize: '11px',
                            color: '#2563eb',
                            fontWeight: '500'
                          }}
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
            {filteredTasks.length > 20 && (
              <div style={{ 
                textAlign: 'center', 
                padding: '20px', 
                color: '#999',
                fontSize: '14px',
                background: 'rgba(37, 99, 235, 0.05)',
                borderRadius: '8px',
                marginTop: '16px'
              }}>
                Showing 20 of {filteredTasks.length} tasks
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default TaskList;

import React from 'react';

function DashboardStats({ stats, tasks, projects }) {
  if (!stats) {
    return <div className="loading">No statistics available</div>;
  }

  const completionRate = stats.completionRate || 0;
  const activeTasks = stats.total - (stats.byStatus?.completed || 0);

  const getStatColor = (type) => {
    switch(type) {
      case 'blocked':
        return '#ef4444';
      case 'completed':
        return '#10b981';
      case 'in-progress':
        return '#f59e0b';
      default:
        return null;
    }
  };

  return (
    <div className="dashboard-grid">
      <div className="card">
        <h3>📊 Total Tasks</h3>
        <div className="stat-value">{stats.total || 0}</div>
        <div className="stat-label">
          <span style={{ color: '#2563eb', fontWeight: '600' }}>{activeTasks}</span> active tasks
        </div>
      </div>

      <div className="card">
        <h3>✅ Completed Tasks</h3>
        <div className="stat-value" style={{ color: getStatColor('completed') }}>
          {stats.byStatus?.completed || 0}
        </div>
        <div className="stat-label">
          <span style={{ color: '#10b981', fontWeight: '600' }}>{completionRate}%</span> completion rate
        </div>
      </div>

      <div className="card">
        <h3>🚧 In Progress</h3>
        <div className="stat-value" style={{ color: getStatColor('in-progress') }}>
          {stats.byStatus?.['in-progress'] || 0}
        </div>
        <div className="stat-label">
          <span style={{ color: '#f59e0b', fontWeight: '600' }}>{stats.byStatus?.open || 0}</span> open tasks
        </div>
      </div>

      <div className="card">
        <h3>🚫 Blocked</h3>
        <div className="stat-value" style={{ color: getStatColor('blocked') }}>
          {stats.byStatus?.blocked || 0}
        </div>
        <div className="stat-label">Needs immediate attention</div>
      </div>

      <div className="card">
        <h3>🎯 Projects</h3>
        <div className="stat-value">{projects?.length || 0}</div>
        <div className="stat-label">Active projects in progress</div>
      </div>

      <div className="card">
        <h3>👥 Team Members</h3>
        <div className="stat-value">
          {stats.byAssignee ? Object.keys(stats.byAssignee).length : 0}
        </div>
        <div className="stat-label">Team members contributing</div>
      </div>
    </div>
  );
}

export default DashboardStats;

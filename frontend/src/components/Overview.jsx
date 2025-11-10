import React, { useState, useEffect } from 'react';
import { taskAPI } from '../services/api';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  ComposedChart
} from 'recharts';

function Overview() {
  const [overviewData, setOverviewData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [teamPage, setTeamPage] = useState(1);
  const TEAM_PAGE_SIZE = 6;

  useEffect(() => {
    fetchOverviewData();
  }, []);

  const fetchOverviewData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await taskAPI.getOverview();
      setOverviewData(response.data.data);
    } catch (err) {
      console.error('Overview fetch error:', err);
      setError('Failed to load overview data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="overview-container" style={{ margin: 0 }}>
        <div className="loading">⏳ Loading overview data...</div>
      </div>
    );
  }

  if (error || !overviewData) {
    return (
      <div className="overview-container" style={{ margin: 0 }}>
        <div className="error">❌ {error || 'No data available'}</div>
      </div>
    );
  }

  // Professional Chart Colors
  const COLORS = {
    open: '#3b82f6',
    inProgress: '#f59e0b',
    completed: '#10b981',
    blocked: '#ef4444',
    created: '#0ea5e9',
    completedLine: '#10b981',
    inProgressLine: '#6366f1'
  };

  // Task distribution data for pie chart
  const distributionData = [
    { name: 'Open', value: overviewData.taskDistribution.open, color: COLORS.open },
    { name: 'In Progress', value: overviewData.taskDistribution.inProgress, color: COLORS.inProgress },
    { name: 'Completed', value: overviewData.taskDistribution.completed, color: COLORS.completed },
    { name: 'Blocked', value: overviewData.taskDistribution.blocked, color: COLORS.blocked }
  ].filter(item => item.value > 0);

  const totalTasks = Object.values(overviewData.taskDistribution).reduce((a, b) => a + b, 0);

  // KPI Card Component
  const KPICard = ({ title, value, trend, trendLabel, icon, timeRange }) => {
    const isPositive = trend >= 0;
    const trendColor = isPositive ? '#10b981' : '#ef4444';
    
    return (
      <div className="kpi-card">
        <div className="kpi-header">
          <span className="kpi-icon">{icon}</span>
          <span className="kpi-info-icon">ℹ️</span>
        </div>
        <div className="kpi-value">{value}</div>
        <div className="kpi-title">{title}</div>
        <div className="kpi-trend" style={{ color: trendColor }}>
          {trend >= 0 ? '+' : ''}{trend}% {trendLabel}
        </div>
        {timeRange && (
          <div className="kpi-time-range">{timeRange}</div>
        )}
      </div>
    );
  };

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="chart-tooltip">
          {payload.map((entry, index) => (
            <div key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  // Team performance pagination
  const totalTeamItems = (overviewData.teamPerformance || []).length;
  const totalTeamPages = Math.max(1, Math.ceil(totalTeamItems / TEAM_PAGE_SIZE));
  const startIdx = (teamPage - 1) * TEAM_PAGE_SIZE;
  const endIdx = startIdx + TEAM_PAGE_SIZE;
  const pagedTeamData = (overviewData.teamPerformance || []).slice(startIdx, endIdx);

  const goPrev = () => setTeamPage(p => Math.max(1, p - 1));
  const goNext = () => setTeamPage(p => Math.min(totalTeamPages, p + 1));

  return (
    <div className="overview-container" style={{ margin: 0 }}>
      <div className="overview-header">
        <h2>Overview</h2>
        <button className="refresh-btn-small" onClick={fetchOverviewData}>
          🔄 Refresh
        </button>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        <KPICard
          title="Open Tasks"
          value={overviewData.kpis.openTasks.value}
          trend={overviewData.kpis.openTasks.trend}
          trendLabel={overviewData.kpis.openTasks.trendLabel}
          icon="📋"
        />
        <KPICard
          title="In Progress"
          value={overviewData.kpis.inProgress.value}
          trend={overviewData.kpis.inProgress.trend}
          trendLabel={overviewData.kpis.inProgress.trendLabel}
          icon="✅"
        />
        <KPICard
          title="Closed Today"
          value={overviewData.kpis.closedToday.value}
          trend={overviewData.kpis.closedToday.trend}
          trendLabel={overviewData.kpis.closedToday.trendLabel}
          icon="✅"
        />
        <KPICard
          title="Closed This Hour"
          value={overviewData.kpis.closedThisHour.value}
          trend={overviewData.kpis.closedThisHour.trend}
          trendLabel={overviewData.kpis.closedThisHour.trendLabel}
          timeRange={overviewData.kpis.closedThisHour.timeRange}
          icon="✅"
        />
        <KPICard
          title="Completion Rate"
          value={`${overviewData.kpis.completionRate.value}%`}
          trend={overviewData.kpis.completionRate.trend}
          trendLabel={overviewData.kpis.completionRate.trendLabel}
          icon="✅"
        />
      </div>

      {/* Charts Grid - force 3 columns in one row */}
      <div className="charts-grid" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
        {/* Task Distribution Chart */}
        <div className="chart-card">
          <h3 className="chart-title">
            Task Distribution ({totalTasks})
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={distributionData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
                stroke="#ffffff"
                strokeWidth={2}
              >
                {distributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                content={<CustomTooltip />}
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value, entry) => (
                  <span style={{ color: '#475569' }}>
                    {value}: {entry.payload.value}
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* 7-Day Trend Analysis */}
        <div className="chart-card">
          <h3 className="chart-title">7-Day Trend Analysis</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={overviewData.trendData}>
              <defs>
                <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.completedLine} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={COLORS.completedLine} stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorCreated" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.created} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={COLORS.created} stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorInProgress" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.inProgressLine} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={COLORS.inProgressLine} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
              <XAxis 
                dataKey="date" 
                stroke="#475569"
                style={{ fontSize: '12px' }}
                tick={{ fill: '#475569' }}
              />
              <YAxis 
                stroke="#475569"
                style={{ fontSize: '12px' }}
                tick={{ fill: '#475569' }}
              />
              <Tooltip 
                content={<CustomTooltip />}
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  color: '#0f172a',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="completed"
                stroke={COLORS.completedLine}
                fillOpacity={1}
                fill="url(#colorCompleted)"
                name="Tasks Completed"
              />
              <Area
                type="monotone"
                dataKey="created"
                stroke={COLORS.created}
                fillOpacity={1}
                fill="url(#colorCreated)"
                name="Tasks Created"
              />
              <Area
                type="monotone"
                dataKey="inProgress"
                stroke={COLORS.inProgressLine}
                fillOpacity={1}
                fill="url(#colorInProgress)"
                name="Tasks In Progress"
              />
            </AreaChart>
          </ResponsiveContainer>
          <div className="trend-averages">
            <div className="avg-metric">
              Avg. Daily Completion: {overviewData.trendAverages.avgDailyCompletion} tasks
            </div>
            <div className="avg-metric">
              Avg. Daily Creation: {overviewData.trendAverages.avgDailyCreation} tasks
            </div>
            <div className="avg-metric">
              Avg. In Progress: {overviewData.trendAverages.avgInProgress} tasks
            </div>
          </div>
        </div>

        {/* Team Performance Chart */}
        <div className="chart-card">
          <h3 className="chart-title">Team Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={pagedTeamData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
              <XAxis 
                dataKey="name" 
                stroke="#475569"
                style={{ fontSize: '12px' }}
                tick={{ fill: '#475569' }}
              />
              <YAxis 
                stroke="#475569"
                style={{ fontSize: '12px' }}
                tick={{ fill: '#475569' }}
              />
              <Tooltip 
                content={<CustomTooltip />}
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  color: '#0f172a',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend />
              <Bar dataKey="completed" stackId="a" fill={COLORS.completedLine} name="Completed" />
              <Bar dataKey="inProgress" stackId="a" fill={COLORS.inProgress} name="In Progress" />
              <Bar dataKey="open" stackId="a" fill={COLORS.open} name="Open" />
            </BarChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
            <button className="ai-btn" onClick={goPrev} disabled={teamPage <= 1}>⟵ Prev</button>
            <div className="stat-label">Page {teamPage} of {totalTeamPages}</div>
            <button className="ai-btn" onClick={goNext} disabled={teamPage >= totalTeamPages}>Next ⟶</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Overview;


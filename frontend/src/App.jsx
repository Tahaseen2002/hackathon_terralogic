import React, { useState, useEffect } from 'react';
import './App.css';
import { taskAPI, projectAPI, uploadAPI, aiAPI } from './services/api';
import FileUpload from './components/FileUpload';
import DashboardStats from './components/DashboardStats';
import AIInsights from './components/AIInsights';
import ChatBot from './components/ChatBot';
import TaskList from './components/TaskList';
import Overview from './components/Overview';

function App() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [tasksRes, projectsRes, statsRes] = await Promise.all([
        taskAPI.getAll(),
        projectAPI.getAll(),
        taskAPI.getStats()
      ]);

      setTasks(tasksRes.data.data || []);
      setProjects(projectsRes.data.data || []);
      setStats(statsRes.data.data || null);

    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.response?.data?.error || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file) => {
    try {
      setError(null);
      setUploadSuccess(false);
      
      const response = await uploadAPI.uploadFile(file);
      
      if (response.data.success) {
        setUploadSuccess(true);
        // Refresh all data after upload
        await fetchData();
        // Automatically switch to Tasks tab after successful upload
        setActiveTab('tasks');
        
        setTimeout(() => setUploadSuccess(false), 5000);
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.response?.data?.error || 'Upload failed');
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      
      case 'import':
        return <FileUpload onUpload={handleFileUpload} />;
        case 'overview':
        return <Overview />;
      case 'tasks':
        return (
          <>
            <DashboardStats stats={stats} tasks={tasks} projects={projects} />
            <TaskList tasks={tasks} />
          </>
        );
      case 'ai':
        return <AIInsights />;
      case 'chat':
        return <ChatBot />;
      default:
        return <Overview />;
    }
  };

  return (
    <div className="app">
      <header className="header">
        <div>
          <h1>TerraDesk</h1>
          <p>Team Productivity Dashboard with AI Insights</p>
        </div>
        <button className="refresh-btn" onClick={fetchData}>
          🔄 Refresh Data
        </button>
      </header>

      {error && <div className="error">❌{error}</div>}
      {uploadSuccess && <div className="success">✅ Data imported successfully!</div>}

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button 
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
         Overview
        </button>
        <button 
          className={`tab-btn ${activeTab === 'import' ? 'active' : ''}`}
          onClick={() => setActiveTab('import')}
        >
         Import Data
        </button>
        <button 
          className={`tab-btn ${activeTab === 'tasks' ? 'active' : ''}`}
          onClick={() => setActiveTab('tasks')}
        >
           Tasks
        </button>
        <button 
          className={`tab-btn ${activeTab === 'ai' ? 'active' : ''}`}
          onClick={() => setActiveTab('ai')}
        >
           AI Powered
        </button>
        <button 
          className={`tab-btn ${activeTab === 'chat' ? 'active' : ''}`}
          onClick={() => setActiveTab('chat')}
        >
           Ask About Your Team
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {loading && activeTab !== 'import' && activeTab !== 'overview' ? (
          <div className="loading">⏳ Loading dashboard data...</div>
        ) : (
          renderTabContent()
        )}
      </div>
    </div>
  );
}

export default App;

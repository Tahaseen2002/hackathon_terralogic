# 📁 PULSEVO Project Structure

```
waste/
├── backend/
│   ├── controllers/           # (Future) Request handlers
│   ├── models/
│   │   ├── Task.js           # ✅ Task schema (MongoDB)
│   │   └── Project.js        # ✅ Project schema (MongoDB)
│   ├── routes/
│   │   ├── taskRoutes.js     # ✅ Task CRUD + stats endpoints
│   │   ├── projectRoutes.js  # ✅ Project CRUD endpoints
│   │   ├── uploadRoutes.js   # ✅ CSV/Excel upload handler
│   │   └── aiRoutes.js       # ✅ AI analytics endpoints (6 modes)
│   ├── services/
│   │   ├── aiService.js      # ✅ Gemini/OpenAI integration
│   │   └── dataIngestionService.js  # ✅ CSV/Excel parser
│   ├── uploads/              # 📁 Temporary upload storage
│   ├── server.js             # ✅ Express app + MongoDB connection
│   └── .env                  # ✅ Environment variables
│
├── frontend/
│   ├── public/               # Static assets
│   ├── src/
│   │   ├── components/
│   │   │   ├── FileUpload.jsx       # ✅ File upload interface
│   │   │   ├── DashboardStats.jsx   # ✅ 6 stat cards
│   │   │   ├── AIInsights.jsx       # ✅ AI analysis panel
│   │   │   ├── ChatBot.jsx          # ✅ Conversational AI
│   │   │   └── TaskList.jsx         # ✅ Filtered task display
│   │   ├── services/
│   │   │   └── api.js        # ✅ Axios API client
│   │   ├── App.jsx           # ✅ Main application component
│   │   ├── App.css           # ✅ Gradient purple theme
│   │   └── main.jsx          # ✅ React entry point
│   ├── index.html            # ✅ HTML template
│   ├── vite.config.js        # ✅ Vite configuration
│   └── package.json          # ✅ Frontend dependencies
│
├── sample-data.csv           # ✅ 25 sample tasks for testing
├── package.json              # ✅ Backend dependencies + scripts
├── start.bat                 # ✅ Windows quick start script
├── SETUP_GUIDE.md           # ✅ Detailed setup instructions
└── QUICK_START.md           # ✅ Quick reference guide

```

## 📦 Dependencies Installed

### Backend (`package.json`)
```json
{
  "dependencies": {
    "@google/generative-ai": "^0.24.1",  // Gemini AI
    "axios": "^1.13.2",                  // HTTP client
    "cors": "^2.8.5",                    // Cross-origin support
    "csv-parser": "^3.2.0",              // CSV parsing
    "dotenv": "^17.2.3",                 // Environment variables
    "express": "^5.1.0",                 // Web framework
    "mongoose": "^8.19.3",               // MongoDB ODM
    "multer": "^2.0.2",                  // File uploads
    "node-cache": "^5.1.2",              // In-memory cache
    "openai": "^6.8.1",                  // OpenAI (alternative)
    "xlsx": "^0.18.5"                    // Excel parsing
  },
  "devDependencies": {
    "nodemon": "^3.x",                   // Auto-restart
    "concurrently": "^9.x"               // Run multiple commands
  }
}
```

### Frontend (`frontend/package.json`)
```json
{
  "dependencies": {
    "@vitejs/plugin-react": "^5.1.0",   // Vite React plugin
    "axios": "^1.13.2",                 // API client
    "react": "^19.2.0",                 // React library
    "react-dom": "^19.2.0",             // React DOM
    "recharts": "^3.3.0",               // Charts (future)
    "vite": "^7.2.1"                    // Build tool
  }
}
```

## 🔌 API Routes Summary

### Tasks API (`/api/tasks`)
- `GET /api/tasks` - Get all tasks (filterable)
- `GET /api/tasks/stats` - Aggregated statistics
- `GET /api/tasks/:id` - Single task
- `POST /api/tasks` - Create task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Projects API (`/api/projects`)
- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Single project
- `POST /api/projects` - Create project
- `PUT /api/projects/:id` - Update project

### Upload API (`/api/upload`)
- `POST /api/upload` - Upload CSV/Excel file
  - Accepts: `.csv`, `.xlsx`, `.xls`
  - Max size: 10MB
  - Auto-parses and stores in DB

### AI API (`/api/ai`)
- `POST /api/ai/summarize` - Team productivity summary
- `POST /api/ai/query` - Natural language Q&A
- `POST /api/ai/predict` - Sprint progress forecast
- `POST /api/ai/sentiment` - Team morale analysis
- `POST /api/ai/bottlenecks` - Workload bottleneck detection
- `POST /api/ai/daily-summary` - Daily performance report

## 🎨 Frontend Components

### App.jsx (Main Container)
- State management for tasks, projects, stats
- Handles file uploads
- Coordinates data refresh
- Error/success notifications

### FileUpload.jsx
- Drag-and-drop style interface
- File type validation
- Upload progress feedback
- Auto-refresh after upload

### DashboardStats.jsx
- 6 metric cards
- Real-time statistics
- Color-coded values
- Responsive grid layout

### AIInsights.jsx
- 5 AI analysis buttons
- Loading states
- Formatted AI responses
- Cache-aware (prevents redundant calls)

### ChatBot.jsx
- Natural language input
- Conversation history
- Message threading
- Real-time AI responses

### TaskList.jsx
- Status filtering (All, Open, In Progress, Completed)
- Color-coded badges
- Pagination (shows 20)
- Task metadata display

## 🔧 Configuration Files

### `backend/.env`
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/pulsevo
NODE_ENV=development
GEMINI_API_KEY=your_key_here
AI_PROVIDER=gemini
```

### `frontend/vite.config.js`
```javascript
{
  server: { port: 3000 },
  proxy: { '/api': 'http://localhost:5000' }
}
```

## 🚀 NPM Scripts

### Root `package.json`
```bash
npm start           # Start backend only
npm run dev         # Start backend with nodemon
npm run frontend    # Start frontend only
npm run dev:all     # Start both (concurrently)
```

### Frontend `package.json`
```bash
npm run dev         # Start Vite dev server
npm run build       # Build for production
npm run preview     # Preview production build
```

## 📊 Data Models

### Task Schema
```javascript
{
  taskId: String (unique),
  title: String,
  description: String,
  status: ['open', 'in-progress', 'completed', 'blocked'],
  priority: ['low', 'medium', 'high', 'critical'],
  assignee: String,
  projectId: String,
  estimatedHours: Number,
  actualHours: Number,
  createdAt: Date,
  updatedAt: Date,
  completedAt: Date,
  dueDate: Date,
  tags: [String],
  comments: [{ author, text, timestamp }]
}
```

### Project Schema
```javascript
{
  projectId: String (unique),
  name: String,
  description: String,
  status: ['active', 'completed', 'on-hold', 'cancelled'],
  startDate: Date,
  endDate: Date,
  teamMembers: [{ name, role, email }],
  completionRate: Number (0-100),
  totalTasks: Number,
  completedTasks: Number
}
```

## 🎯 Features Checklist

### ✅ Core Functionality
- [x] CSV/Excel file upload
- [x] Data parsing and validation
- [x] MongoDB persistence
- [x] In-memory caching (Node-Cache)
- [x] RESTful API
- [x] CORS support
- [x] Error handling
- [x] React dashboard UI

### ✅ AI Integration
- [x] Gemini AI service
- [x] OpenAI support (alternative)
- [x] Productivity summaries (with 24h metrics & anomaly detection)
- [x] Sprint predictions (4-week historical analysis)
- [x] Sentiment analysis (commit messages & comments)
- [x] Bottleneck detection (workload distribution)
- [x] Daily summaries (with hourly breakdown)
- [x] Hourly performance metrics (24-hour activity patterns)
- [x] Conversational Q&A (natural language queries)

### ✅ UI/UX
- [x] Responsive design
- [x] Gradient purple theme
- [x] Loading states
- [x] Error notifications
- [x] Success feedback
- [x] Task filtering
- [x] Real-time updates

### 🔄 Future Enhancements
- [ ] WebSocket for real-time sync
- [ ] GitHub/Trello API integration
- [ ] Advanced charts (Recharts)
- [ ] User authentication
- [ ] Role-based access
- [ ] PDF/Excel export
- [ ] Email notifications
- [ ] Mobile app

## 📝 Notes

1. **MongoDB**: Optional - works with in-memory storage if MongoDB isn't available
2. **AI API**: Requires Gemini or OpenAI API key for full functionality
3. **Port Configuration**: Backend (5000), Frontend (3000)
4. **Cache TTL**: 5 minutes for most endpoints, 10-15 minutes for AI responses
5. **File Size Limit**: 10MB for CSV/Excel uploads
6. **Browser Support**: Modern browsers (Chrome, Firefox, Edge, Safari)

---

**Total Lines of Code**: ~2,500+ lines
**Development Time**: Complete MVP in one session
**Tech Stack**: MERN (MongoDB, Express, React, Node.js) + AI

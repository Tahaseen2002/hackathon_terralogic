# 🚀 PULSEVO - Team Productivity Dashboard MVP

## 📋 Project Overview
PULSEVO is an AI-powered Team Productivity Dashboard that helps track, analyze, and optimize team performance through intelligent insights and real-time data visualization.

## ✨ Key Features

### 1. **Data Ingestion & Persistence**
- ✅ Manual CSV/Excel file upload
- ✅ Automatic data parsing and validation
- ✅ MongoDB database storage
- ✅ Real-time data synchronization with in-memory caching

### 2. **Backend & Database**
- ✅ Node.js + Express.js REST API
- ✅ MongoDB with Mongoose ODM
- ✅ Node-Cache for real-time performance
- ✅ File upload with Multer
- ✅ CORS-enabled API

### 3. **AI-Powered Analytics**
- ✅ **Productivity Summaries**: AI analyzes team performance
- ✅ **Sprint Predictions**: Forecast completion rates
- ✅ **Sentiment Analysis**: Team morale tracking
- ✅ **Bottleneck Detection**: Identify workload issues
- ✅ **Daily Summaries**: Automated performance reports
- ✅ **Conversational AI**: Natural language queries

### 4. **Frontend Dashboard**
- ✅ React + Vite for fast development
- ✅ Real-time task statistics
- ✅ Interactive charts and metrics
- ✅ File upload interface
- ✅ AI insights visualization
- ✅ Chat interface for queries

## 🛠️ Technology Stack

**Backend:**
- Node.js / Express.js
- MongoDB (Mongoose)
- Multer (file uploads)
- CSV-Parser & XLSX
- Node-Cache (in-memory)
- Google Generative AI (Gemini) / OpenAI

**Frontend:**
- React 19
- Vite
- Axios
- CSS3

## 📦 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB installed and running OR MongoDB Atlas account
- Gemini API Key (get from https://makersuite.google.com/app/apikey)

### Step 1: Install Dependencies
```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### Step 2: Configure Environment Variables
Edit `backend/.env` file with your API keys:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/pulsevo
NODE_ENV=development

# AI Configuration
GEMINI_API_KEY=your_gemini_api_key_here
AI_PROVIDER=gemini
```

### Step 3: Start MongoDB
```bash
# If using local MongoDB, start the service
# Windows: net start MongoDB
# Mac: brew services start mongodb-community
# Linux: sudo systemctl start mongod
```

### Step 4: Start the Application

**Option A: Run both servers simultaneously**
```bash
npm run dev:all
```

**Option B: Run separately**
```bash
# Terminal 1 - Backend
npm start

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### Step 5: Access the Dashboard
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api

## 📊 Testing the Application

### 1. Upload Sample Data
- Open http://localhost:3000
- Click on the upload area
- Select `sample-data.csv` from the project root
- Click "Upload and Import"

### 2. View Dashboard Metrics
- Total tasks, completion rates
- Project statistics
- Team member performance

### 3. Try AI Features
Click on AI buttons to get:
- **Productivity Summary**: Overall team performance
- **Sprint Prediction**: Future workload forecast
- **Sentiment Analysis**: Team morale insights
- **Bottleneck Detection**: Workload issues
- **Daily Summary**: Today's performance

### 4. Chat with AI
Ask questions like:
- "Who has closed the most tasks this week?"
- "What's our completion rate?"
- "Show me blocked tasks"

## 🔌 API Endpoints

### Tasks
- `GET /api/tasks` - Get all tasks (with filters)
- `GET /api/tasks/stats` - Get task statistics
- `GET /api/tasks/:id` - Get single task
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Projects
- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get single project
- `POST /api/projects` - Create project
- `PUT /api/projects/:id` - Update project

### Upload
- `POST /api/upload` - Upload CSV/Excel file

### AI Analytics
- `POST /api/ai/summarize` - Get productivity summary
- `POST /api/ai/query` - Ask natural language question
- `POST /api/ai/predict` - Get sprint predictions
- `POST /api/ai/sentiment` - Analyze team sentiment
- `POST /api/ai/bottlenecks` - Identify bottlenecks
- `POST /api/ai/daily-summary` - Get daily summary

## 📁 CSV File Format

Your CSV file should have these columns:
```
taskId, title, description, status, priority, assignee, projectId, projectName,
estimatedHours, actualHours, createdAt, completedAt, dueDate, tags, comments
```

**Status values**: open, in-progress, completed, blocked
**Priority values**: low, medium, high, critical

## 🎯 Architecture Highlights

### Real-time Caching
- Node-Cache stores frequently accessed data
- Auto-refresh every 5 minutes
- Manual cache invalidation on data changes

### AI Integration
- Modular AI service (supports Gemini or OpenAI)
- Contextual prompts for accurate insights
- Cached AI responses for performance

### Data Flow
1. User uploads CSV/Excel file
2. Backend parses and validates data
3. Data stored in MongoDB
4. Cache updated for fast access
5. Frontend fetches and displays data
6. AI analyzes data on demand

## 🔒 Security Features
- CORS protection
- File type validation
- File size limits (10MB)
- Input sanitization
- Error handling middleware

## 🚀 Future Enhancements
- WebSocket for real-time updates
- GitHub/Trello API integration
- Advanced charts (Recharts)
- User authentication
- Role-based access control
- Export to PDF/Excel
- Mobile app

## 🐛 Troubleshooting

**MongoDB connection failed?**
- Ensure MongoDB is running
- Check connection string in `.env`
- Try using MongoDB Atlas (cloud)

**AI features not working?**
- Verify API key in `backend/.env`
- Check API quota/billing
- Review console for error messages

**File upload fails?**
- Check file format (CSV/Excel only)
- Verify file size < 10MB
- Ensure correct column headers

## 📞 Support
For issues or questions, check the application logs:
- Backend: Console output
- Frontend: Browser DevTools Console

## 🎉 Credits
Built for the Team Productivity Hackathon
- **Backend**: Node.js, Express, MongoDB
- **Frontend**: React, Vite
- **AI**: Google Gemini / OpenAI
- **Developer**: AI-Assisted Development

---

**Enjoy building awesome productivity insights with PULSEVO! 🚀**

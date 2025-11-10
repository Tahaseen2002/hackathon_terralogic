# 🎯 PULSEVO Quick Start Guide

## ✅ What You Have Now

Your **PULSEVO Team Productivity Dashboard MVP** is complete with:

### 🎨 Frontend (React + Vite)
- ✅ Modern, responsive UI with gradient design
- ✅ File upload interface (CSV/Excel)
- ✅ Real-time dashboard statistics
- ✅ AI insights panel with 5 analysis modes
- ✅ Conversational AI chatbot
- ✅ Task list with filtering
- ✅ Auto-refresh functionality

### 🔧 Backend (Node.js + Express)
- ✅ RESTful API with 20+ endpoints
- ✅ MongoDB integration with Mongoose
- ✅ CSV/Excel data ingestion
- ✅ In-memory caching (Node-Cache)
- ✅ File upload handling (Multer)
- ✅ CORS enabled for cross-origin requests

### 🤖 AI Integration
- ✅ Google Gemini API / OpenAI support
- ✅ **Productivity Summary** - Team performance analysis
- ✅ **Sprint Prediction** - Forecast completion rates
- ✅ **Sentiment Analysis** - Team morale tracking
- ✅ **Bottleneck Detection** - Identify overloaded members
- ✅ **Daily Summary** - Automated daily reports
- ✅ **Conversational AI** - Natural language queries

### 💾 Database & Caching
- ✅ MongoDB schemas for Tasks and Projects
- ✅ Auto-updating statistics
- ✅ Cache invalidation on data changes
- ✅ Simulated real-time sync

---

## 🚀 How to Run

### Method 1: Quick Start (Windows)
```bash
# Double-click the start.bat file
start.bat
```

### Method 2: Manual Start
```bash
# Terminal 1 - Backend
npm start

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### Method 3: Run Both Together
```bash
npm run dev:all
```

---

## 🧪 Testing the Application

### Step 1: Open the Dashboard
- Click the preview button to open http://localhost:3000
- You should see the PULSEVO dashboard with purple gradient

### Step 2: Upload Sample Data
1. Click on the **file upload area**
2. Select `sample-data.csv` from the project root
3. Click **"Upload and Import"**
4. Wait for success message ✅

### Step 3: View Dashboard Metrics
After upload, you'll see:
- **Total Tasks**: 25
- **Completed Tasks**: 6 (24% completion rate)
- **In Progress**: 7
- **Blocked**: 1
- **Projects**: 2
- **Team Members**: 3 (Alice, Bob, Charlie)

### Step 4: Try AI Features
Click on each AI button:

**📊 Productivity Summary**
- Get overall team performance analysis
- See who's overloaded or underperforming
- Receive actionable recommendations

**🔮 Sprint Prediction**
- View weekly velocity trends
- Get projected completion percentage
- Risk assessment for upcoming sprint

**😊 Sentiment Analysis**
- Analyze team morale from comments
- See positive/negative/neutral percentages
- One-line summary of team health

**🚧 Identify Bottlenecks**
- Find overloaded team members
- See blocked tasks
- Get redistribution suggestions

**📅 Daily Summary**
- Today's task creation/completion
- Top performers
- Motivational insights

### Step 5: Chat with AI
In the chatbot section, try:
- "Who has closed the most tasks this week?"
- "What's our completion rate?"
- "Show me all blocked tasks"
- "How is Alice performing?"

---

## 🎨 UI Features Breakdown

### Header
- PULSEVO branding
- Refresh button to reload all data

### File Upload Section
- Drag-and-drop style interface
- Accepts CSV and Excel files
- Real-time upload progress

### Dashboard Stats Cards (6 cards)
1. Total Tasks - with active count
2. Completed Tasks - with completion %
3. In Progress - with open count
4. Blocked Tasks - highlighted in red
5. Projects - total count
6. Team Members - contributing count

### AI Insights Panel
- 5 AI analysis buttons
- Loading states
- Formatted AI responses
- Real-time insights

### Task List
- Filter by status (All, Open, In Progress, Completed)
- Color-coded status badges
- Shows first 20 tasks
- Task metadata (assignee, priority, project)

### Chat Interface
- Natural language input
- Conversation history
- User/AI message distinction
- Real-time responses

---

## 📊 Sample Data Overview

The `sample-data.csv` includes:
- **25 tasks** across 2 projects
- **3 team members**: Alice Johnson, Bob Smith, Charlie Davis
- **Mixed statuses**: Open, In Progress, Completed, Blocked
- **Various priorities**: Low, Medium, High, Critical
- **Comments** and metadata for AI analysis

---

## 🔑 AI Configuration

### Get Your Gemini API Key
1. Visit https://makersuite.google.com/app/apikey
2. Sign in with Google account
3. Click "Create API Key"
4. Copy the key

### Configure Backend
Edit `backend/.env`:
```env
GEMINI_API_KEY=your_actual_api_key_here
AI_PROVIDER=gemini
```

### Alternative: Use OpenAI
```env
OPENAI_API_KEY=your_openai_key_here
AI_PROVIDER=openai
```

---

## 🎯 Key API Endpoints

### Data Management
- `POST /api/upload` - Upload CSV/Excel
- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/stats` - Get statistics
- `GET /api/projects` - Get all projects

### AI Analytics
- `POST /api/ai/summarize` - Productivity summary
- `POST /api/ai/query` - Ask questions
- `POST /api/ai/predict` - Sprint forecast
- `POST /api/ai/sentiment` - Sentiment analysis
- `POST /api/ai/bottlenecks` - Find bottlenecks
- `POST /api/ai/daily-summary` - Daily report

---

## 🎨 Customization Ideas

### Add Your Own Data
Create a CSV with these columns:
```
taskId, title, description, status, priority, assignee, 
projectId, projectName, estimatedHours, actualHours, 
createdAt, completedAt, dueDate, tags, comments
```

### Modify AI Prompts
Edit `backend/services/aiService.js` to customize:
- Prompt templates
- Analysis depth
- Response format
- Tone and style

### Customize UI Colors
Edit `frontend/src/App.css`:
```css
/* Change gradient */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Change primary color */
.upload-btn { background: #667eea; }
```

---

## 🔧 Troubleshooting

### ❌ Backend won't start
**Issue**: MongoDB connection error
**Solution**: 
- Start MongoDB service
- Or use MongoDB Atlas (cloud)
- Update `MONGODB_URI` in `.env`

### ❌ AI features return errors
**Issue**: API key not configured
**Solution**:
- Add your Gemini API key to `backend/.env`
- Restart backend server
- Check API quota limits

### ❌ File upload fails
**Issue**: Invalid file format
**Solution**:
- Use CSV or Excel (.xlsx, .xls) only
- Check column headers match format
- File size must be < 10MB

### ❌ Frontend shows "Failed to fetch"
**Issue**: Backend not running or wrong port
**Solution**:
- Check backend is running on port 5000
- Verify CORS is enabled
- Check browser console for details

---

## 📈 What You Can Do Next

### Immediate Testing
1. ✅ Upload sample data
2. ✅ View dashboard metrics
3. ✅ Try all 5 AI features
4. ✅ Chat with AI bot
5. ✅ Filter tasks by status

### Data Exploration
- Upload your own project data
- Compare team performance
- Track sprint progress
- Identify workflow bottlenecks

### AI Insights
- Get daily summaries
- Predict sprint outcomes
- Analyze team sentiment
- Optimize workload distribution

---

## 🌟 Success Criteria Met

✅ **Data Ingestion**: Manual CSV/Excel import working
✅ **Backend Setup**: Node.js + Express + MongoDB configured
✅ **Database**: Task and Project schemas created
✅ **Data Handling**: Parse and store data successfully
✅ **Real-time Sync**: Node-Cache simulating live updates
✅ **AI Integration**: 6 AI-powered analysis modes
✅ **Frontend UI**: React dashboard with components
✅ **File Upload**: Working upload interface
✅ **API Integration**: Frontend connected to backend

---

## 🎉 You're All Set!

Your PULSEVO MVP is **production-ready** for demo purposes!

**Next Steps:**
1. Configure your AI API key
2. Upload the sample data
3. Explore all features
4. Customize for your needs

**Need Help?**
- Check `SETUP_GUIDE.md` for detailed instructions
- Review browser console for errors
- Check backend logs for API issues

---

**Built with ❤️ using React, Node.js, MongoDB, and Google Gemini AI**

Happy analyzing! 🚀

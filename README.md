# 🎯 HireWise - AI-Powered Interview Preparation Platform

A comprehensive web application that helps job seekers prepare for interviews with AI-powered mock interviews, ATS resume checking, and job description matching. Built with FastAPI, MongoDB, and Google Gemini AI.

## ✨ Features

- 🎤 **AI Mock Interviews** - Practice with AI-generated interview questions tailored to your role
- 📄 **ATS Resume Checker** - Analyze resume compatibility with Applicant Tracking Systems (60% formula + 40% AI)
- 🎯 **JD Matcher** - Match your resume against job descriptions with intelligent AI analysis (50% formula + 50% AI)
- 📊 **Performance Analytics** - Track interview performance and improvement over time
- 📅 **Activity Calendar** - Schedule and track all your preparation activities
- 💬 **Feedback System** - Get detailed AI-powered feedback and actionable suggestions
- 📝 **DOCX Report Generation** - Download professional reports for ATS and JD analysis

## 🛠️ Technology Stack

### Frontend
- **Pure HTML/CSS/JavaScript** - No frameworks, lightweight and fast
- **Tailwind CSS** - Utility-first CSS framework for styling
- **Particles.js** - Interactive particle animations
- **Local Storage** - Client-side data persistence

### Backend
- **FastAPI** - Modern, high-performance Python web framework
- **MongoDB with Motor** - Async NoSQL database with Python driver
- **Google Gemini AI** - Advanced AI for resume analysis and matching
- **PyPDF2 & pdfplumber** - PDF text extraction and processing
- **python-docx** - Professional DOCX report generation
- **scikit-learn** - Machine learning for text similarity analysis
- **spaCy** - Natural Language Processing for keyword extraction

## 📁 Project Structure

```
HireWise/
├── hirewise-frontend/           # Frontend application
│   ├── index.html              # Landing page with features
│   ├── auth.html               # Login/Signup authentication
│   ├── dashboard.html          # Main user dashboard
│   ├── 404.html                # Custom error page
│   ├── css/                    # Stylesheets
│   │   ├── styles.css          # Main styles and animations
│   │   ├── theme.css           # Color theme variables
│   │   ├── dashboard.css       # Dashboard-specific styles
│   │   └── auth.css            # Authentication page styles
│   ├── js/                     # JavaScript modules
│   │   ├── main.js             # Main application logic
│   │   ├── api.js              # API communication layer
│   │   ├── auth.js             # Authentication logic
│   │   ├── dashboard.js        # Dashboard functionality
│   │   ├── ats-checker.js      # ATS checker modal & logic
│   │   ├── jdmatcher.js        # JD matcher modal & logic
│   │   ├── interview.js        # Interview system
│   │   ├── calendar.js         # Activity calendar
│   │   ├── storage.js          # LocalStorage management
│   │   ├── particles.js        # Particle animations
│   │   └── auto-logout.js      # Auto logout functionality
│   ├── components/             # Reusable HTML components
│   │   ├── navbar.html         # Navigation bar
│   │   ├── modal-ats.html      # ATS modal template
│   │   ├── modal-jdmatcher.html # JD matcher modal
│   │   └── modal-interview.html # Interview modal
│   ├── data/                   # Configuration & mock data
│   │   ├── config.js           # App configuration
│   │   └── mock-questions.json # Interview questions
│   └── assets/                 # Static assets
│       └── images/
│           ├── logo.svg        # Application logo
│           └── ai-avatar.png   # AI interviewer avatar
│
└── hirewise-backend/           # Backend API
    ├── app/
    │   ├── main.py             # FastAPI application entry
    │   ├── config.py           # Environment configuration
    │   ├── database.py         # MongoDB connection setup
    │   ├── api/                # API route handlers
    │   │   ├── __init__.py
    │   │   ├── auth.py         # Authentication endpoints
    │   │   ├── ats.py          # ATS checker endpoints
    │   │   ├── jd_matcher.py   # JD matcher endpoints
    │   │   ├── calendar.py     # Calendar endpoints
    │   │   └── feedback.py     # Feedback endpoints
    │   ├── models/             # Database models
    │   │   ├── __init__.py
    │   │   └── models.py       # Pydantic models
    │   ├── services/           # Business logic layer
    │   │   ├── __init__.py
    │   │   ├── ats_service.py  # ATS scoring algorithm
    │   │   ├── jd_matcher_service.py # JD matching algorithm
    │   │   └── report_service.py # Report generation
    │   └── utils/              # Utility functions
    │       ├── __init__.py
    │       ├── auth.py         # Auth utilities
    │       └── pdf_utils.py    # PDF processing
    ├── uploads/                # Uploaded PDF storage
    │   └── .gitkeep
    ├── reports/                # Generated DOCX reports
    │   └── .gitkeep
    ├── requirements.txt        # Python dependencies
    ├── start_server.bat        # Windows server launcher
    ├── start_server.ps1        # PowerShell server launcher
    ├── .env.example            # Environment template
    └── .gitignore              # Git ignore rules
```

## 🚀 Getting Started

### Prerequisites
- **Python 3.11+** - [Download Python](https://www.python.org/downloads/)
- **MongoDB** - Choose one:
  - **Local**: [MongoDB Community Server](https://www.mongodb.com/try/download/community)
  - **Cloud**: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (Free tier available)
- **Google Gemini API Key** - [Get one free](https://makersuite.google.com/app/apikey)

### 📦 Backend Setup

1. **Install MongoDB:**
   - **Local Option**: Download and install MongoDB Community Server
   - **Cloud Option**: Create a free MongoDB Atlas cluster

2. **Navigate to backend directory:**
   ```bash
   cd hirewise-backend
   ```

3. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Download spaCy language model:**
   ```bash
   python -m spacy download en_core_web_sm
   ```

5. **Configure environment variables:**
   
   Copy `.env.example` to `.env`:
   ```bash
   copy .env.example .env     # Windows
   cp .env.example .env       # Linux/Mac
   ```
   
   Edit `.env` file with your credentials:
   ```env
   # MongoDB Configuration
   # Option 1: Local MongoDB
   MONGODB_URL=mongodb://localhost:27017
   MONGODB_DB_NAME=hirewise
   
   # Option 2: MongoDB Atlas (Cloud)
   # MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
   # MONGODB_DB_NAME=hirewise
   
   # Google Gemini API (REQUIRED)
   GEMINI_API_KEY=your-actual-gemini-api-key-here
   
   # Frontend URL for CORS
   FRONTEND_URL=http://localhost:8000
   
   # File Upload Settings
   MAX_UPLOAD_SIZE=5242880
   UPLOAD_DIR=./uploads
   REPORTS_DIR=./reports
   ```

6. **Start the backend server:**
   ```bash
   # Windows (Easy way)
   start_server.bat
   
   # OR manually with uvicorn
   uvicorn app.main:app --reload --port 8001
   
   # OR with Python
   python -c "import sys; sys.path.insert(0, '.'); from app.main import app; import uvicorn; uvicorn.run(app, host='0.0.0.0', port=8001, reload=True)"
   ```
   
   Backend will be available at: `http://localhost:8001`

### 🌐 Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd hirewise-frontend
   ```

2. **Start a local server:**
   ```bash
   # Python 3
   python -m http.server 8000
   
   # OR Python 2
   python -m SimpleHTTPServer 8000
   
   # OR use any other local server (Live Server, etc.)
   ```

3. **Open in browser:**
   ```
   http://localhost:8000
   ```

### ✅ Verify Installation

1. **Check backend is running:**
   - Open: `http://localhost:8001/docs`
   - You should see the FastAPI Swagger documentation

2. **Check frontend is running:**
   - Open: `http://localhost:8000`
   - You should see the HireWise landing page

3. **Test the features:**
   - Sign up for a new account
   - Upload a resume and check ATS score
   - Try the JD matcher with a job description

## 📚 API Documentation

Once the backend is running, explore the interactive API documentation:
- **Swagger UI**: `http://localhost:8001/docs` (Interactive testing)
- **ReDoc**: `http://localhost:8001/redoc` (Detailed documentation)

### Main API Endpoints

#### Authentication (`/api/auth`)
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - User login
- `GET /api/auth/profile/{user_id}` - Get user profile
- `PUT /api/auth/profile/{user_id}` - Update profile

#### ATS Checker (`/api/ats`)
- `POST /api/ats/analyze` - Analyze resume for ATS compatibility
- `POST /api/ats/analyze-stored` - Analyze previously uploaded resume
- `GET /api/ats/download/{ats_id}` - Download ATS report (DOCX)
- `GET /api/ats/resumes/{user_id}` - Get user's resumes
- `DELETE /api/ats/resumes/{resume_id}` - Delete resume

#### JD Matcher (`/api/jd-matcher`)
- `POST /api/jd-matcher/analyze` - Match resume with job description
- `POST /api/jd-matcher/analyze-stored` - Match stored resume with JD
- `GET /api/jd-matcher/download/{match_id}` - Download match report

#### Calendar (`/api/calendar`)
- `GET /api/calendar/activities` - Get user activities
- `POST /api/calendar/activities` - Create activity
- `PUT /api/calendar/activities/{id}` - Update activity
- `DELETE /api/calendar/activities/{id}` - Delete activity

## 🔑 Key Features Explained

### 📄 ATS Resume Checker
- **Hybrid Analysis Approach:**
  - 60% Formula-based scoring (formatting, keywords, structure, readability)
  - 40% Google Gemini AI analysis
- **Comprehensive Metrics:**
  - Formatting Score (0-100%)
  - Keywords Score (0-100%)
  - Readability Score (0-100%)
  - Structure Score (0-100%)
- **Actionable Output:**
  - Overall ATS compatibility score
  - Detailed improvement suggestions
  - Professional DOCX report generation
  - Visual progress bars and metrics

### 🎯 JD Matcher
- **Intelligent Matching Algorithm:**
  - 50% Formula-based (skills, experience, education, keywords)
  - 50% Google Gemini AI contextual analysis
- **Detailed Comparison:**
  - Technical skills matching
  - Experience level assessment
  - Education requirements check
  - Keyword density analysis
- **Gap Analysis:**
  - Identifies missing skills
  - Provides improvement recommendations
  - Highlights strengths
  - Generates comparison reports

### 🎤 Mock AI Interviews
- **Role-based Questions:**
  - Software Engineer
  - Data Scientist
  - Product Manager
  - Business Analyst
  - And more...
- **Features:**
  - Realistic interview simulation
  - Timed responses
  - Video/audio recording (optional)
  - Performance scoring
  - Detailed feedback
  - Progress tracking

### 📅 Activity Calendar
- **Track Your Progress:**
  - Schedule interview practice sessions
  - Log ATS checks and JD matches
  - View activity history
  - Monitor preparation journey
- **Visual Dashboard:**
  - Calendar view with activity markers
  - Daily activity details
  - Statistics and insights

## 🚨 Troubleshooting

### Backend Issues

**Problem: "ModuleNotFoundError" when starting backend**
```bash
# Solution: Install dependencies
pip install -r requirements.txt
python -m spacy download en_core_web_sm
```

**Problem: "Connection refused" or MongoDB not connecting**
```bash
# Solution 1: Start local MongoDB service
# Windows: services.msc → MongoDB Server → Start
# Linux: sudo systemctl start mongod
# Mac: brew services start mongodb-community

# Solution 2: Use MongoDB Atlas (cloud)
# Update MONGODB_URL in .env file with Atlas connection string
```

**Problem: "Invalid API key" for Gemini**
```bash
# Solution: Get a valid API key
# 1. Visit https://makersuite.google.com/app/apikey
# 2. Create/copy your API key
# 3. Update GEMINI_API_KEY in .env file
```

**Problem: "Port 8001 already in use"**
```bash
# Solution: Change port or kill existing process
# Option 1: Change port in start command
uvicorn app.main:app --reload --port 8002

# Option 2: Kill process on port 8001
# Windows: netstat -ano | findstr :8001
#          taskkill /PID <PID> /F
# Linux/Mac: lsof -ti:8001 | xargs kill -9
```

### Frontend Issues

**Problem: "Failed to fetch" or CORS errors**
```bash
# Solution: Check backend is running and CORS is configured
# 1. Backend should be running on http://localhost:8001
# 2. Check FRONTEND_URL in .env matches your frontend URL
# 3. Clear browser cache and reload
```

**Problem: Modal disappears after clicking button**
```bash
# Solution: This has been fixed in the latest version
# Make sure you have the updated ats-checker.js file
```

**Problem: Unable to upload PDF**
```bash
# Solution: Check file requirements
# - File must be PDF format
# - File size must be under 5MB
# - PDF should not be password-protected
# - PDF should contain extractable text (not scanned images)
```

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit your changes** (`git commit -m 'Add some AmazingFeature'`)
4. **Push to the branch** (`git push origin feature/AmazingFeature`)
5. **Open a Pull Request**

### Development Guidelines
- Follow PEP 8 style guide for Python code
- Use meaningful variable and function names
- Add comments for complex logic
- Test your changes before submitting PR
- Update documentation if needed

## 📝 Environment Variables Reference

```env
# MongoDB Database
MONGODB_URL=mongodb://localhost:27017                    # MongoDB connection string
MONGODB_DB_NAME=hirewise                                 # Database name

# Google Gemini AI
GEMINI_API_KEY=your-api-key-here                        # Required for AI features

# CORS Configuration
FRONTEND_URL=http://localhost:8000                       # Frontend URL for CORS

# File Upload Limits
MAX_UPLOAD_SIZE=5242880                                  # Max file size (5MB in bytes)
UPLOAD_DIR=./uploads                                     # Upload directory path
REPORTS_DIR=./reports                                    # Reports directory path
```

## 📊 Database Collections

The application uses the following MongoDB collections:

- **users** - User accounts and profiles
- **resumes** - Uploaded resume files and metadata
- **ats_results** - ATS analysis results
- **jd_matches** - Job description match results
- **interviews** - Mock interview records
- **activities** - User activity calendar events
- **feedbacks** - User feedback submissions

## 🔒 Security Notes

- Never commit `.env` file to version control
- Keep your Gemini API key confidential
- Use strong passwords for MongoDB (especially for production)
- Update dependencies regularly for security patches
- Use HTTPS in production environments

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Developer

**Pushkar Gupta**
- 📧 Email: pushkargupta993@gmail.com
- 📱 Phone: +91 8960179834
- 📍 Location: Delhi, India
- 💼 LinkedIn: [Connect with me](https://www.linkedin.com/in/pushkargupta75)
- 🐙 GitHub: [pushkargupta75](https://github.com/pushkargupta75)

## 🙏 Acknowledgments

- **Google Gemini AI** - For powerful AI analysis capabilities
- **FastAPI** - For the excellent async web framework
- **MongoDB** - For flexible NoSQL database
- **Tailwind CSS** - For beautiful, responsive styling
- **spaCy** - For NLP and keyword extraction
- **All Open Source Contributors** - For making this possible

## 📧 Support

If you encounter any issues or have questions:
1. Check the [Troubleshooting](#-troubleshooting) section
2. Review [API Documentation](#-api-documentation)
3. Open an issue on GitHub
4. Contact: pushkargupta993@gmail.com

---

<div align="center">

**⭐ Star this repository if you find it helpful!**

**Happy Job Hunting**

</div>

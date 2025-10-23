# 🎯 HireWise - AI-Powered Interview Practice Platform

A comprehensive web application that helps job seekers prepare for interviews with AI-powered mock interviews, ATS resume checking, and job description matching.

## ✨ Features

- 🎤 **Mock AI Interviews** - Practice with realistic interview questions
- 📄 **ATS Resume Checker** - Analyze resume compatibility with Applicant Tracking Systems
- 🎯 **JD Matcher** - Match your resume against job descriptions with AI analysis
- 📊 **Performance Analytics** - Track your progress and improvement
- 💬 **Feedback System** - Get detailed feedback and suggestions
- 📝 **Report Generation** - Download detailed DOCX reports

## 🛠️ Technology Stack

### Frontend
- Pure HTML/CSS/JavaScript
- Tailwind CSS for styling
- Particle.js for animations
- Local Storage for data persistence

### Backend
- FastAPI (Python web framework)
- SQLAlchemy ORM with SQLite
- Google Gemini AI for intelligent analysis
- PyPDF2 & pdfplumber for PDF processing
- python-docx for report generation
- scikit-learn for text analysis
- spaCy for NLP

## 📁 Project Structure

```
new_hirewise/
├── hirewise-frontend/     # Frontend application
│   ├── index.html         # Landing page
│   ├── auth.html          # Authentication page
│   ├── dashboard.html     # Main dashboard
│   ├── css/               # Stylesheets
│   ├── js/                # JavaScript files
│   ├── components/        # Reusable components
│   └── assets/            # Images, fonts, sounds
│
└── hirewise-backend/      # Backend API
    ├── app/
    │   ├── main.py        # FastAPI application
    │   ├── config.py      # Configuration
    │   ├── database.py    # Database setup
    │   ├── api/           # API endpoints
    │   ├── models/        # Database models
    │   ├── services/      # Business logic
    │   └── utils/         # Utility functions
    ├── uploads/           # Uploaded files
    ├── reports/           # Generated reports
    └── requirements.txt   # Python dependencies
```

## 🚀 Getting Started

### Prerequisites
- Python 3.11+
- Google Gemini API Key ([Get one here](https://makersuite.google.com/app/apikey))

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd hirewise-backend
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   python -m spacy download en_core_web_sm
   ```

3. **Configure environment:**
   Create a `.env` file with:
   ```env
   DATABASE_URL=sqlite:///./hirewise.db
   GEMINI_API_KEY=your-gemini-api-key-here
   FRONTEND_URL=http://localhost:8000
   MAX_UPLOAD_SIZE=5242880
   UPLOAD_DIR=./uploads
   REPORTS_DIR=./reports
   ```

4. **Start the backend server:**
   ```bash
   uvicorn app.main:app --reload --port 8001
   ```

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd hirewise-frontend
   ```

2. **Start a local server:**
   ```bash
   python -m http.server 8000
   ```

3. **Open in browser:**
   ```
   http://localhost:8000
   ```

## 📚 API Documentation

Once the backend is running, access the interactive API docs at:
- Swagger UI: `http://localhost:8001/docs`
- ReDoc: `http://localhost:8001/redoc`

## 🔑 Key Features Explained

### ATS Resume Checker
- Analyzes resume formatting, keywords, structure, and readability
- Uses both formula-based scoring (60%) and AI analysis (40%)
- Provides actionable suggestions for improvement
- Generates detailed DOCX reports

### JD Matcher
- Compares resume against job descriptions
- Analyzes technical skills, experience, education, and keywords
- Uses weighted formula (50%) and AI analysis (50%)
- Identifies skill gaps and provides recommendations

### Mock Interviews
- Realistic interview questions based on role
- Feedback on communication and content
- Performance tracking and analytics
- Post-interview testimonials

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Developer

**Pushkar Gupta**
- Email: pushkargupta993@gmail.com
- Phone: +91 8960179834
- Location: Delhi, India

## 🙏 Acknowledgments

- Google Gemini AI for intelligent analysis
- FastAPI for the excellent web framework
- Tailwind CSS for beautiful styling
- All open-source contributors

---

**Made with ❤️ for job seekers everywhere**

from sqlalchemy import Column, Integer, String, Float, DateTime, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    full_name = Column(String)
    password_hash = Column(String)
    phone = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    last_login = Column(DateTime, nullable=True)
    
    # Relationships
    education = relationship("Education", back_populates="user")
    interviews = relationship("Interview", back_populates="user")
    resumes = relationship("Resume", back_populates="user")
    ats_results = relationship("ATSResult", back_populates="user")
    jd_matches = relationship("JDMatch", back_populates="user")
    testimonials = relationship("Testimonial", back_populates="user")

class Education(Base):
    __tablename__ = "education"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    degree = Column(String)
    institution = Column(String)
    year = Column(String)
    field_of_study = Column(String, nullable=True)
    
    user = relationship("User", back_populates="education")

class Interview(Base):
    __tablename__ = "interviews"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    role = Column(String)
    status = Column(String)  # in-progress, completed
    score = Column(Float, nullable=True)
    questions = Column(JSON)  # Store as JSON
    answers = Column(JSON, nullable=True)
    feedback = Column(JSON, nullable=True)
    started_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
    
    user = relationship("User", back_populates="interviews")

class Resume(Base):
    __tablename__ = "resumes"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    file_name = Column(String)
    file_path = Column(String)
    file_type = Column(String)
    extracted_text = Column(Text, nullable=True)
    ats_score = Column(Float, nullable=True)
    uploaded_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="resumes")

class ATSResult(Base):
    __tablename__ = "ats_results"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    resume_id = Column(Integer, ForeignKey("resumes.id"), nullable=True)
    overall_score = Column(Float)
    formatting_score = Column(Float)
    keywords_score = Column(Float)
    readability_score = Column(Float)
    structure_score = Column(Float)
    suggestions = Column(JSON)
    ai_analysis = Column(JSON, nullable=True)
    report_path = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="ats_results")

class JDMatch(Base):
    __tablename__ = "jd_matches"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    resume_id = Column(Integer, ForeignKey("resumes.id"), nullable=True)
    job_description = Column(Text)
    match_score = Column(Float)
    technical_skills = Column(Float)
    experience_score = Column(Float)
    education_score = Column(Float)
    keywords_score = Column(Float)
    matched_skills = Column(JSON)
    missing_skills = Column(JSON)
    recommendations = Column(JSON)
    ai_analysis = Column(JSON, nullable=True)
    report_path = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="jd_matches")

class Testimonial(Base):
    __tablename__ = "testimonials"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    name = Column(String)
    title = Column(String)
    text = Column(Text)
    rating = Column(Integer)
    interview_id = Column(Integer, nullable=True)
    approved = Column(Integer, default=1)  # Auto-approve for now
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="testimonials")

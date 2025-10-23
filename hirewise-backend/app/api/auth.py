from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import User, Education
from app.utils.auth import get_password_hash, verify_password
from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

# Pydantic models
class SignupRequest(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    phone: Optional[str] = None
    education: Optional[List[dict]] = None

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class AuthResponse(BaseModel):
    user: dict

@router.post("/signup", response_model=AuthResponse)
def signup(request: SignupRequest, db: Session = Depends(get_db)):
    """Register a new user"""
    # Check if user exists
    existing_user = db.query(User).filter(User.email == request.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create new user
    user = User(
        email=request.email,
        full_name=request.full_name,
        phone=request.phone,
        password_hash=get_password_hash(request.password),
        created_at=datetime.utcnow()
    )
    
    db.add(user)
    db.commit()
    db.refresh(user)
    
    # Add education if provided
    if request.education:
        for edu in request.education:
            education = Education(
                user_id=user.id,
                degree=edu.get('degree'),
                institution=edu.get('institution'),
                year=edu.get('year'),
                field_of_study=edu.get('field')
            )
            db.add(education)
        db.commit()
    
    return {
        "user": {
            "userId": user.id,
            "email": user.email,
            "fullName": user.full_name,
            "phone": user.phone
        }
    }

@router.post("/login", response_model=AuthResponse)
def login(request: LoginRequest, db: Session = Depends(get_db)):
    """Login user"""
    user = db.query(User).filter(User.email == request.email).first()
    
    if not user or not verify_password(request.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # Update last login
    user.last_login = datetime.utcnow()
    db.commit()
    
    return {
        "user": {
            "userId": user.id,
            "email": user.email,
            "fullName": user.full_name,
            "phone": user.phone
        }
    }

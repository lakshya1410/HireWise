from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import Testimonial, User
from pydantic import BaseModel
from typing import List
from datetime import datetime

router = APIRouter(prefix="/api/feedback", tags=["Feedback"])

class TestimonialRequest(BaseModel):
    name: str
    title: str
    text: str
    rating: int
    interview_id: int = None
    user_id: int = None

class TestimonialResponse(BaseModel):
    id: int
    name: str
    title: str
    text: str
    rating: int
    date: str

@router.post("/submit")
def submit_feedback(
    request: TestimonialRequest,
    db: Session = Depends(get_db)
):
    """Submit user feedback/testimonial"""
    
    testimonial = Testimonial(
        user_id=request.user_id,
        name=request.name,
        title=request.title,
        text=request.text,
        rating=request.rating,
        interview_id=request.interview_id,
        approved=1,  # Auto-approve
        created_at=datetime.utcnow()
    )
    
    db.add(testimonial)
    db.commit()
    db.refresh(testimonial)
    
    return {
        "success": True,
        "message": "Thank you for your feedback!",
        "testimonialId": testimonial.id
    }

@router.get("/public", response_model=List[TestimonialResponse])
def get_public_testimonials(
    limit: int = 6,
    db: Session = Depends(get_db)
):
    """Get approved testimonials for public display"""
    
    testimonials = db.query(Testimonial)\
        .filter(Testimonial.approved == 1)\
        .order_by(Testimonial.created_at.desc())\
        .limit(limit)\
        .all()
    
    return [
        {
            "id": t.id,
            "name": t.name,
            "title": t.title,
            "text": t.text,
            "rating": t.rating,
            "date": t.created_at.isoformat()
        }
        for t in testimonials
    ]

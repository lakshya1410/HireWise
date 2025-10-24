from fastapi import APIRouter, Depends, HTTPException
from app.database import get_db
from app.models.models import Testimonial
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from bson import ObjectId

router = APIRouter(prefix="/api/feedback", tags=["Feedback"])

class TestimonialRequest(BaseModel):
    name: str
    title: str
    text: str
    rating: int
    interview_id: Optional[str] = None
    user_id: Optional[str] = None

class TestimonialResponse(BaseModel):
    id: str
    name: str
    title: str
    text: str
    rating: int
    date: str

@router.post("/submit")
async def submit_feedback(
    request: TestimonialRequest,
    db = Depends(get_db)
):
    """Submit user feedback/testimonial"""
    
    testimonial_doc = {
        "user_id": request.user_id,
        "name": request.name,
        "title": request.title,
        "text": request.text,
        "rating": request.rating,
        "interview_id": request.interview_id,
        "approved": 1,  # Auto-approve
        "created_at": datetime.utcnow()
    }
    
    result = await db.testimonials.insert_one(testimonial_doc)
    
    return {
        "success": True,
        "message": "Thank you for your feedback!",
        "testimonialId": str(result.inserted_id)
    }

@router.get("/public", response_model=List[TestimonialResponse])
async def get_public_testimonials(
    limit: int = 6,
    db = Depends(get_db)
):
    """Get approved testimonials for public display"""
    
    testimonials_cursor = db.testimonials.find(
        {"approved": 1}
    ).sort("created_at", -1).limit(limit)
    
    testimonials = await testimonials_cursor.to_list(length=limit)
    
    return [
        {
            "id": str(t["_id"]),
            "name": t["name"],
            "title": t["title"],
            "text": t["text"],
            "rating": t["rating"],
            "date": t["created_at"].isoformat()
        }
        for t in testimonials
    ]

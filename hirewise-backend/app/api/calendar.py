from fastapi import APIRouter, Depends, HTTPException, status, Header
from datetime import datetime, timedelta
from typing import List, Optional
from bson import ObjectId

from app.database import get_database
from app.models.models import CalendarActivity

router = APIRouter(prefix="/api/calendar", tags=["calendar"])

# Temporary: Get user from Authorization header (email-based)
async def get_current_user_email(authorization: Optional[str] = Header(None), db = Depends(get_database)):
    """Get current user from authorization header (email)"""
    if not authorization:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    # Extract email from "Bearer email@example.com"
    email = authorization.replace("Bearer ", "").strip()
    user = await db.users.find_one({"email": email})
    
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    
    return user

@router.get("/activities")
async def get_user_activities(
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    current_user: dict = Depends(get_current_user_email),
    db = Depends(get_database)
):
    """Get all calendar activities for the current user"""
    try:
        user_id = str(current_user["_id"])
        
        # Build query
        query = {"user_id": user_id}
        
        # Add date filters if provided
        if start_date or end_date:
            date_filter = {}
            if start_date:
                date_filter["$gte"] = datetime.fromisoformat(start_date.replace('Z', '+00:00'))
            if end_date:
                date_filter["$lte"] = datetime.fromisoformat(end_date.replace('Z', '+00:00'))
            query["date"] = date_filter
        
        activities = await db.calendar_activities.find(query).sort("date", -1).to_list(None)
        
        # Convert ObjectId to string
        for activity in activities:
            activity["_id"] = str(activity["_id"])
            
        return {"success": True, "activities": activities}
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching activities: {str(e)}"
        )

@router.get("/activities/{date}")
async def get_activities_by_date(
    date: str,
    current_user: dict = Depends(get_current_user_email),
    db = Depends(get_database)
):
    """Get all activities for a specific date"""
    try:
        user_id = str(current_user["_id"])
        
        # Parse the date and get start/end of day
        target_date = datetime.fromisoformat(date.replace('Z', '+00:00'))
        start_of_day = target_date.replace(hour=0, minute=0, second=0, microsecond=0)
        end_of_day = start_of_day + timedelta(days=1)
        
        activities = await db.calendar_activities.find({
            "user_id": user_id,
            "date": {
                "$gte": start_of_day,
                "$lt": end_of_day
            }
        }).sort("date", 1).to_list(None)
        
        # Convert ObjectId to string
        for activity in activities:
            activity["_id"] = str(activity["_id"])
            
        return {"success": True, "date": date, "activities": activities}
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching activities for date: {str(e)}"
        )

@router.post("/activities")
async def create_activity(
    activity_data: dict,
    current_user: dict = Depends(get_current_user_email),
    db = Depends(get_database)
):
    """Create a new calendar activity"""
    try:
        user_id = str(current_user["_id"])
        
        # Create activity document
        activity = {
            "user_id": user_id,
            "activity_type": activity_data.get("activity_type", "practice"),
            "title": activity_data.get("title"),
            "description": activity_data.get("description"),
            "date": datetime.fromisoformat(activity_data["date"].replace('Z', '+00:00')),
            "score": activity_data.get("score"),
            "status": activity_data.get("status", "scheduled"),
            "reference_id": activity_data.get("reference_id"),
            "metadata": activity_data.get("metadata", {}),
            "created_at": datetime.utcnow()
        }
        
        result = await db.calendar_activities.insert_one(activity)
        activity["_id"] = str(result.inserted_id)
        
        return {"success": True, "activity": activity}
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating activity: {str(e)}"
        )

@router.put("/activities/{activity_id}")
async def update_activity(
    activity_id: str,
    activity_data: dict,
    current_user: dict = Depends(get_current_user_email),
    db = Depends(get_database)
):
    """Update a calendar activity"""
    try:
        user_id = str(current_user["_id"])
        
        # Check if activity exists and belongs to user
        activity = await db.calendar_activities.find_one({
            "_id": ObjectId(activity_id),
            "user_id": user_id
        })
        
        if not activity:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Activity not found"
            )
        
        # Update fields
        update_data = {}
        if "title" in activity_data:
            update_data["title"] = activity_data["title"]
        if "description" in activity_data:
            update_data["description"] = activity_data["description"]
        if "date" in activity_data:
            update_data["date"] = datetime.fromisoformat(activity_data["date"].replace('Z', '+00:00'))
        if "score" in activity_data:
            update_data["score"] = activity_data["score"]
        if "status" in activity_data:
            update_data["status"] = activity_data["status"]
        if "metadata" in activity_data:
            update_data["metadata"] = activity_data["metadata"]
        
        await db.calendar_activities.update_one(
            {"_id": ObjectId(activity_id)},
            {"$set": update_data}
        )
        
        return {"success": True, "message": "Activity updated successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error updating activity: {str(e)}"
        )

@router.delete("/activities/{activity_id}")
async def delete_activity(
    activity_id: str,
    current_user: dict = Depends(get_current_user_email),
    db = Depends(get_database)
):
    """Delete a calendar activity"""
    try:
        user_id = str(current_user["_id"])
        
        result = await db.calendar_activities.delete_one({
            "_id": ObjectId(activity_id),
            "user_id": user_id
        })
        
        if result.deleted_count == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Activity not found"
            )
        
        return {"success": True, "message": "Activity deleted successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error deleting activity: {str(e)}"
        )

@router.get("/stats")
async def get_calendar_stats(
    current_user: dict = Depends(get_current_user_email),
    db = Depends(get_database)
):
    """Get calendar statistics for the user"""
    try:
        user_id = str(current_user["_id"])
        
        # Get total activities
        total = await db.calendar_activities.count_documents({"user_id": user_id})
        
        # Get completed activities
        completed = await db.calendar_activities.count_documents({
            "user_id": user_id,
            "status": "completed"
        })
        
        # Get scheduled activities
        scheduled = await db.calendar_activities.count_documents({
            "user_id": user_id,
            "status": "scheduled"
        })
        
        # Get activities by type
        pipeline = [
            {"$match": {"user_id": user_id}},
            {"$group": {
                "_id": "$activity_type",
                "count": {"$sum": 1}
            }}
        ]
        by_type = await db.calendar_activities.aggregate(pipeline).to_list(None)
        
        return {
            "success": True,
            "stats": {
                "total": total,
                "completed": completed,
                "scheduled": scheduled,
                "by_type": {item["_id"]: item["count"] for item in by_type}
            }
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching stats: {str(e)}"
        )

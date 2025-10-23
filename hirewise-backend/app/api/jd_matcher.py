from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import User, Resume, JDMatch
from app.services.jd_matcher_service import JDMatcher
from app.services.report_service import ReportGenerator
from app.utils.pdf_utils import extract_text_from_pdf
from pydantic import BaseModel
from typing import Optional
import os
from datetime import datetime
from app.config import settings

router = APIRouter(prefix="/api/jd-matcher", tags=["JD Matcher"])

class JDMatchResponse(BaseModel):
    success: bool
    data: dict
    message: str

@router.post("/analyze", response_model=JDMatchResponse)
async def analyze_jd_match(
    resume_file: UploadFile = File(...),
    job_description: str = Form(...),
    job_title: Optional[str] = Form("Position"),
    user_id: Optional[int] = Form(None),
    db: Session = Depends(get_db)
):
    """Analyze resume match with job description"""
    
    # Validate file type
    if not resume_file.filename.endswith(('.pdf', '.PDF')):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")
    
    # Save uploaded file temporarily
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"resume_{timestamp}_{resume_file.filename}"
    filepath = os.path.join(settings.upload_dir, filename)
    
    import shutil
    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(resume_file.file, buffer)
    
    try:
        # Extract text from PDF
        resume_text = extract_text_from_pdf(filepath)
        
        if not resume_text or len(resume_text) < 50:
            raise HTTPException(status_code=400, detail="Could not extract text from PDF")
        
        if not job_description or len(job_description) < 50:
            raise HTTPException(status_code=400, detail="Job description is too short")
        
        # Calculate match score
        jd_matcher = JDMatcher()
        result = jd_matcher.calculate_match_score(resume_text, job_description)
        
        # Save to database if user_id provided
        if user_id:
            # Save resume record if not exists
            resume_record = Resume(
                user_id=user_id,
                file_name=resume_file.filename,
                file_path=filepath,
                file_type="application/pdf",
                extracted_text=resume_text[:5000],
                uploaded_at=datetime.utcnow()
            )
            db.add(resume_record)
            db.flush()
            
            # Save JD match result
            jd_match = JDMatch(
                user_id=user_id,
                resume_id=resume_record.id,
                job_description=job_description,
                match_score=result['match_score'],
                technical_skills=result['technical_skills'],
                experience_score=result['experience_score'],
                education_score=result['education_score'],
                keywords_score=result['keywords_score'],
                matched_skills=result['matched_skills'],
                missing_skills=result['missing_skills'],
                recommendations=result['recommendations'],
                ai_analysis=result.get('ai_analysis'),
                created_at=datetime.utcnow()
            )
            db.add(jd_match)
            db.commit()
            db.refresh(jd_match)
            
            # Generate report
            report_gen = ReportGenerator()
            user = db.query(User).filter(User.id == user_id).first()
            user_name = user.full_name if user else "User"
            report_path = report_gen.generate_jd_match_report(result, job_title, user_name)
            
            # Update with report path
            jd_match.report_path = report_path
            db.commit()
            
            result['matchId'] = jd_match.id
            result['reportPath'] = report_path
        
        # Format response
        response_data = {
            'matchScore': result['match_score'],
            'analysis': {
                'technicalSkills': result['technical_skills'],
                'experience': result['experience_score'],
                'education': result['education_score'],
                'keywords': result['keywords_score']
            },
            'matchedSkills': result['matched_skills'],
            'missingSkills': result['missing_skills'],
            'recommendations': result['recommendations']
        }
        
        if user_id:
            response_data['matchId'] = result.get('matchId')
            response_data['reportPath'] = result.get('reportPath')
        
        return {
            "success": True,
            "data": response_data,
            "message": "JD match analysis complete"
        }
        
    except Exception as e:
        print(f"Error analyzing JD match: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/download/{match_id}")
async def download_jd_report(match_id: int, db: Session = Depends(get_db)):
    """Download JD match report"""
    jd_match = db.query(JDMatch).filter(JDMatch.id == match_id).first()
    
    if not jd_match or not jd_match.report_path:
        raise HTTPException(status_code=404, detail="Report not found")
    
    from fastapi.responses import FileResponse
    return FileResponse(
        jd_match.report_path,
        media_type='application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        filename=os.path.basename(jd_match.report_path)
    )

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import User, Resume, ATSResult
from app.services.ats_service import ATSScorer
from app.services.report_service import ReportGenerator
from app.utils.pdf_utils import extract_text_from_pdf
from pydantic import BaseModel
from typing import Optional
import os
import shutil
from datetime import datetime
from app.config import settings

router = APIRouter(prefix="/api/ats", tags=["ATS Checker"])

class ATSResponse(BaseModel):
    success: bool
    data: dict
    message: str

@router.post("/analyze", response_model=ATSResponse)
async def analyze_ats(
    file: UploadFile = File(...),
    user_id: Optional[int] = Form(None),
    db: Session = Depends(get_db)
):
    """Analyze resume for ATS compatibility"""
    
    # Validate file type
    if not file.filename.endswith(('.pdf', '.PDF')):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")
    
    # Save uploaded file
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"resume_{timestamp}_{file.filename}"
    filepath = os.path.join(settings.upload_dir, filename)
    
    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    try:
        # Extract text from PDF
        resume_text = extract_text_from_pdf(filepath)
        
        if not resume_text or len(resume_text) < 50:
            raise HTTPException(status_code=400, detail="Could not extract text from PDF")
        
        # Calculate ATS score
        ats_scorer = ATSScorer()
        result = ats_scorer.calculate_ats_score(resume_text)
        
        # Save to database if user_id provided
        if user_id:
            # Save resume record
            resume_record = Resume(
                user_id=user_id,
                file_name=file.filename,
                file_path=filepath,
                file_type="application/pdf",
                extracted_text=resume_text[:5000],  # Store first 5000 chars
                ats_score=result['overall_score'],
                uploaded_at=datetime.utcnow()
            )
            db.add(resume_record)
            db.flush()
            
            # Save ATS result
            ats_result = ATSResult(
                user_id=user_id,
                resume_id=resume_record.id,
                overall_score=result['overall_score'],
                formatting_score=result['formatting_score'],
                keywords_score=result['keywords_score'],
                readability_score=result['readability_score'],
                structure_score=result['structure_score'],
                suggestions=result['suggestions'],
                ai_analysis=result.get('ai_analysis'),
                created_at=datetime.utcnow()
            )
            db.add(ats_result)
            db.commit()
            db.refresh(ats_result)
            
            # Generate report
            report_gen = ReportGenerator()
            user = db.query(User).filter(User.id == user_id).first()
            user_name = user.full_name if user else "User"
            report_path = report_gen.generate_ats_report(result, user_name)
            
            # Update with report path
            ats_result.report_path = report_path
            db.commit()
            
            result['atsId'] = ats_result.id
            result['reportPath'] = report_path
        
        # Format response
        response_data = {
            'overallScore': result['overall_score'],
            'metrics': {
                'formatting': result['formatting_score'],
                'keywords': result['keywords_score'],
                'readability': result['readability_score'],
                'structure': result['structure_score']
            },
            'suggestions': result['suggestions'],
            'foundKeywords': result.get('found_keywords', []),
            'sectionsFound': result.get('sections_found', [])
        }
        
        if user_id:
            response_data['atsId'] = result.get('atsId')
            response_data['reportPath'] = result.get('reportPath')
        
        return {
            "success": True,
            "data": response_data,
            "message": "ATS analysis complete"
        }
        
    except Exception as e:
        print(f"Error analyzing ATS: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/download/{ats_id}")
async def download_ats_report(ats_id: int, db: Session = Depends(get_db)):
    """Download ATS report"""
    ats_result = db.query(ATSResult).filter(ATSResult.id == ats_id).first()
    
    if not ats_result or not ats_result.report_path:
        raise HTTPException(status_code=404, detail="Report not found")
    
    from fastapi.responses import FileResponse
    return FileResponse(
        ats_result.report_path,
        media_type='application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        filename=os.path.basename(ats_result.report_path)
    )

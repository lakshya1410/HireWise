from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from app.database import get_db
from app.models.models import Resume, ATSResult
from app.services.ats_service import ATSScorer
from app.services.report_service import ReportGenerator
from app.utils.pdf_utils import extract_text_from_pdf
from pydantic import BaseModel
from typing import Optional
import os
import shutil
from datetime import datetime
from app.config import settings
from bson import ObjectId

router = APIRouter(prefix="/api/ats", tags=["ATS Checker"])

class ATSResponse(BaseModel):
    success: bool
    data: dict
    message: str

@router.post("/analyze", response_model=ATSResponse)
async def analyze_ats(
    file: UploadFile = File(...),
    user_id: Optional[str] = Form(None),
    db = Depends(get_db)
):
    """Analyze resume for ATS compatibility"""
    
    print(f"=== ATS Analysis Started ===")
    print(f"File: {file.filename}")
    print(f"Content Type: {file.content_type}")
    print(f"User ID: {user_id}")
    
    # Validate file type
    if not file.filename.endswith(('.pdf', '.PDF')):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")
    
    # Save uploaded file
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"resume_{timestamp}_{file.filename}"
    filepath = os.path.join(settings.upload_dir, filename)
    
    print(f"Saving file to: {filepath}")
    
    try:
        with open(filepath, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        print(f"File saved successfully")
    except Exception as e:
        print(f"Error saving file: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to save file: {str(e)}")
    
    try:
        # Extract text from PDF
        print("Extracting text from PDF...")
        resume_text = extract_text_from_pdf(filepath)
        print(f"Extracted {len(resume_text)} characters")
        
        if not resume_text or len(resume_text) < 50:
            raise HTTPException(status_code=400, detail="Could not extract text from PDF. The file may be corrupted or scanned image.")
        
        # Calculate ATS score
        print("Calculating ATS score...")
        ats_scorer = ATSScorer()
        result = ats_scorer.calculate_ats_score(resume_text)
        print(f"ATS Score calculated: {result['overall_score']}")
        
        # Save to database if user_id provided
        if user_id:
            print(f"Saving to database for user: {user_id}")
            # Save resume record
            resume_doc = {
                "user_id": user_id,
                "file_name": file.filename,
                "file_path": filepath,
                "file_type": "application/pdf",
                "extracted_text": resume_text[:5000],  # Store first 5000 chars
                "ats_score": result['overall_score'],
                "uploaded_at": datetime.utcnow()
            }
            resume_result = await db.resumes.insert_one(resume_doc)
            resume_id = str(resume_result.inserted_id)
            print(f"Resume saved with ID: {resume_id}")
            
            # Save ATS result
            ats_doc = {
                "user_id": user_id,
                "resume_id": resume_id,
                "overall_score": result['overall_score'],
                "formatting_score": result['formatting_score'],
                "keywords_score": result['keywords_score'],
                "readability_score": result['readability_score'],
                "structure_score": result['structure_score'],
                "suggestions": result['suggestions'],
                "ai_analysis": result.get('ai_analysis'),
                "created_at": datetime.utcnow()
            }
            ats_insert = await db.ats_results.insert_one(ats_doc)
            ats_id = str(ats_insert.inserted_id)
            print(f"ATS result saved with ID: {ats_id}")
            
            # Generate report
            print("Generating report...")
            report_gen = ReportGenerator()
            user = await db.users.find_one({"_id": ObjectId(user_id)})
            user_name = user['full_name'] if user else "User"
            report_path = report_gen.generate_ats_report(result, user_name)
            print(f"Report generated: {report_path}")
            
            # Update with report path
            await db.ats_results.update_one(
                {"_id": ObjectId(ats_id)},
                {"$set": {"report_path": report_path}}
            )
            
            result['atsId'] = ats_id
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
        
        print("=== ATS Analysis Completed Successfully ===")
        
        return {
            "success": True,
            "data": response_data,
            "message": "ATS analysis complete"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"=== ERROR in ATS Analysis ===")
        print(f"Error type: {type(e).__name__}")
        print(f"Error message: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/download/{ats_id}")
async def download_ats_report(ats_id: str, db = Depends(get_db)):
    """Download ATS report"""
    try:
        ats_result = await db.ats_results.find_one({"_id": ObjectId(ats_id)})
    except:
        raise HTTPException(status_code=400, detail="Invalid ATS ID")
    
    if not ats_result or not ats_result.get('report_path'):
        raise HTTPException(status_code=404, detail="Report not found")
    
    from fastapi.responses import FileResponse
    return FileResponse(
        ats_result['report_path'],
        media_type='application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        filename=os.path.basename(ats_result['report_path'])
    )

@router.get("/resumes/{user_id}")
async def get_user_resumes(user_id: str, db = Depends(get_db)):
    """Get all resumes for a user"""
    try:
        resumes = []
        async for resume in db.resumes.find({"user_id": user_id}).sort("uploaded_at", -1):
            resumes.append({
                "resumeId": str(resume["_id"]),
                "fileName": resume["file_name"],
                "uploadedAt": resume["uploaded_at"].isoformat(),
                "atsScore": resume.get("ats_score")
            })
        
        return {
            "success": True,
            "data": resumes,
            "message": f"Found {len(resumes)} resume(s)"
        }
    except Exception as e:
        print(f"Error fetching resumes: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/resumes/file/{resume_id}")
async def get_resume_file(resume_id: str, db = Depends(get_db)):
    """Get resume file for download/preview"""
    try:
        resume = await db.resumes.find_one({"_id": ObjectId(resume_id)})
    except:
        raise HTTPException(status_code=400, detail="Invalid resume ID")
    
    if not resume or not resume.get('file_path'):
        raise HTTPException(status_code=404, detail="Resume file not found")
    
    if not os.path.exists(resume['file_path']):
        raise HTTPException(status_code=404, detail="Resume file not found on server")
    
    from fastapi.responses import FileResponse
    return FileResponse(
        resume['file_path'],
        media_type='application/pdf',
        filename=resume['file_name']
    )

@router.delete("/resumes/{resume_id}")
async def delete_resume(resume_id: str, db = Depends(get_db)):
    """Delete a resume and its associated file"""
    try:
        resume = await db.resumes.find_one({"_id": ObjectId(resume_id)})
    except:
        raise HTTPException(status_code=400, detail="Invalid resume ID")
    
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    
    # Delete physical file if exists
    if resume.get('file_path') and os.path.exists(resume['file_path']):
        try:
            os.remove(resume['file_path'])
        except Exception as e:
            print(f"Error deleting file: {e}")
    
    # Delete from database
    await db.resumes.delete_one({"_id": ObjectId(resume_id)})
    
    # Also delete associated ATS results
    await db.ats_results.delete_many({"resume_id": resume_id})
    
    # Delete associated JD matches
    await db.jd_matches.delete_many({"resume_id": resume_id})
    
    return {
        "success": True,
        "message": "Resume deleted successfully"
    }

@router.post("/analyze-stored", response_model=ATSResponse)
async def analyze_stored_resume(
    resume_id: str = Form(...),
    user_id: Optional[str] = Form(None),
    db = Depends(get_db)
):
    """Analyze a previously uploaded resume for ATS compatibility"""
    try:
        # Fetch resume from database
        resume = await db.resumes.find_one({"_id": ObjectId(resume_id)})
        if not resume:
            raise HTTPException(status_code=404, detail="Resume not found")
        
        # Use extracted text from database if available
        resume_text = resume.get('extracted_text')
        
        # If not available or too short, re-extract from file
        if not resume_text or len(resume_text) < 50:
            if not os.path.exists(resume['file_path']):
                raise HTTPException(status_code=404, detail="Resume file not found on server")
            resume_text = extract_text_from_pdf(resume['file_path'])
        
        # Calculate ATS score
        ats_scorer = ATSScorer()
        result = ats_scorer.calculate_ats_score(resume_text)
        
        # Save ATS result to database
        if user_id:
            ats_doc = {
                "user_id": user_id,
                "resume_id": resume_id,
                "overall_score": result['overall_score'],
                "formatting_score": result['formatting_score'],
                "keywords_score": result['keywords_score'],
                "readability_score": result['readability_score'],
                "structure_score": result['structure_score'],
                "suggestions": result['suggestions'],
                "ai_analysis": result.get('ai_analysis'),
                "created_at": datetime.utcnow()
            }
            ats_insert = await db.ats_results.insert_one(ats_doc)
            ats_id = str(ats_insert.inserted_id)
            
            # Generate report
            report_gen = ReportGenerator()
            user = await db.users.find_one({"_id": ObjectId(user_id)})
            user_name = user['full_name'] if user else "User"
            report_path = report_gen.generate_ats_report(result, user_name)
            
            # Update with report path
            await db.ats_results.update_one(
                {"_id": ObjectId(ats_id)},
                {"$set": {"report_path": report_path}}
            )
            
            # Update resume ATS score
            await db.resumes.update_one(
                {"_id": ObjectId(resume_id)},
                {"$set": {"ats_score": result['overall_score']}}
            )
            
            result['atsId'] = ats_id
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
        print(f"Error analyzing stored resume: {e}")
        raise HTTPException(status_code=500, detail=str(e))

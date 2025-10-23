import PyPDF2
import pdfplumber
import re
from typing import Dict, List

def extract_text_from_pdf(file_path: str) -> str:
    """Extract text from PDF using multiple methods for best results"""
    text = ""
    
    # Try pdfplumber first (better for complex PDFs)
    try:
        with pdfplumber.open(file_path) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
    except Exception as e:
        print(f"pdfplumber failed: {e}")
    
    # Fallback to PyPDF2 if pdfplumber fails
    if not text.strip():
        try:
            with open(file_path, 'rb') as file:
                pdf_reader = PyPDF2.PdfReader(file)
                for page in pdf_reader.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text += page_text + "\n"
        except Exception as e:
            print(f"PyPDF2 failed: {e}")
    
    return text.strip()

def extract_sections(text: str) -> Dict[str, str]:
    """Extract common resume sections"""
    text_lower = text.lower()
    sections = {}
    
    # Define section patterns
    section_patterns = {
        'contact': r'(email|phone|mobile|address)',
        'summary': r'(summary|objective|profile)',
        'experience': r'(experience|employment|work history)',
        'education': r'(education|academic|qualification)',
        'skills': r'(skills|technical skills|competencies)',
        'certifications': r'(certification|certificate|licenses)',
        'projects': r'(projects|portfolio)'
    }
    
    for section_name, pattern in section_patterns.items():
        if re.search(pattern, text_lower):
            sections[section_name] = True
    
    return sections

def extract_contact_info(text: str) -> Dict[str, bool]:
    """Check for contact information"""
    return {
        'has_email': bool(re.search(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b', text)),
        'has_phone': bool(re.search(r'\b\d{10}\b|\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b', text))
    }

def extract_keywords(text: str) -> List[str]:
    """Extract common professional keywords"""
    keywords = [
        'managed', 'developed', 'led', 'created', 'improved', 'achieved',
        'analyzed', 'designed', 'implemented', 'coordinated', 'executed',
        'delivered', 'optimized', 'increased', 'decreased', 'generated',
        'built', 'established', 'launched', 'streamlined', 'collaborated'
    ]
    
    text_lower = text.lower()
    found_keywords = [kw for kw in keywords if kw in text_lower]
    return found_keywords

def check_formatting(text: str) -> Dict[str, any]:
    """Check resume formatting quality"""
    issues = []
    score = 100
    
    # Check for bullet points
    bullet_indicators = ['•', '-', '*', '○', '▪']
    has_bullets = any(b in text for b in bullet_indicators)
    if not has_bullets:
        issues.append("No bullet points found. Use bullets for listing achievements.")
        score -= 10
    
    # Check length
    word_count = len(text.split())
    if word_count < 300:
        issues.append("Resume is too short. Aim for 300-800 words.")
        score -= 15
    elif word_count > 1000:
        issues.append("Resume is too long. Keep it concise (max 2 pages).")
        score -= 10
    
    # Check for dates
    date_pattern = r'\b(19|20)\d{2}\b|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec'
    if not re.search(date_pattern, text):
        issues.append("No dates found. Include dates for experience and education.")
        score -= 10
    
    return {
        'score': max(score, 0),
        'has_bullets': has_bullets,
        'word_count': word_count,
        'issues': issues
    }
